# University Management System

A comprehensive full-stack web application for managing university operations including student enrollment, course management, exam scheduling, and fee tracking.

## Features

### Student Portal
- **Dashboard**: Overview of enrolled courses, exams, results, and fees
- **Profile Management**: Update personal and guardian information
- **Course Enrollment**: View enrolled courses with details
- **Exam Management**: View upcoming exams and exam schedules
- **Results**: Track academic performance and grades
- **Fee Management**: Monitor fee status and payment history

### Admin Portal
- **User Management**: Create, edit, and manage users (students, lecturers, admins)
- **Student Management**: View and manage student records
- **Program Management**: Create and manage academic programs
- **Application Management**: Review and approve/reject applications
- **Activity Logs**: Monitor system activities and user actions
- **Dashboard**: System statistics and quick actions

### Lecturer Portal
- **Dashboard**: Overview of courses and student stats
- **Course Management**: Manage assigned courses
- **Assignment Management**: Create and manage assignments
- **Exam Management**: Schedule exams and manage exam details
- **Student Progress**: Track student performance

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite/PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API
- **ORM**: SQLAlchemy
- **Validation**: Marshmallow

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Context API

## Project Structure

```
university-management-system/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── program.py
│   │   ├── course.py
│   │   ├── exam.py
│   │   ├── result.py
│   │   ├── fee.py
│   │   ├── application.py
│   │   └── activity_log.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── student.py
│   │   ├── admin.py
│   │   ├── lecturer.py
│   │   └── common.py
│   ├── schemas/
│   │   └── (validation schemas)
│   └── utils/
│       ├── decorators.py
│       └── helpers.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Sidebar.js
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Admin/
│   │   │   ├── Lecturer/
│   │   │   └── NotFound.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nimesi/university-management-system.git
   cd university-management-system/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and secret key
   ```

5. **Initialize database**
   ```bash
   python
   >>> from app import app, db
   >>> with app.app_context():
   >>>     db.create_all()
   ```

6. **Run the server**
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Application will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Student Routes
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/exams` - Get scheduled exams
- `GET /api/student/results` - Get exam results
- `GET /api/student/fees` - Get fee information

### Admin Routes
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/students` - List all students
- `GET /api/admin/programs` - List all programs
- `POST /api/admin/programs` - Create program
- `GET /api/admin/applications` - List applications
- `PUT /api/admin/applications/:id` - Review application
- `GET /api/admin/activity-logs` - Get activity logs

### Lecturer Routes
- `GET /api/lecturer/courses` - Get assigned courses
- `GET /api/lecturer/courses/:id/students` - Get course students
- `POST /api/lecturer/courses/:id/assignments` - Create assignment
- `GET /api/lecturer/assignments` - Get assignments
- `POST /api/exams` - Schedule exam
- `GET /api/exams` - Get exams

## Demo Credentials

### Admin Account
- **Email**: admin@university.edu
- **Password**: admin123

### Student Account
- **Email**: student@university.edu
- **Password**: student123

### Lecturer Account
- **Email**: lecturer@university.edu
- **Password**: lecturer123

## Database Models

### User Model
- id (Primary Key)
- email (Unique)
- password (Hashed)
- first_name
- last_name
- role (student, lecturer, admin)
- is_active
- created_at
- updated_at

### Student Model
- id (Primary Key)
- user_id (Foreign Key)
- registration_number
- admission_number
- admission_date
- program_id (Foreign Key)
- date_of_birth
- gender
- address
- city
- country
- guardian_name
- guardian_phone

### Program Model
- id (Primary Key)
- name
- code
- description
- duration
- department
- created_at

### Course Model
- id (Primary Key)
- code
- title
- description
- credit_hours
- semester
- program_id (Foreign Key)
- lecturer_id (Foreign Key)

### Exam Model
- id (Primary Key)
- course_id (Foreign Key)
- exam_date
- exam_time
- duration
- total_marks
- venue

### Result Model
- id (Primary Key)
- student_id (Foreign Key)
- course_id (Foreign Key)
- exam_id (Foreign Key)
- marks
- grade
- created_at

### Fee Model
- id (Primary Key)
- student_id (Foreign Key)
- fee_type
- amount
- due_date
- status (pending, paid, overdue)
- payment_date

### Application Model
- id (Primary Key)
- applicant_name
- email
- program_id (Foreign Key)
- status (pending, approved, rejected)
- created_at
- reviewed_at

## Features Roadmap

- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] File upload for documents
- [ ] Student attendance tracking
- [ ] Grade calculation automation
- [ ] SMS notifications
- [ ] Mobile application
- [ ] Advanced reporting
- [ ] Analytics dashboard
- [ ] Multi-language support

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention
- Activity logging
- Session management

## Error Handling

The application includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication/Authorization errors
- Database errors
- Server errors with proper HTTP status codes
- Frontend error boundaries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@university.edu or open an issue on GitHub.

## Authors

- Nimesi - Initial work

## Acknowledgments

- Flask documentation
- React documentation
- Tailwind CSS
- Community contributors
