# OneFeed

A full-stack technical content feed and reading list platform built with **Node.js, Express, TypeScript, MongoDB Atlas, React 18, and Vite**.

Users can discover curated engineering articles, search and sort feed content, read in-depth technical breakdowns with syntax-highlighted code snippets, save articles to personal reading lists with duplicate prevention, and author new articles directly to MongoDB Atlas.

---

## 1. Features

- **Dynamic Feed**: Browse technical articles with real-time sorting (`latest`, `oldest`), search filtering, and pagination.
- **Rich Article Reader**: Dedicated view with executive summaries, topic tags (`#Node.js`, `#Distributed Systems`), estimated reading times, and formatted code blocks.
- **Article Authoring Studio (`+ Write`)**: Authenticated users can write and publish new engineering articles with live word-count and read-time calculation.
- **Bookmark Management**: Add/remove articles to personal reading lists. Enforced compound unique index in MongoDB guarantees zero duplicate bookmarks with `409 Conflict` handling.
- **Authentication & Authorization**: Secure user registration and login with bcrypt password hashing (10 salt rounds) and signed JSON Web Tokens (JWT).
- **MongoDB Atlas Cloud Database**: Production database cluster with indexes for optimized querying and data isolation.
- **Vercel & Render Ready**: Single-Page App (SPA) routing configuration (`vercel.json`) and dynamic CORS handling.

---

## 2. Setup — How to Install and Run Locally

### Prerequisites
- **Node.js 18+**
- **MongoDB**: Either a local instance running on port `27017` or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster URI.

---

### Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/content-feed?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

5. Seed MongoDB with 24 curated engineering articles:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5001`.

---

### Frontend Setup

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file:
   ```bash
   cp .env.example .env
   ```

4. Verify `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api/v1
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 3. Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for Express server | `5001` |
| `NODE_ENV` | Environment mode (`development`, `production`) | `development` |
| `MONGODB_URI` | MongoDB Atlas or Local connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key used to sign and verify JWTs | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT token lifetime | `7d` |
| `CLIENT_URL` | Allowed origin for CORS headers | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Base URL for the backend REST API | `http://localhost:5001/api/v1` |

---

## 4. API Documentation

Base URL: `/api/v1`

### Health Check
- **Endpoint**: `GET /health`
- **Auth**: Public
- **Response (`200 OK`)**:
  ```json
  { "success": true, "status": "ok" }
  ```

---

### Authentication Endpoints

#### Register a User
- **Endpoint**: `POST /auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Alex Developer",
    "email": "alex@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6a80c792e3f7a1f28d0a64f2",
        "name": "Alex Developer",
        "email": "alex@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

#### Log In
- **Endpoint**: `POST /auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (`200 OK`)**: Returns `token` and `user` object.
- **Error Response (`401 Unauthorized`)**: Returns `{"success": false, "message": "Invalid email or password"}` if credentials are incorrect.

---

### Feed Endpoints

#### Browse Feed (Paginated & Sorted)
- **Endpoint**: `GET /feed?page=1&limit=10&sort=latest`
- **Auth**: Public
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20, max: 100)
  - `sort` (`latest` | `oldest`, default: `latest`)
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "6a80c77cbab29dbcaf844079",
        "title": "Understanding the Node.js Event Loop and libuv Under Load",
        "description": "A deep dive into thread pools, microtask queues...",
        "author": "Danielle Heberling",
        "source": "Node.js Core",
        "readTime": "8 min read",
        "tags": ["Node.js", "libuv", "Concurrency"],
        "url": "https://nodejs.org/...",
        "image": "https://images.unsplash.com/...",
        "publishedAt": "2026-08-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 24,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

#### Fetch Single Article
- **Endpoint**: `GET /feed/:id`
- **Auth**: Public
- **Response (`200 OK`)**: Returns full article object with rich `body` content and metadata.

