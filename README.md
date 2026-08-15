# Content Feed — Backend + Frontend

A content feed platform where users can browse articles, view individual items, and (when logged in) bookmark
content. Built for the Foundertruth Backend Engineering Internship assignment.

**Stack:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth, bcrypt · React 18, Vite, TypeScript, React Router v6 frontend.

---

## 1. Setup — how to run locally

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGODB_URI (e.g. mongodb://127.0.0.1:27017/content-feed)
npm run seed              # populates 30 sample content items
npm run dev               # starts TypeScript dev server on http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL should point at the backend (http://localhost:5001/api/v1)
npm run dev               # starts Vite React dev server on http://localhost:3000
```

Open `http://localhost:3000` — browse the feed, register/login, and bookmark articles.

---

## 2. Environment Variables

**Backend (`backend/.env`)**
| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on (default: `5001`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWTs — must be long and random |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Allowed CORS origin (the frontend's URL: `http://localhost:3000`) |

**Frontend (`frontend/.env`)**
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5001/api/v1` |

---

## 3. API Documentation

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/auth/register` | Public | `{ name, email, password }` |
| POST | `/auth/login` | Public | `{ email, password }` |

Both return `{ success, data: { user, token } }` on success.

### Feed
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/feed?page=1&limit=20&sort=latest` | Public | `sort` supports `latest` \| `oldest` |
| GET | `/feed/:id` | Public | Single content item |

Example response for `GET /feed`:
```json
{
  "success": true,
  "data": [ { "_id": "...", "title": "...", "publishedAt": "..." } ],
  "pagination": {
    "page": 1, "limit": 20, "totalItems": 30, "totalPages": 2,
    "hasNextPage": true, "hasPrevPage": false
  }
}
```

### Bookmarks
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/feed/:id/bookmark` | Private | 409 if already bookmarked |
| DELETE | `/feed/:id/bookmark` | Private | 404 if not bookmarked |
| GET | `/bookmarks?page=1&limit=20` | Private | Returns the user's own bookmarks, with populated content |

Send `Authorization: Bearer <token>` for all private routes.

### Error format (consistent across the API)
```json
{ "success": false, "message": "Content not found" }
```

---

## 4. Database Design

**User** — `name`, `email` (unique), `password` (bcrypt hash, `select: false` by default).
**Content** — `title`, `description`, `source`, `url`, `image`, `publishedAt`.
**Bookmark** — `user` (ref User), `content` (ref Content), timestamps.

### Indexes and why
- `User.email` — unique index. Enforces no duplicate accounts at the DB layer, not just in app code.
- `Content.publishedAt` (descending) — the feed's default and only real query pattern is "sorted by
  publish date, paginated." Without this index Mongo would have to collection-scan and sort in memory,
  which degrades badly as content grows.
- `Bookmark.{user, content}` — **compound unique index.** This is the key design decision for the
  bookmarks feature: it guarantees a user can't duplicate-bookmark the same item even under concurrent
  requests (e.g. a double-click firing two requests at once), because the DB itself rejects the second
  insert — the app-level duplicate check is a nice error message, not the actual safety net.
- `Bookmark.{user, createdAt}` — supports `GET /bookmarks` (a user's bookmarks, most recent first)
  without a full collection scan.

### Relationships
Bookmark is a join collection between User and Content (many-to-many via a junction document), rather
than embedding bookmark IDs as an array inside User. This was chosen because bookmarks have their own
metadata (`createdAt`), can grow unbounded per user (an embedded array would eventually hit MongoDB's
16MB document limit at scale), and this shape lets `GET /bookmarks` be a single indexed, paginated query.

---

## 5. Technical Decisions

1. **Compound unique index over app-level duplicate checking for bookmarks.** App code checks first for
   a friendlier error message, but the actual guarantee against duplicate bookmarks comes from the
   MongoDB index — this holds even if two requests race each other, which a plain `findOne` check
   before `create` would not reliably prevent.

2. **JWT over server-side sessions.** No session store to manage, and it fits a decoupled frontend/backend
   cleanly (the frontend can be deployed anywhere and just needs to attach a bearer token). The trade-off
   is that a JWT can't be instantly revoked before it expires — acceptable here given the token lifetime
   is kept relatively short and the assignment's scope doesn't require logout-everywhere semantics.

3. **Ownership scoping at the query level, not after fetching.** Every bookmark read/delete filters by
   `{ user: req.user._id, ... }` directly in the Mongo query, rather than fetching a bookmark by ID and
   then checking `bookmark.user === req.user._id` in JS. This means a user literally cannot retrieve or
   affect another user's data — the query just returns nothing rather than relying on an if-check that
   could be missed in a future edit.

4. **Seeded content over an external API.** Chose Option A (seeded data) to keep the assignment's actual
   focus — API design, auth, and data modeling — front and center rather than spending time on third-party
   API integration, retries, and rate limits, which the brief treats as optional.

---

## 6. Scaling considerations (how I'd improve this for more users)

- Switch offset-based pagination (`skip`/`limit`) to **cursor-based pagination** (e.g. keyed off
  `publishedAt` + `_id`) — `skip` gets slower as the offset grows because Mongo still has to walk past
  all skipped documents.
- Add a **read-through cache** (Redis) in front of the feed endpoint, since feed content changes far less
  often than it's read.
- Move to **short-lived access tokens + refresh tokens** instead of a single long-lived JWT, to allow
  faster revocation.
- Consider **read replicas** for MongoDB once read traffic (feed browsing) significantly outpaces writes
  (bookmarking).
- Rate-limit write endpoints (register, login, bookmark) to prevent abuse.

---

## 7. AI Assistance Disclosure

Built with the assistance of Claude (Anthropic) for scaffolding structure and boilerplate. All architecture
decisions, indexing choices, and error-handling patterns are understood and can be explained/defended in
the interview walkthrough, as required by the assignment brief.
