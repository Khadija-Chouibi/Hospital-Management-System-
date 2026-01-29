# Hospital Appointment Management System

A lightweight web application for managing hospital appointments, patients, and staff. Features role-based dashboards for admins, doctors, and nurses, with a Node.js/Express backend and PostgreSQL database.

## Features

- **User Management**: Create and manage users (admins, doctors, nurses, patients)
- **Appointment Scheduling**: Book, update, and track appointments
- **Role-Based Dashboards**:
  - **Admin Dashboard**: Full system management and user oversight
  - **Doctor Dashboard**: View and manage patient appointments
  - **Nurse Dashboard**: Assist with appointment coordination
- **REST API**: Full CRUD operations for users and appointments
- **CORS Support**: Secure cross-origin requests
- **Static Frontend**: Vanilla HTML/CSS/JavaScript dashboards

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Dependencies**: 
  - `express` — web framework
  - `pg` — PostgreSQL client
  - `cors` — cross-origin resource sharing
  - `body-parser` — request parsing
  - `dotenv` — environment variable management

## Project Structure

```
project/
├── backend/
│   ├── server.js              # Express server setup
│   ├── db.js                  # PostgreSQL pool configuration
│   ├── package.json           # Node.js dependencies
│   └── routes/
│       ├── users.js           # User API endpoints
│       └── appointments.js    # Appointment API endpoints
├── frontend/
│   ├── index.html             # Login/landing page
│   ├── admin_dashboard.html   # Admin dashboard
│   ├── doctor_dashboard.html  # Doctor dashboard
│   ├── nurse_dashboard.html   # Nurse dashboard
│   ├── script.js              # General frontend logic
│   ├── admin_script.js        # Admin dashboard logic
│   ├── doctor_script.js       # Doctor dashboard logic
│   ├── nurse_script.js        # Nurse dashboard logic
│   ├── style.css              # Global styles
│   └── [dashboard]_script.js  # Role-specific scripts
├── hospital.sql               # Database schema & seed data
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher) — [Download](https://nodejs.org/)
- **PostgreSQL** (v10 or higher) — [Download](https://www.postgresql.org/download/)
- **Git** (optional, for version control)

### Installation

1. **Clone or download the project**:
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Set up the database**:
   - Start PostgreSQL service (or server)
   - Create the `hospital` database and import the schema:
     ```sql
     createdb hospital
     psql -U postgres -d hospital -f hospital.sql
     ```
   - Update database credentials in `backend/db.js` and `backend/server.js` if needed (default: user `postgres`, password `123456789`, port `5432`)

3. **Install backend dependencies**:
   ```powershell
   Set-Location 'backend'
   npm install
   ```

4. **Start the server**:
   ```powershell
   npm start
   ```
   - Server runs on `http://localhost:3000`
   - Backend serves frontend files statically
   - You should see: `Server running on port 3000` and `Database connection and users table OK`

5. **Access the application**:
   - Open your browser to `http://localhost:3000`
   - Login with credentials from the `hospital.sql` seed data

## API Endpoints

### Users
- `GET /api/users` — Fetch all users
- `POST /api/users` — Create a new user
- `PUT /api/users/:id` — Update user details
- `DELETE /api/users/:id` — Delete a user

### Appointments
- `GET /api/appointments` — Fetch all appointments
- `POST /api/appointments` — Create a new appointment
- `PUT /api/appointments/:id` — Update appointment details
- `DELETE /api/appointments/:id` — Delete an appointment (if supported)

Example API call (PowerShell):
```powershell
$body = @{
    doctorID = 1
    patientID = 2
    nurseID = 3
    dateTime = "2026-02-15 10:00:00"
    status = "upcoming"
    diagnosis = "Routine checkup"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/appointments" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## Configuration

### Environment Variables (Optional)

Create a `.env` file in the `backend/` folder for sensitive data:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital
SERVER_PORT=3000
FRONTEND_ORIGIN=http://127.0.0.1:5501
```

Update `backend/server.js` and `backend/db.js` to read from `process.env` (already uses `dotenv`).

### Database Connection

Default settings in `backend/db.js`:
- **User**: `postgres`
- **Password**: `123456789`
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `hospital`

**Note**: `backend/appointments.js` currently uses port `5500` — align this with your Postgres port or update to use environment variables.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Error: connect ECONNREFUSED 127.0.0.1:5432` | PostgreSQL is not running. Start the PostgreSQL service. |
| `Error: database "hospital" does not exist` | Import the schema: `psql -U postgres -d hospital -f hospital.sql` |
| `npm ERR! code ENOENT` (package.json not found) | Ensure you're in the `backend/` folder before running `npm install`. |
| Appointments not showing on dashboard | Verify the DOM element ID in `frontend/doctor_dashboard.html` matches the script (should be `id="doctorAppointments"`). |
| CORS error in browser console | Ensure backend CORS is configured for your frontend origin (default: `http://127.0.0.1:5501`). |
| Database port mismatch | Verify all DB pool connections use the same port (e.g., 5432). Check `backend/db.js` and `backend/routes/appointments.js`. |

## Development Tips

- **Enable detailed logging**: Check `server.js` and route files for `console.log()` statements; review the terminal for request logs.
- **Database debugging**: Use `psql` to query tables directly:
  ```sql
  psql -U postgres -d hospital
  SELECT * FROM appointment ORDER BY createdat DESC;
  ```
- **API testing**: Use [Postman](https://www.postman.com/) or VS Code REST Client extension to test endpoints.
- **Frontend debugging**: Open DevTools (F12) in your browser to check Network tab, Console, and DOM.

## Future Enhancements

- [ ] Authentication & authorization (JWT tokens)
- [ ] Email notifications for appointment reminders
- [ ] Appointment cancellation & rescheduling workflow
- [ ] Doctor availability calendar
- [ ] Patient medical history records
- [ ] Admin reporting & analytics
- [ ] Docker containerization
- [ ] Unit & integration tests

## License

This project is provided as-is for educational purposes. Feel free to modify and distribute as needed.

## Support

For issues or questions, check the `hospital.sql` schema to understand the database structure, or review the route handlers in `backend/routes/` for API behavior details.

---