#### Publish New Article
- **Endpoint**: `POST /feed`
- **Auth**: Private (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "title": "Scaling WebSocket Connection Pools with Redis",
    "description": "Short summary of the architecture...",
    "body": "### Problem Statement\n\nFull markdown body...",
    "source": "Personal Blog",
    "author": "Alex Developer",
    "tags": ["WebSockets", "Redis", "Architecture"],
    "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
  }
  ```
- **Response (`201 Created`)**: Persists document to MongoDB Atlas and returns created article.

---

### Bookmark Endpoints

#### Save Bookmark
- **Endpoint**: `POST /feed/:id/bookmark`
- **Auth**: Private (`Authorization: Bearer <token>`)
- **Response (`201 Created`)**: Creates bookmark link in Atlas.
- **Duplicate Response (`409 Conflict`)**: Returns `{"success": false, "message": "Content is already bookmarked"}` if already saved.

#### Remove Bookmark
- **Endpoint**: `DELETE /feed/:id/bookmark`
- **Auth**: Private (`Authorization: Bearer <token>`)
- **Response (`200 OK`)**: `{"success": true, "message": "Bookmark removed"}`.

#### Get User Bookmarks
- **Endpoint**: `GET /bookmarks?page=1&limit=20`
- **Auth**: Private (`Authorization: Bearer <token>`)
- **Response (`200 OK`)**: Returns user's saved reading list with populated article objects.

---

## 5. Database Design & Indexes

### Collections

1. **`User` Collection**
   - **Schema**: `name` (String), `email` (String, unique, lowercase), `password` (String, bcrypt hash, `select: false`), `timestamps`.
   - **Indexes**:
     - Unique index on `email`: Guarantees account uniqueness at the database engine level.

2. **`Content` Collection**
   - **Schema**: `title` (String, required), `description` (String), `body` (String), `source` (String), `author` (String), `tags` (Array of Strings), `readTime` (String), `url` (String), `image` (String), `publishedAt` (Date), `timestamps`.
   - **Indexes**:
     - Descending index on `{ publishedAt: -1 }`: Eliminates in-memory sorting costs for paginated feed queries.

3. **`Bookmark` Collection**
   - **Schema**: `user` (ObjectId ref `User`), `content` (ObjectId ref `Content`), `timestamps`.
   - **Indexes**:
     - **Compound Unique Index on `{ user: 1, content: 1 }`**: Physically prevents duplicate bookmarks at the storage layer, avoiding race conditions.
     - **Compound Sort Index on `{ user: 1, createdAt: -1 }`**: Accelerates retrieval of user bookmarks sorted newest first.

---

## 6. Technical Decisions

1. **Database-Level Compound Unique Index for Idempotency**:
   - Rather than relying on race-condition-prone application-level read checks (`findOne` then `create`), duplicate prevention is enforced via MongoDB's unique compound index on `{ user: 1, content: 1 }`. MongoDB duplicate key errors (`code 11000`) are caught and translated into clean `409 Conflict` responses.

2. **Normalized Junction Collection vs Embedded Arrays**:
   - Bookmarks are stored in a dedicated junction collection instead of embedding bookmark IDs inside a `User.bookmarks` array. This prevents unbounded array growth, avoids MongoDB's 16MB document size ceiling, keeps user auth payloads lightweight, and allows bookmarks to carry their own indexed `createdAt` metadata.

3. **Database-Level Ownership Scoping**:
   - All bookmark read and write queries are strictly scoped to `{ user: req.user._id }` at the database query level rather than fetching data into memory and checking authorization in code. This ensures complete data isolation between users.

4. **Centralized Error Handling with Async Wrapper**:
   - An `asyncHandler` higher-order wrapper captures promise rejections automatically, routing all errors through a single `errorHandler` middleware. This guarantees a uniform `{ success: false, message: "..." }` response shape across all endpoints and maps Mongoose `CastError`, validation errors, duplicate keys, and auth failures to proper HTTP status codes (`400`, `401`, `404`, `409`, `500`).

---

## 7. Deployment Guide

### Deploying Backend to Render / Railway
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app) connected to your repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas URI string
   - `JWT_SECRET`: Your production secret
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or `*`)
5. In **MongoDB Atlas** → **Network Access**, ensure `0.0.0.0/0` (Allow access from anywhere) is enabled.

### Deploying Frontend to Vercel
1. Create a new project on [Vercel](https://vercel.com) and import your repository.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api/v1`
5. Deploy. The included [`frontend/vercel.json`](frontend/vercel.json) handles client-side SPA routing automatically.

---

## 8. Project Structure

```
content-feed/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB Atlas connection (db.ts)
│   │   ├── controllers/    # authController, feedController, bookmarkController
│   │   ├── middleware/     # JWT guard (auth.ts), errorHandler.ts
│   │   ├── models/         # User.ts, Content.ts, Bookmark.ts
│   │   ├── routes/         # authRoutes.ts, feedRoutes.ts, bookmarkRoutes.ts
│   │   ├── utils/          # AppError.ts, asyncHandler.ts, generateToken.ts
│   │   ├── seed.ts         # 24 technical sample articles seed script
│   │   ├── app.ts          # Express configuration & CORS
│   │   └── server.ts       # Server entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/             # newspaper.svg favicon
│   ├── src/
│   │   ├── components/     # Navbar, FeedCard, HeroSection, Footer, ScrollToTop
│   │   ├── context/        # AuthContext, ToastContext
│   │   ├── lib/            # api.ts (fetch client)
│   │   ├── pages/          # FeedPage, ArticlePage, BookmarksPage, CreateArticlePage, LoginPage, RegisterPage
│   │   ├── types/          # TypeScript domain interfaces
│   │   ├── App.tsx         # Route definitions
│   │   └── index.css       # Design tokens & semantic styling
│   ├── vercel.json         # SPA rewrite rules
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 9. AI Usage

Built primarily using Google Antigravity (agentic IDE) and Claude for scaffolding and verification planning. No ChatGPT was used, so no ChatGPT link is included.

---

## 10. Author & Connect

- **Author**: Kaif Mohd
- **GitHub**: [@iamkaifyyy](https://github.com/iamkaifyyy)
- **Repository**: [https://github.com/iamkaifyyy/content-feed](https://github.com/iamkaifyyy/content-feed)
- **LinkedIn**: [iamkaifyyy](https://linkedin.com/in/iamkaifyyy)
- **Email**: [mkaifm728@gmail.com](mailto:mkaifm728@gmail.com)

---

## License

MIT
