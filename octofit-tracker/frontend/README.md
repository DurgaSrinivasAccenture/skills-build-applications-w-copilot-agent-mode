# Octofit Tracker Frontend

React 19 + Vite + React Router presentation tier for the Octofit multi-tier application.

## Features

✅ **React 19** - Latest React version  
✅ **Vite** - Fast development and build tooling  
✅ **React Router v7** - Client-side routing with navigation  
✅ **Bootstrap 5** - Responsive UI components  
✅ **Vite Environment Variables** - Secure configuration via `import.meta.env`  
✅ **API Integration** - Communicates with backend at `http://localhost:8000` or GitHub Codespaces URL  

## Project Structure

```
src/
├── api.js                 # API configuration and fetch utilities
├── components/
│   ├── Users.jsx         # Users management component
│   ├── Teams.jsx         # Teams management component
│   ├── Activities.jsx    # Activities logging component
│   ├── Leaderboard.jsx   # Leaderboard rankings component
│   └── Workouts.jsx      # Workouts catalog component
├── App.jsx               # Router setup and navigation
├── main.jsx              # React Router entry point
├── App.css               # Component styles
└── index.css             # Global styles
```

## Environment Configuration

### Required Variables

- **VITE_CODESPACE_NAME** (optional): GitHub Codespace name
  - When set: `https://{VITE_CODESPACE_NAME}-8000.app.github.dev`
  - When unset: `http://localhost:8000` (default)

### Setup

1. Create `.env.local` in this directory:
   ```bash
   # For GitHub Codespaces (replace with your actual Codespace name)
   VITE_CODESPACE_NAME=your-codespace-name
   ```

   OR leave it empty for localhost development:
   ```bash
   # No VITE_CODESPACE_NAME - uses http://localhost:8000
   ```

2. See [ENV_SETUP.md](ENV_SETUP.md) for detailed configuration instructions

## Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173/`

### Build for Production
```bash
npm run build
```
Output in `dist/` directory

### Lint Code
```bash
npm run lint
```
Uses oxlint for fast linting

## API Endpoints

All components communicate with these backend endpoints:

- `GET /api/users/` - Fetch all users
- `POST /api/users/` - Create new user
- `GET /api/teams/` - Fetch all teams
- `POST /api/teams/` - Create new team
- `GET /api/activities/` - Fetch all activities
- `POST /api/activities/` - Log new activity
- `GET /api/leaderboard/` - Fetch leaderboard rankings
- `POST /api/leaderboard/` - Add leaderboard entry
- `GET /api/workouts/` - Fetch all workouts
- `POST /api/workouts/` - Create new workout

## Components

### Users
Manage fitness tracker users with name, email, and team affiliation.

### Teams
Organize athletes into teams and track collective points.

### Activities
Log fitness activities (running, cycling, strength training, etc.) with duration and date.

### Leaderboard
View ranked athletes by points. Displays top performers and team standings.

### Workouts
Browse available workouts categorized by difficulty and focus area.

## Data Handling

The frontend safely handles:
- ✅ Array responses from API
- ✅ Paginated responses (via `data.data` or `data.items`)
- ✅ MongoDB ObjectId fields (`_id`)
- ✅ Timestamps (`createdAt`, `updatedAt`)
- ✅ Network errors and loading states

## Troubleshooting

### API calls returning 404
- Verify backend is running on port 8000: `curl http://localhost:8000/api/users/`
- Check `.env.local` VITE_CODESPACE_NAME value if using Codespaces

### Frontend shows "undefined-8000" in URL
- You likely have an empty or missing VITE_CODESPACE_NAME
- Either remove it from `.env.local` to use localhost, or set the correct value

### Hot Module Reload (HMR) not working
- Restart dev server: `npm run dev`
- Clear browser cache: `Ctrl+Shift+Delete` (Cmd+Shift+Delete on Mac)

## Backend Integration

To run the complete stack:

### Terminal 1 - Backend
```bash
cd octofit-tracker/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd octofit-tracker/frontend
npm run dev
```

Both will reload on file changes thanks to Vite and tsx watchers.
