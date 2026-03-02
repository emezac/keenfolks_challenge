# Campaign Creator MVP

This is an end-to-end MVP for marketing automation built with React (Frontend) and FastAPI (Backend).

## Architecture
The application separates concerns cleanly:
- **Frontend**: React + Vite, TailwindCSS, React Query
- **Backend**: FastAPI + Python, Pydantic, SQLite (in-memory/file).

Check out [docs/architecture.md](docs/architecture.md) for more details.

## How to Run Locally

You can run both the frontend and backend locally with ease. 

### Backend
1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment (Optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the API:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will be running at `http://localhost:8000`.

### Frontend
1. Go to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Access the UI at `http://localhost:5173`. Make sure to navigate to `/campaigns/new` to view the campaign creator.

## Total Time Spent
Total time spent on this challenge: ~3.5 hours.

## If I had more time, I'd prioritize...
1. **Infrastructure**: Replacing SQLite with PostgreSQL using SQLAlchemy and setting up Docker Compose.
2. **Testing**: Expanding end-to-end tests with Playwright or Cypress for the frontend.
3. **Authentication**: Adding OAuth2 / JWT to secure the API.
4. **State Management**: Handling complex API error states and retries more elegantly.
5. **CI/CD**: Setting up GitHub Actions to run the tests and linter automatically.
