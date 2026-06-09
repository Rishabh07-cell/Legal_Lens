# LegalLens Phase 1

LegalLens Phase 1 is a REST-only Flask API with a React, Vite, and Tailwind CSS frontend for authenticated IPC-to-BNS section lookup.

## Phase 1 Scope

Backend:

- Flask application factory pattern
- Blueprints for authentication and lookup APIs
- SQLAlchemy, Flask-Migrate, and SQLite
- Flask-JWT-Extended authentication
- CORS configuration
- Environment variable configuration
- Password hashing
- JSON-only REST responses

Frontend:

- React Router
- Authentication context/state management
- API service layer
- Login and register pages
- Dashboard page
- IPC-BNS mapper page

Not included in Phase 1:

- ChromaDB
- LangChain
- RAG or AI features
- Document uploads
- Summarization
- Citation verification
- Notifications
- Admin dashboard

## Project Structure

```text
.
  app.py
  requirements.txt
  .flaskenv
  backend/
    app/
      routes/
      __init__.py
      config.py
      extensions.py
      models.py
    instance/
    requirements.txt
    run.py
  frontend/
    src/
      api/
      components/
      pages/
      routes/
      state/
    package.json
    vite.config.js
  migrations/
```

## Backend Setup

From the project root:

```powershell
pip install -r requirements.txt
Copy-Item .env.example .env
flask db init # only if migrations/ does not already exist
flask db migrate -m "initial schema"
flask db upgrade
flask seed-ipc-bns
python app.py
```

The API runs at `http://localhost:5000`.

Useful endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/ipc-bns?q=420`
- `GET /api/history`

Protected endpoints require an `Authorization: Bearer <token>` header.

## Frontend Setup

From the frontend directory:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend normally runs at `http://localhost:5173`. Vite will select the next available port if 5173 is already in use.

## Quick Manual Flow

1. Start the backend with `python app.py`.
2. Start the frontend with `npm run dev`.
3. Register a new account.
4. Open the IPC-BNS Mapper page.
5. Search for `420`, `302`, `murder`, or `cheating`.
6. Return to the dashboard to see query history.
