# Octofit Frontend Environment Configuration

## Required Environment Variables

### VITE_CODESPACE_NAME
**Type:** String (optional)
**Default:** If not set, falls back to `http://localhost:8000`
**Description:** GitHub Codespace name used to construct the API base URL

When running in GitHub Codespaces, set this to your Codespace name to enable the frontend to communicate with the backend API via:
```
https://{VITE_CODESPACE_NAME}-8000.app.github.dev
```

### How to Configure

#### For Local Development (localhost)
Create `.env.local` in the `octofit-tracker/frontend` directory and leave it empty or omit `VITE_CODESPACE_NAME`. The frontend will default to `http://localhost:8000`.

**Example `.env.local` for localhost:**
```
# No VITE_CODESPACE_NAME set - uses http://localhost:8000
```

#### For GitHub Codespaces
Create `.env.local` in the `octofit-tracker/frontend` directory with your Codespace name:

**Example `.env.local` for Codespaces:**
```
VITE_CODESPACE_NAME=bookish-palm-tree-xr97xv5qwxvxfppp6
```

You can find your Codespace name in:
- GitHub Codespaces UI
- Terminal prompt (part of the hostname)
- Environment variable `$CODESPACE_NAME`

### API Endpoints

The frontend will automatically construct API endpoints based on the configuration:

- **Localhost:** `http://localhost:8000/api/[component]/`
- **Codespaces:** `https://{VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/`

Where `[component]` is one of: `users`, `teams`, `activities`, `leaderboard`, `workouts`

### Running the Frontend

```bash
cd octofit-tracker/frontend
npm install
npm run dev
```

The development server will start on `http://localhost:5173` and automatically redirect API requests based on your `.env.local` configuration.
