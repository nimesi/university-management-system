# Frontend - University Management System

React-based web application for the University Management System.

## Setup Instructions

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API endpoint** (if needed)
   Edit `src/services/api.js` and update `API_BASE` if backend is running on different port:
   ```javascript
   const API_BASE = 'http://localhost:5000/api';
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Application will open on `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.js
│   │   └── Sidebar.js
│   ├── pages/              # Page components
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Student/
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Courses.js
│   │   │   ├── Exams.js
│   │   │   ├── Results.js
│   │   │   └── Fees.js
│   │   ├── Admin/
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Students.js
│   │   │   ├── Programs.js
│   │   │   ├── Applications.js
│   │   │   └── ActivityLogs.js
│   │   ├── Lecturer/
│   │   │   ├── Dashboard.js
│   │   │   ├── Courses.js
│   │   │   ├── Assignments.js
│   │   │   └── Exams.js
│   │   └── NotFound.js
│   ├── context/            # React Context
│   │   └── AuthContext.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Features Implemented

### Authentication
- Login page with email/password
- Registration page with role selection
- JWT token management
- Protected routes

### Student Portal
- Dashboard with statistics
- Profile management with form validation
- Course listing
- Exam schedule viewing
- Results with GPA calculation
- Fee tracking with payment status

### Admin Portal
- Dashboard with system statistics
- User management (create, edit, view)
- Student management
- Program management
- Application review and approval
- Activity log viewing with filtering

### Lecturer Portal
- Dashboard with course and student statistics
- Course management
- Assignment creation and management
- Exam scheduling

### Common Features
- Responsive design
- Navigation with role-based menus
- Error handling and notifications
- Loading states
- Form validation

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling. Key utility classes defined in `index.css`:

- `.card` - Card container styling
- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger/delete button
- `.input` - Input field styling
- `.table` - Table styling

## State Management

### AuthContext
Manages authentication state:
- `auth` - Current user and token
- `setAuth` - Update auth state
- `loading` - Initial auth loading state

## API Integration

### Service Structure
Each domain has its own service:

```javascript
export const authService = { ... }
export const studentService = { ... }
export const lecturerService = { ... }
export const adminService = { ... }
```

### Request Headers
Automatically includes JWT token in Authorization header:
```javascript
Authorization: Bearer {token}
```

## Routing

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Student Routes
- `/` - Dashboard
- `/student/profile` - Profile page
- `/student/courses` - Courses page
- `/student/exams` - Exams page
- `/student/results` - Results page
- `/student/fees` - Fees page

### Admin Routes
- `/admin/dashboard` - Dashboard
- `/admin/users` - Users management
- `/admin/students` - Students management
- `/admin/programs` - Programs management
- `/admin/applications` - Applications management
- `/admin/activity-logs` - Activity logs

### Lecturer Routes
- `/lecturer/dashboard` - Dashboard
- `/lecturer/courses` - My courses
- `/lecturer/assignments` - Assignments
- `/lecturer/exams` - Exams

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Optimized re-renders with useContext
- Efficient API calls

## Error Handling

- Try-catch blocks in async operations
- Error messages displayed to users
- Console error logging
- Error boundaries for component errors

## Security

- JWT token stored in localStorage
- Token included in all API requests
- Protected routes checking authentication
- Role-based route access
- XSS protection through React

## Troubleshooting

### White screen on load
- Check browser console for errors
- Verify backend is running on correct port
- Clear browser cache

### Login not working
- Verify credentials
- Check backend API is running
- Check CORS settings

### Styles not loading
- Run `npm install` to ensure all dependencies
- Rebuild Tailwind CSS: `npm run build`

## License

MIT License
