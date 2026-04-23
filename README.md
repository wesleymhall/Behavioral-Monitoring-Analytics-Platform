# Behavioral Monitoring & Analytics Platform

**Tools:** Python (Flask) · React (Vite) · PostgreSQL · Scikit-learn · SQLAlchemy · JavaScript

A full-stack platform for logging and analyzing personal behavioral metrics. Users record data on a numeric rating scale, explore trends, and surface patterns through interactive visualizations powered by statistical and machine learning methods.

🔗 **Live site:** [liveloglearn.com](https://liveloglearn.com)

---

## Features

- **End-to-End Pipeline:** Complete data flow from frontend input to backend storage to dashboard visualization, with on-demand data fetching to reduce unnecessary data transfer..
- **Machine Learning & Statistics:** Correlation matrices, lag analysis, distribution modeling, time-series forecasting, and KMeans clustering to identify behavioral patterns.
- **Interactive Dashboard:** Custom dashboard for exploring personal data and visualizing trends over time.

---

## Setup

### Backend

Requires Python 3.11

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Create a `.env` file in the `backend` directory with the following:

```
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
```

### Frontend

Requires Node / npm

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── analytics/
│   │   │   ├── connects.py
│   │   │   ├── patterns.py
│   │   │   ├── stats.py
│   │   │   └── utils.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── dash.py
│   │   │   └── log.py
│   │   ├── utils/
│   │   │   ├── hashing.py
│   │   │   ├── init_db.py
│   │   │   └── streak.py
│   │   ├── config.py
│   │   └── models.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Logout.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dash/
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── Connects.jsx
│   │   │   │   │   ├── Patterns.jsx
│   │   │   │   │   ├── Predict.jsx
│   │   │   │   │   └── Stats.jsx
│   │   │   │   ├── Calendar.jsx
│   │   │   │   ├── Dash.jsx
│   │   │   │   └── DayLogs.jsx
│   │   │   └── welcome/
│   │   │       ├── Log.jsx
│   │   │       ├── LogRoutes.jsx
│   │   │       └── SelectMetrics.jsx
│   │   ├── App.jsx
│   │   ├── apiClient.js
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── README.md
```

---

## Deployment

- **Backend + Frontend:** [Render](https://render.com)
- **Database:** PostgreSQL on [Neon](https://neon.tech)
