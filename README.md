# OneFeed

A full-stack content aggregation and reading list application built with Node.js, Express, TypeScript, MongoDB, React 18, and Vite.

---

## 1. Setup — How to Install and Run Locally

### Prerequisites
- Node.js 18+
- MongoDB instance running locally on port `27017` or a MongoDB Atlas URI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create local environment file from example:
   ```bash
   cp .env.example .env
   ```
4. Seed the database with 24 sample engineering articles:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5001`.

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create local environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 2. Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for the Express server to listen on | `5001` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB connection URI string | `mongodb://127.0.0.1:27017/content-feed` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your_super_secret_jwt_key_change_me` |
| `JWT_EXPIRES_IN` | Token expiration lifetime | `7d` |
| `CLIENT_URL` | Allowed origin for CORS headers | `http://localhost:3000` |
| `EXTERNAL_API_KEY` | Optional key for external content API integrations | `your_external_api_key_here` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Base endpoint URL for the backend API | `http://localhost:5001/api/v1` |

---

## 3. API Documentation

Base URL: `/api/v1`

### Authentication Endpoints

#### Register a User
- **Method & Path**: `POST /auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Dev User",
    "email": "devuser@domain.com",
    "password": "securepassword123"
  }
  ```
- **Example Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6a80b37254d36c337a7945e8",
        "_id": "6a80b37254d36c337a7945e8",
        "name": "Dev User",
        "email": "devuser@domain.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

#### Log In
- **Method & Path**: `POST /auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "devuser@domain.com",
    "password": "securepassword123"
  }
  ```
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6a80b37254d36c337a7945e8",
        "name": "Dev User",
        "email": "devuser@domain.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

---

### Feed Endpoints

#### Browse Feed (Paginated & Sorted)
- **Method & Path**: `GET /feed?page=1&limit=10&sort=latest`
- **Auth**: Public
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20, max: 100)
  - `sort` (`latest` \| `oldest`, default: `latest`)
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "6a80b1e3763cfc4a864b0d23",
        "_id": "6a80b1e3763cfc4a864b0d23",
        "title": "Understanding the Node.js Event Loop and libuv Under Load",
        "description": "A deep dive into thread pools, microtask queues, and how asynchronous I/O is managed when handling high concurrency in Node.js services.",
        "source": "Node.js Core",
        "url": "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
        "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-08-14T18:37:23.253Z"
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
- **Method & Path**: `GET /feed/:id`
- **Auth**: Public
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "6a80b1e3763cfc4a864b0d23",
      "title": "Understanding the Node.js Event Loop and libuv Under Load",
      "description": "A deep dive into thread pools, microtask queues...",
      "source": "Node.js Core",
      "url": "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
      "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
      "publishedAt": "2026-08-14T18:37:23.253Z"
    }
  }
  ```

---

### Bookmark Endpoints

#### Save Bookmark
- **Method & Path**: `POST /feed/:id/bookmark`
- **Auth**: Private (Requires `Authorization: Bearer <token>`)
- **Example Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "6a80b37254d36c337a7945ed",
      "user": "6a80b37254d36c337a7945e8",
      "content": "6a80b1e3763cfc4a864b0d23",
      "createdAt": "2026-08-15T18:44:02.326Z"
    }
  }
  ```

