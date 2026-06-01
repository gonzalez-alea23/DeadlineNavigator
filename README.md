<p align="center">
  <h1>DeadlineNavigator</h1>
  <p>
    <strong>Smart Assignment & Task Management System</strong>
    <br/>
    <sub>Intelligent deadline tracking and task organization for students</sub>
  </p>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,ts,python,fastapi,mysql,docker,githubactions" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat" />
  <img src="https://img.shields.io/badge/version-1.0.0-purple?style=flat" />
  <img src="https://img.shields.io/badge/status-active-success?style=flat" />
  <img src="https://img.shields.io/badge/python-3.11%2B-blue?style=flat" />
  <img src="https://img.shields.io/badge/node-18%2B-brightgreen?style=flat" />
</p>

---

## 📌 Overview

**DeadlineNavigator** is an intelligent assignment and task management system designed to solve the problem of scattered deadlines and missed submissions. Students often struggle to track assignments distributed across multiple platforms (Google Classroom, Canvas, Slack, Email), making it difficult to maintain an overview of upcoming deadlines.

DeadlineNavigator provides a unified platform where students can see all assignments in one place, automatically track deadlines across courses, receive intelligent notifications, sync to Google Calendar, and get data-driven workload insights.

---

## ✨ Features

- 🔐 **Authentication** — Secure login with email and password
- 📊 **Unified Dashboard** — Centralized view with quick stats (due today, overdue, completed)
- 📅 **Flexible Views** — Table view for task management + Calendar view for visual tracking
- 🔔 **Smart Notifications** — Customizable reminders (1, 3, 5, 7 days before deadline) via email
- 🗓️ **Google Calendar Sync** — Push assignments directly to your personal calendar
- 📈 **Analytics** — Priority distribution, deadline forecasting, completion rate tracking
- 🎓 **Course Organization** — Group assignments by subject with priority levels (Low → Critical)

---

## 🛠️ Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Calendar_API-4285F4?style=flat&logo=google-calendar&logoColor=white" />
</p>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ / TypeScript | SSR web application |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | FastAPI / Python 3.11+ | High-performance REST API |
| **Database** | MySQL 8.0+ / SQLAlchemy | Relational data storage |
| **Scheduling** | APScheduler | Background job processing |
| **Integrations** | Google Calendar API, SMTP | Calendar sync & email alerts |
| **Deployment** | Docker & Compose | Containerized deployment |
| **CI/CD** | GitHub Actions | Automated testing & deployment |

---

## 🚀 Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/your-username/DeadlineNavigator.git
cd DeadlineNavigator
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### Manual Setup

```bash
# Frontend
cd frontend
npm install && npm run dev

# Backend
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=DeadlineNavigator
```

**`backend/.env`**
```env
DATABASE_URL=mysql://appuser:password@localhost:3306/deadline_navigator
SMTP_SERVER=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
SCHEDULER_ENABLED=True
```

---

## 📁 Project Structure

```
DeadlineNavigator/
├── frontend/                    # Next.js Frontend
│   ├── app/                     # Pages (dashboard, assignments, calendar, analytics)
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # API client & utilities
│   └── types/                   # TypeScript definitions
├── backend/                     # FastAPI Backend
│   ├── routes/                  # API endpoints
│   ├── services/                # Business logic
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic validation
│   └── utils/                   # Helpers (email, logging, dates)
├── docs/                        # Documentation
├── docker-compose.yml
└── .github/workflows/           # CI/CD pipelines
```

---

## 🔌 API Endpoints

```
GET|POST        /api/assignments
GET|PUT|DELETE  /api/assignments/{id}
PATCH           /api/assignments/{id}/status

GET|POST        /api/reminders
PUT|DELETE      /api/reminders/{id}

GET  /api/analytics/summary
GET  /api/analytics/priority-dist
GET  /api/analytics/deadlines

POST /api/calendar/sync
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
```

Full interactive docs available at `/docs` (Swagger) or `/redoc`.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'Add amazing feature'`
4. **Push** — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Follow PEP 8 for Python, use TypeScript for frontend, and write tests for new features.

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<p align="center">
  <strong>Built with ❤️ for better deadline management</strong>
  <br/>
  <sub>Making task organization easier, one deadline at a time</sub>
</p>

<p align="center">
  <a href="#-overview">Back to top ↑</a>
</p>
