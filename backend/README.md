# Smart Interview Agent Backend

Python FastAPI backend for the IPHIPI interview preparation platform.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
source ../.venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file is already created with default settings. Update API keys as needed:

```bash
# In backend/.env
ADZUNA_APP_ID=your_id
ADZUNA_APP_KEY=your_key
LLM_PROVIDER=anthropic  # or openai, etc.
LLM_API_KEY=your_key
LLM_MODEL=claude-opus-4-7
```

### 3. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

API documentation will be available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user

### Profile
- `GET /api/profile` - Fetch user profile
- `PUT /api/profile` - Update profile

### Resume
- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/parse` - Parse and analyze resume

### Jobs
- `GET /api/jobs` - Search jobs with filters

### Interview
- `POST /api/interview/start` - Start new interview session
- `POST /api/interview/submit-answer` - Submit answer with metrics
- `POST /api/interview/get-feedback` - Get session feedback
- `GET /api/interview/sessions` - Get interview history

### WebSocket
- `WS /ws/interview?sessionId=<id>` - Real-time metrics during interview

## Database

SQLite database (`iphipi.db`) is created automatically on first run.

### Schema
- `users` - User accounts
- `profiles` - User profiles (skills, experience, education, etc.)
- `interview_sessions` - Interview records
- `feedback_reports` - Feedback for completed sessions

## Architecture

```
main.py              - FastAPI app setup, CORS, lifespan
├── models/          - SQLAlchemy ORM models
├── schemas/         - Pydantic validation schemas
├── routers/         - API endpoints
│   ├── auth.py
│   ├── profile.py
│   ├── resume.py
│   ├── jobs.py
│   ├── interview.py
│   └── ws.py
├── services/        - Business logic
│   ├── resume_parser.py
│   ├── profile_analyzer.py
│   ├── job_service.py
│   ├── interview_agent.py
│   ├── visual_analyzer.py
│   ├── audio_analyzer.py
│   ├── technical_scorer.py
│   └── feedback_generator.py
└── utils/           - Utilities
    ├── auth.py      - JWT, password hashing
    └── file_utils.py
```

## Features (Ready)

✅ Authentication (JWT)
✅ User profiles with JSON nested data
✅ Resume upload & parsing (text extraction)
✅ Job search with match scoring
✅ Interview session management
✅ Real-time metrics streaming (WebSocket)
✅ Feedback generation

## Features (LLM TBD)

These services are stubbed and ready for LLM integration:
- Profile analysis from resume
- Question generation & adaptive difficulty
- Technical answer scoring
- Session-level feedback & recommendations

Update the service functions in `services/` when you decide on an LLM provider.

## Testing with curl/Postman

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123"}'

# Get profile (replace TOKEN with access token)
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer TOKEN"

# Search jobs
curl -X GET "http://localhost:8000/api/jobs?query=python+engineer" \
  -H "Authorization: Bearer TOKEN"
```

## Notes

- Backend expects frontend at http://localhost:5173
- CORS is configured to allow frontend origin
- All timestamps are UTC
- Session metrics accumulate during WebSocket connection