#### Remove Bookmark
- **Method & Path**: `DELETE /feed/:id/bookmark`
- **Auth**: Private (Requires `Authorization: Bearer <token>`)
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Bookmark removed"
  }
  ```

#### Get User Bookmarks
- **Method & Path**: `GET /bookmarks?page=1&limit=20`
- **Auth**: Private (Requires `Authorization: Bearer <token>`)
- **Example Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "6a80b37254d36c337a7945ed",
        "user": "6a80b37254d36c337a7945e8",
        "content": {
          "id": "6a80b1e3763cfc4a864b0d23",
          "title": "Understanding the Node.js Event Loop and libuv Under Load",
          "source": "Node.js Core",
          "url": "https://nodejs.org/..."
        },
        "createdAt": "2026-08-15T18:44:02.326Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

---

## 4. Database Design & Indexes

### Collections

1. **User Collection (`User`)**
   - **Fields**: `name` (String, required), `email` (String, unique, lowercase, regex-validated), `password` (String, bcrypt hash, `select: false`), timestamps.
   - **Indexes**:
     - Unique index on `email`: Enforces account uniqueness at the database engine level.

2. **Content Collection (`Content`)**
   - **Fields**: `title` (String, required), `description` (String), `source` (String), `url` (String, required), `image` (String), `publishedAt` (Date, required), timestamps.
   - **Indexes**:
     - Descending index on `{ publishedAt: -1 }`: Eliminates in-memory sorting costs for paginated feed browsing.

3. **Bookmark Collection (`Bookmark`)**
   - **Fields**: `user` (ObjectId ref to `User`), `content` (ObjectId ref to `Content`), timestamps.
   - **Indexes**:
     - **Compound Unique Index on `{ user: 1, content: 1 }`**: Guarantees zero duplicate bookmarks per user, even under concurrent or rapid duplicate clicks.
     - **Compound Sort Index on `{ user: 1, createdAt: -1 }`**: Optimizes retrieval of a user's reading list ordered by newest bookmark first.

---

## 5. Technical Decisions

1. **Database-Level Compound Unique Index for Idempotent Bookmarks**:
   - Rather than relying solely on application-level `findOne` checks before insertion, duplicate prevention is enforced via MongoDB's unique compound index on `{ user: 1, content: 1 }`. This prevents race conditions when concurrent requests hit the API and gracefully translates duplicate key errors (`code 11000`) into clean `409 Conflict` responses.

2. **Normalized Junction Collection vs. Embedded Arrays**:
   - Bookmarks are modeled as a standalone relational junction collection rather than embedding bookmark IDs inside an array in the `User` document. This avoids MongoDB's 16MB document size ceiling, keeps user authentication payloads lightweight, and allows bookmarks to carry their own indexed metadata (`createdAt`) with native pagination.

3. **Query-Level Data Isolation (Ownership Scoping)**:
   - For all bookmark mutations and reads, filters are strictly scoped to `{ user: req.user._id }` at the database query level rather than fetching documents and checking authorization in application memory. This ensures users cannot inspect or mutate other users' bookmarks.

4. **Centralized Error Handling with Async Middleware Wrapper**:
   - Used an `asyncHandler` higher-order wrapper around controller functions to catch promise rejections automatically, routing all errors through a single `errorHandler` middleware. This guarantees a uniform `{ success: false, message: "..." }` response shape across all endpoints and maps Mongoose `CastError`, validation errors, and auth failures to proper HTTP status codes (`400`, `401`, `404`, `409`, `500`).

---

## 6. Project Structure

```
content-feed/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection (db.ts)
│   │   ├── controllers/    # Route controllers (authController, feedController, bookmarkController)
│   │   ├── middleware/     # Auth verification (auth.ts) and errorHandler (errorHandler.ts)
│   │   ├── models/         # Mongoose models (User.ts, Content.ts, Bookmark.ts)
│   │   ├── routes/         # Express routers (authRoutes, feedRoutes, bookmarkRoutes)
│   │   ├── utils/          # AppError, asyncHandler, generateToken
│   │   ├── seed.ts         # Database population script (24 sample articles)
│   │   ├── app.ts          # Express application setup
│   │   └── server.ts       # Server entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, HeroSection, FeedCard, CodeSection, Footer
│   │   ├── context/        # AuthContext, ToastContext
│   │   ├── lib/            # api.ts (fetch client wrapper)
│   │   ├── pages/          # FeedPage, ArticlePage, BookmarksPage, LoginPage, RegisterPage
│   │   ├── types/          # TypeScript domain interfaces
│   │   ├── App.tsx         # Main route configuration
│   │   └── index.css       # Design tokens & semantic CSS classes
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 7. AI Usage

Built primarily using Google Antigravity (agentic IDE) and Claude for scaffolding and verification planning. No ChatGPT was used, so no ChatGPT link is included.

---

## License

MIT
