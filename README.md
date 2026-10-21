# Crime Watch

Crime Watch is a React crime-reporting interface backed by an Express API and MongoDB. Citizens can submit and track reports; moderators and administrators can review them. Only verified reports are returned to the public map and analytics.

## Architecture

- `crime/client`: React 18 interface, React Router, Leaflet map, Axios API client.
- `crime/server`: Express API, Mongoose models, JWT authentication, validation, role authorization, analytics aggregation.
- MongoDB Community Server or MongoDB Atlas: persistent users and reports. MongoDB Compass is a desktop client for connecting to and inspecting a MongoDB server; Compass is not the database server.

## Requirements

- Node.js 20 or newer and npm
- MongoDB Community Server locally, or a MongoDB Atlas connection string
- MongoDB Compass (optional, for managing and inspecting records)
- Postman (optional, for manual API checks)

## Configure

Install dependencies in both app folders:

```powershell
cd crime\server
npm install
cd ..\client
npm install
```

On the first local server start, the `prestart` script creates `crime/server/.env` when needed and generates independent JWT secrets automatically. To generate them before starting, run `npm run setup` from `crime/server`. The file is ignored by Git and must remain private. Set `MONGODB_URI` in that file to your local or Atlas connection string. You can also copy `crime/server/.env.example` and set both JWT secrets manually; they must each be at least 32 characters. For example, generate each secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The API requires `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`; local start generates the secrets if needed, while production requires them to be supplied in the environment. Refresh sessions are stored as a hash in MongoDB and delivered to the browser in an HTTP-only cookie. Access tokens are short-lived and kept in memory by the frontend.

Create `crime/client/.env` from `crime/client/.env.example` if the API URL or Google sign-in client ID needs to be changed. Email/password registration and login are free and work without any third-party client ID. Google sign-in is optional and only appears when a Google OAuth web client ID is configured in both the frontend and backend environment files.

## Run locally

In one terminal:

```powershell
cd crime\server
npm run dev
```

In another terminal:

```powershell
cd crime\client
npm start
```

The UI runs at `http://localhost:3000` and API at `http://localhost:5000`. Check API/database availability at `http://localhost:5000/health`.

On API startup, Mongoose initializes the `users` and `reports` collections and their schema indexes. The collections are available in MongoDB Compass under the database named by `MONGODB_URI`.

## Roles and moderation

Self-registration always creates a `citizen`; the API ignores role values sent during registration. To bootstrap a trusted administrator, register the first account and update that account's `role` field to `administrator` using MongoDB Compass or a controlled database administration procedure. Administrators can assign `moderator` or `administrator` to other trusted accounts. Never expose role editing as a public API.

Reports can be submitted without signing in; those submissions are anonymous and are not linked to a user account. A signed-in citizen may also mark a report anonymous: the server keeps its owner link private so it remains visible in that citizen's report history, while public report responses never expose the reporter's account ID. The browser asks for location permission on submit if coordinates have not already been provided; the user may enter coordinates manually instead. Anonymous submissions are rate-limited by IP.

Citizens can create reports and edit or delete their own pending reports. Moderators and administrators can use the Moderation tab to verify or reject pending reports. Verified reports are visible on the public map and are included in database analytics. All of these permissions are enforced by the API, not just the UI. To connect MongoDB Compass, first start MongoDB Community Server or provision an Atlas cluster, put its connection URI in `crime/server/.env` as `MONGODB_URI`, then use the same URI in Compass. Compass connects to a server; it does not provide the database service itself.

## API outline

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a citizen account |
| `POST` | `/api/auth/login` | Public | Sign in with email and password |
| `POST` | `/api/auth/google` | Public | Verify a Google ID credential |
| `POST` | `/api/auth/refresh` | Refresh cookie | Rotate the refresh session |
| `POST` | `/api/auth/logout` | Public | Revoke and clear the refresh session |
| `GET` | `/api/auth/profile` | Signed in | Get the signed-in user's profile |
| `POST` | `/api/reports` | Public; optional sign-in | Submit an anonymous pending report |
| `GET` | `/api/reports` | Signed in | List the caller's reports |
| `GET` | `/api/reports/public` | Public | List verified reports (supports `crimeType`, `limit`, and optional `latitude`, `longitude`, `radiusKm`) |
| `GET` | `/api/reports/moderation` | Moderator/admin | List pending reports |
| `PATCH` | `/api/reports/:id` | Owner/admin | Edit a pending report |
| `DELETE` | `/api/reports/:id` | Owner/admin | Delete a pending report |
| `PATCH` | `/api/reports/:id/moderate` | Moderator/admin | Verify or reject a report |
| `GET` | `/api/analytics` | Public | Aggregate verified reports by type, time, and location |

Use `Authorization: Bearer <accessToken>` for protected routes. The frontend handles the access token and refresh cookie automatically. Every report must include `crimeType`, `description`, `location`, `latitude`, `longitude`, and an ISO date/time in `time`.

## Verify

Run the backend API tests and frontend production build:

```powershell
cd crime\server
npm test
cd ..\client
npm run build
```

The backend tests use Jest and Supertest and do not require a running MongoDB instance. For an end-to-end local check, register a citizen, submit a report, change that account to moderator in Compass, sign in again, verify the report in the Moderation tab, then confirm that the verified report appears on the map and in analytics.
