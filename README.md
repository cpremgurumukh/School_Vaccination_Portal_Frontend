# Vaccination Management System - Frontend

## 🚀 Project Overview

This is the frontend of the Vaccination Management System, built using **React** and **TypeScript**. It provides a user-friendly interface for coordinators to manage vaccination drives, student records, and vaccination statuses. The frontend communicates with the backend via REST APIs to perform CRUD operations on vaccination drives and other resources.

## 🛠️ Tech Stack

* **Frontend Framework:** React (with TypeScript)
* **State Management:** React Hooks (`useState`, `useEffect`, etc.)
* **Styling:** Inline CSS (can be extended to use CSS modules, Tailwind CSS, or a CSS framework like Bootstrap)
* **HTTP Client:** Fetch API (can be extended to use Axios)
* **Authentication:** Basic Auth (for testing) / JWT (recommended for production)
* **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/6868293/2sB2jAa7hR)

## 📁 Project Structure

```
├── public              # Static assets (index.html, favicon, etc.)
├── src
│   ├── components      # Reusable React components (DriveForm, etc.)
│   ├── pages           # Page components (DrivesPage, etc.)
│   ├── services        # API service functions (driveService.ts)
│   ├── types           # TypeScript type definitions (drive.types.ts)
│   ├── App.tsx         # Main App component
│   ├── index.tsx       # Entry point for React
│   └── styles          # CSS files (optional, if not using inline styles)
├── package.json        # Dependencies and scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

* **Node.js:** v18+ recommended
* **npm** or **yarn**
* **Backend Server:** The backend must be running (default: `http://localhost:9095`)

### Installation

```bash
# Clone the repository
git clone <frontend-repository-url>

# Navigate to the project directory
cd vaccination-management-frontend

# Install dependencies
npm install
```

### Environment Variables

* Create a `.env` file in the root directory to configure environment-specific variables (optional for now, as the API URL is hardcoded in the code).
* Example `.env` file:

```
REACT_APP_API_URL=http://localhost:9095
```

- **Note**: The current code hardcodes the API URL (`http://localhost:9095/api/drives`) in `DriveForm`. For better maintainability, consider moving this to an environment variable and updating the code to use `process.env.REACT_APP_API_URL`.

### Running the Application

```bash
# Start the development server
npm start

# The app will be available at http://localhost:3000 (default React port)
```

## 📝 Usage

* Access the API documentation for the backend at the provided Postman link:  
  [Postman Documentation](https://documenter.getpostman.com/view/6868293/2sB2jAa7hR)

### Key Features

- **Vaccination Drives Management**:
  - View a list of active vaccination drives (`DrivesPage`).
  - Create new vaccination drives (`DriveForm`).
  - Edit or delete existing drives (via `DrivesPage`).

### Authentication (Current Setup - Basic Auth for Testing)

For testing purposes, the frontend uses a hardcoded Basic Auth token to authenticate requests to the backend:

- **Username**: `admin@gmail.com`
- **Password**: `admin123`
- **Authorization Header**: `Basic Y3ByZW1ndXJ1bXVraEBnbWFpbC5jb206cHJlbTEyMw==`

This token is hardcoded in the `DriveForm` component for requests to the `/api/drives` endpoint.

### Authentication (Recommended for Production - JWT)

To secure the application in production:
1. Revert the backend to use JWT authentication (update `SecurityConfig` to use `JwtAuthenticationFilter` instead of Basic Auth).
2. Implement a login page in the frontend to authenticate users and obtain a JWT token:
   - **Request**:
     - Method: POST
     - URI: `/api/auth/login`
     - Headers: `Content-Type: application/json`
     - Body:
       ```json
       {
         "email": "coordinator@example.com",
         "password": "password123"
       }
       ```
   - **Response**:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```
3. Store the token in `localStorage`:
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```
4. Include the token in the `Authorization` header for API requests:
   ```javascript
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${localStorage.getItem('token')}`,
   }
   ```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Make your changes.
4. Create a Pull Request.

## 📄 License

This project is licensed under the MIT License.