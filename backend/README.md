# Backend - University Management System

Flask-based REST API for the University Management System.

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip
- Virtual environment

### Installation

1. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   FLASK_ENV=development
   FLASK_APP=app.py
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///university.db
   ```

4. **Initialize database**
   ```bash
   python
   >>> from app import app, db
   >>> with app.app_context():
   >>>     db.create_all()
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

## Project Structure

```
backend/
├── app.py                 # Application entry point
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── models/                # Database models
│   ├── __init__.py
│   ├── user.py
│   ├── student.py
│   ├── program.py
│   ├── course.py
│   ├── exam.py
│   ├── result.py
│   ├── fee.py
│   ├── application.py
│   └── activity_log.py
├── routes/                # API routes
│   ├── __init__.py
│   ├── auth.py
│   ├── student.py
│   ├── admin.py
│   ├── lecturer.py
│   └── common.py
├── schemas/               # Data validation schemas
│   └── __init__.py
└── utils/                 # Utility functions
    ├── decorators.py
    └── helpers.py
```

## API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  }
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}

Response (201):
{
  "message": "User created successfully",
  "user": { ... }
}
```

### Student Endpoints

#### Get Student Profile
```
GET /api/student/profile
Authorization: Bearer {token}

Response (200):
{
  "student": {
    "id": 1,
    "registration_number": "STU001",
    "admission_number": "ADM001",
    "user": { ... },
    "program": { ... }
  }
}
```

#### Update Student Profile
```
PUT /api/student/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "date_of_birth": "2000-01-01",
  "gender": "male",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "guardian_name": "Jane Doe",
  "guardian_phone": "+1234567890"
}

Response (200):
{
  "message": "Profile updated successfully",
  "student": { ... }
}
```

#### Get Enrolled Courses
```
GET /api/student/courses
Authorization: Bearer {token}

Response (200):
{
  "courses": [
    {
      "id": 1,
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "credit_hours": 3,
      "lecturer_name": "Dr. Smith"
    }
  ]
}
```

### Admin Endpoints

#### Create User
```
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "student"
}

Response (201):
{
  "message": "User created successfully",
  "user": { ... }
}
```

#### Get Users
```
GET /api/admin/users?page=1&per_page=10
Authorization: Bearer {token}

Response (200):
{
  "users": [ ... ],
  "total": 50,
  "pages": 5
}
```

#### Create Program
```
POST /api/admin/programs
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bachelor of Science in Computer Science",
  "code": "BS-CS",
  "description": "A comprehensive program...",
  "duration": 4,
  "department": "Computer Science"
}

Response (201):
{
  "message": "Program created successfully",
  "program": { ... }
}
```

## Dependencies

- Flask==2.3.0
- Flask-SQLAlchemy==3.0.0
- Flask-JWT-Extended==4.4.0
- Flask-CORS==3.0.10
- SQLAlchemy==2.0.0
- python-dotenv==0.21.0
- marshmallow==3.19.0
- bcrypt==4.0.1
- requests==2.28.0

## Database

The application uses SQLAlchemy ORM with SQLite by default. To use PostgreSQL:

1. Install PostgreSQL driver:
   ```bash
   pip install psycopg2-binary
   ```

2. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost/university_db
   ```

## Testing

Run tests with pytest:
```bash
pip install pytest pytest-cov
pytest
```

## Deployment

For production deployment:

1. Set `FLASK_ENV=production`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Set up proper database backups
4. Configure proper logging
5. Use environment variables for secrets

Example with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Database Errors
- Ensure database file permissions are correct
- Check database URL in `.env`

### Authentication Errors
- Verify JWT secret key is set
- Check token expiration
- Ensure Authorization header format: `Bearer {token}`

### CORS Issues
- Frontend URL should match CORS_ORIGINS in config
- Check browser console for CORS error details

## License

MIT License
