# Frontend

This is the React + Vite frontend for the video processing platform. It provides authentication, role-aware uploads, filtering, live status updates, and secure video playback against the backend API.

## Features

- Register and log in users
- Upload videos for moderation and streaming
- Enforce a 10 MB maximum upload size in the UI
- Browse and filter uploaded videos
- Receive live processing updates over Socket.IO
- Stream processed videos
- Admin-only user management

## Tech Stack

- React 19
- Vite 6
- Socket.IO client

## Requirements

- Node.js 18+
- npm

## Environment Variables

Create a local `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:4000
```

Example production config is available in [`.env.example`](/Users/prashant/projects/video_processing/frontend/.env.example).

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The Vite dev server will usually start at `http://localhost:5173`.

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the built app locally

## Backend Dependency

This frontend expects the backend API to be running and reachable through `VITE_API_URL`. The backend should expose authentication, video, and user endpoints, plus Socket.IO support for live updates.

## Notes

- Uploads accept video files only.
- Video uploads larger than 10 MB are rejected before submission.
- If `VITE_API_URL` is not set, the app falls back to `http://localhost:4000`.
