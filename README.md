# Micro-Investment Platform

This is an ongoing personal project simulating a micro-investment and savings platform. Users can securely register, track spending, automatically round up transactions, and allocate savings to investment portfolios.

## Features

### Backend (Django + Django REST Framework)

- User registration and login with token authentication
- Savings and round-up calculation logic
- Transaction recording with automatic categorization
- Portfolio allocation with investment tracking
- Validations to prevent negative savings and invalid operations
- Modular apps: `users`, `transactions`, `savings`, `portfolio`, `bank`

### Frontend (React + Chart.js)

- Dashboard displaying savings, recent transactions, and portfolio breakdown
- Line chart for visualizing investment growth over time
- Planned integration of bank linking (Plaid Sandbox)
- Responsive layout with reusable components

## Technologies

- **Backend:** Python, Django, Django REST Framework, SQLite
- **Frontend:** React, Chart.js, JSX
- **DevOps & Tools:** Git, GitHub, Visual Studio Code
- **Architecture:** RESTful APIs, modular Django apps, planned API integrations

## Installation (Backend & Frontend)

### Backend Setup

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

### Frontend Setup

cd frontend
npm install
npm start
