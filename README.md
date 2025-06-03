# Micro-Investment Platform

This is an ongoing personal project simulating a micro-investment and savings platform. Users can securely register, track spending, automatically round up transactions, and allocate savings to investment portfolios.

## Features

### Backend (Django + Django REST Framework)

- Secure user registration and login with JWT authentication
- Savings and round-up calculation logic
- Transaction logging with dynamic descriptions
- Portfolio allocation with investment tracking
- Validations to prevent negative savings, overdraft, and invalid operations
- Encrypted bank account storage using Fernet
- Modular architecture: `users`, `transactions`, `savings`, `portfolio`, `bank`

### Frontend (React + Chart.js)

- Dashboard displaying savings, recent transactions, and portfolio breakdown
- Line chart for visualizing investment growth over time
- Planned integration of bank linking (Plaid Sandbox)
- Responsive layout with reusable components
- Secure login and dynamic UI updates via REST API

## Technologies

- **Backend:** Python, Django, Django REST Framework, SQLite
- **Frontend:** React, Chart.js, JSX
- **DevOps & Tools:** Git, GitHub, Visual Studio Code
- **Architecture:** RESTful APIs, secure JWT auth, modular Django apps, full-stack architecture

## Installation (Backend & Frontend)

### Backend Setup

```bash
pip install -r requirements.txt
cd backend
python3 -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows

# Create a .env file in your backend directory with the following content:
BANK_ENCRYPTION_KEY=your-generated-bank-key
DJANGO_SECRET_KEY=your-django-secret-key

# Generate your BANK_ENCRYPTION_KEY with:
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Replace your-django-secret-key with a strong, unique value (you can use Django’s secret key generator or similar tools).
# Do not share your .env file or keys publicly.

python3 manage.py migrate
# Create a superuser for admin access (follow the prompts):
python3 manage.py createsuperuser

# (Optional) Populate the Database with Test Data. If you want to add fake/demo data for testing.
python3 populate_test_data.py

python3 manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Folder Structure

```text
micro-investment-platform/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── micro_investment_platform/
│   ├── users/
│   ├── transactions/
│   ├── savings/
│   ├── portfolio/
│   └── bank/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── Dashboard/
│           ├── Auth/
│           ├── Bank/
│           └── Navigation/
│
├── README.md
└── .gitignore
```

## Status

Ongoing: Core backend logic is complete. Frontend dashboard and simulated bank integration are actively being developed.

## License

This project is shared publicly for portfolio and learning purposes only. It is not licensed for production use or redistribution.
