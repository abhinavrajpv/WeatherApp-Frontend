# Weather Station – Frontend

A basic React (Vite) frontend for the WeatherApp Spring Boot backend. Covers:

- Register / login (JWT access + refresh tokens, stored in `localStorage`)
- Automatic token refresh on a single 401 before failing a request
- List, add, and remove saved cities
- Look up current weather for a city + state

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if the backend isn't on localhost:8080
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

## Backend requirement: CORS

The backend's `SecurityConfig` currently has no CORS configuration, so the
browser will block requests from the Vite dev server's origin
(`http://localhost:5173`) by default. Add a `CorsConfigurationSource` bean
and call `.cors(...)` in the security filter chain, allowing that origin
(and your production frontend origin later), or the frontend's requests
will fail before they reach any controller.

## Notes / simplifications

- No router library — the app just swaps between Login / Register / Dashboard
  and Cities / Weather tabs with component state, to keep dependencies minimal.
- The backend's role checks (`ADMIN` for adding/deleting cities) aren't
  mirrored in the UI — everyone sees the same forms, and a 403 from the
  API is shown as a banner message. Add role-aware UI once you decide how
  the frontend should learn the signed-in user's role (e.g. return it from
  `/auth/login` alongside the tokens).
- Styling is a small hand-written stylesheet (`src/styles.css`), no UI
  framework.
