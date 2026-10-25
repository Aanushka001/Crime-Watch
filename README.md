# Crime Watch

Community crime reporting and location-based safety awareness.

Crime Watch is a React application with a Node.js/Express API and MongoDB. Users can submit reports, request location capture from their browser, follow report review outcomes, and explore verified reports on an interactive Leaflet map. Email/password sign-in is built in; Google sign-in is optional.

> **Demo data:** The optional local seed command inserts four clearly labeled fictional sample reports around Chennai for screenshots and UI previews. They are not real incidents and should never be treated as public-safety information.

## Features

- Register and sign in using email and password; optional Google sign-in.
- Submit reports anonymously or while signed in, with optional browser location capture.
- View personal report history and moderation updates after signing in.
- Review reports with citizen, moderator, and administrator roles.
- Show verified reports on the map and in database-backed analytics.
- Use MongoDB Compass to inspect local users, reports, and indexes.

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| User interface | React 18, Vite | Application screens and production builds |
| Navigation | React Router | Client-side routes and dashboard tabs |
| Map | Leaflet, React Leaflet, OpenStreetMap | Interactive report map |
| API client | Axios | Frontend-to-backend HTTP requests |
| Runtime | Node.js | Backend JavaScript runtime |
| API | Express | Authentication, validation, reporting, moderation, and analytics |
| Database | MongoDB | Persistent user and report records |
| ODM | Mongoose | Schemas, validation, and geospatial indexes |
| Authentication | JWT and HTTP-only refresh cookies | Short-lived access tokens and refresh sessions |
| Tests | Jest and Supertest | Backend API tests |

## Architecture

```text
React + Vite client
    | JSON API, JWT access token, HTTP-only refresh cookie
    v
Node.js + Express API
    | Mongoose models, queries, geospatial index, aggregations
    v
MongoDB Community Server or MongoDB Atlas
    ^
MongoDB Compass (optional desktop client for inspection)
```

Compass is a database GUI, not the MongoDB server. Start a local MongoDB Community Server instance or configure an Atlas connection before running the API.

## Requirements

- Node.js 20 or newer and npm
- MongoDB Community Server locally, or a MongoDB Atlas URI
- MongoDB Compass (optional)

## Install and configure

Clone the repository, then install the independent server and client dependencies:

```powershell
git clone https://github.com/Aanushka001/Crime-Watch.git
cd Crime-Watch
cd crime\server
npm install
cd ..\client
npm install
```

The server creates `crime/server/.env` and generates independent JWT secrets on first start. To create it first, run `npm run setup` from `crime/server`. Set `MONGODB_URI` to your local or Atlas database URI. You may also create the file from `crime/server/.env.example` and provide two different JWT secrets of at least 32 characters. The `.env` file is ignored by Git; keep credentials private.

The client can run without any third-party client ID. Email/password authentication works by default. Google sign-in is optional and requires `GOOGLE_CLIENT_ID` on the server and `VITE_GOOGLE_CLIENT_ID` in `crime/client/.env`.

## Run locally

Start MongoDB first, then run each app in its own terminal.

**Terminal 1 — API** (`crime/server`):

```powershell
cd crime\server
npm start
```

**Terminal 2 — Client** (`crime/client`):

```powershell
cd crime\client
npm start
```

The client is available at `http://localhost:3000`, the API at `http://localhost:5000`, and the database health check at `http://localhost:5000/health`. On startup, Mongoose initializes the `users` and `reports` collections and their indexes in the database selected by `MONGODB_URI`.

## Sample screenshots

Screenshots below show the running application and local MongoDB demo records. The demo records are fictional.

| Live map | Analytics |
| --- | --- |
| ![Crime Watch live map with fictional demo records](docs/screenshots/crime-watch-map.png) | ![Crime Watch analytics with fictional demo records](docs/screenshots/crime-watch-analytics.png) |

| MongoDB Compass demo records |
| --- |
| ![Fictional demo records in the Crime Watch MongoDB reports collection](docs/screenshots/mongodb-demo-records.png) |

## Load local demo records

With the local API environment configured, run this command from `crime/server`:

```powershell
npm run seed:demo
```

This inserts or refreshes four deterministic, verified records marked `isDemo: true`, with locations and descriptions labeled as fictional demo data. It is restricted to a non-production local MongoDB host and does not modify user accounts or other reports. Re-running it updates those demo records. Do not run it against production.

## Roles and report review

Self-registration always creates a citizen; the API ignores a role supplied by the client. To grant administrator access to a trusted account, register it normally, open the configured database in Compass, and find that account by its exact email in the `users` collection. After verifying the account details, change only its `role` field to `"administrator"`. Save, then sign out and back in to refresh the role in the access token. Never grant an admin role through public registration or share the account password.

Administrators can view all reports and their statuses and verify or reject pending reports. Moderators can review pending reports. Signed-in users see the review status, note, and time in My Reports. Signed-in anonymous reports stay associated with the submitter privately for history; public responses omit reporter and reviewer IDs. Reports submitted without signing in cannot be shown in an account history. Review updates are shown in the application; email notifications are not configured.

## API overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a citizen account |
| `POST` | `/api/auth/login` | Public | Sign in with email and password |
| `POST` | `/api/auth/google` | Public; optional config | Verify Google sign-in |
| `POST` | `/api/auth/refresh` | Refresh cookie | Rotate a refresh session |
| `POST` | `/api/auth/logout` | Public | Revoke and clear the refresh session |
| `GET` | `/api/auth/profile` | Signed in | Read the current profile |
| `POST` | `/api/reports` | Public; optional sign-in | Submit a report |
| `GET` | `/api/reports` | Signed in | Read the caller's report history |
| `GET` | `/api/reports/public` | Public | List verified reports, optionally by type and distance |
| `GET` | `/api/reports/moderation` | Moderator/admin | List pending reports; admins see all statuses |
| `PATCH` | `/api/reports/:id` | Owner/admin | Edit a permitted pending report |
| `DELETE` | `/api/reports/:id` | Owner/admin | Delete a permitted pending report |
| `PATCH` | `/api/reports/:id/moderate` | Moderator/admin | Verify or reject a report |
| `GET` | `/api/analytics` | Public | Aggregate verified reports by type, time, and location |

Protected API routes use `Authorization: Bearer <access-token>`. Each report includes a crime type, description, location, coordinates, and an ISO date/time.

## Verify

```powershell
cd crime\server
npm test
npm run lint
cd ..\client
npm run lint
npm run build
```

Backend tests use mocks and do not require MongoDB. A real persistence check requires the configured database to be running.
