# HelpDesk Mini

HelpDesk Mini is a robust, full-featured ticketing system designed to manage support requests efficiently. It features role-based access control for customers, agents, and administrators, ensuring a secure and streamlined workflow. This project was built to the specifications of a competitive hackathon, emphasizing API robustness, security, and real-world functionality.

---

## Features

- **Role-Based Access Control (RBAC):**
    - **Customer:** Can create tickets, view their own tickets, and communicate with agents via comments.
    - **Agent:** Can view and manage tickets from all users, update ticket statuses, add comments, and filter for high-priority or SLA-breached tickets.
    - **Admin:** Can manage all users in the system, including promoting customers to agents.
- **SLA Timers:** Tickets are assigned an automated Service-Level Agreement (SLA) deadline based on their priority.
- **Robust API:** Includes pagination, rate limiting, idempotency, and optimistic locking to ensure performance and data integrity.
- **Interactive UI:** A clean, responsive frontend built with React that allows users to seamlessly interact with the system.

---

## Architecture & Tech Stack

### Architecture Note

This project follows a classic MERN stack architecture with a clear separation of concerns. The frontend is a single-page application built with **React**, managing its own state and routing. It communicates with a backend API built with **Node.js** and the **Express** framework. The backend handles all business logic, database interactions, and authentication. **MongoDB** serves as the NoSQL database, with **Mongoose** as the ODM for data modeling and validation. Authentication is handled via **JSON Web Tokens (JWT)**, ensuring secure, stateless communication between the client and server.

### Tech Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **API Robustness:** express-rate-limit, uuid

---

## API Documentation

The API is the core of the application, providing endpoints for all user actions.

### Authentication

**`POST /api/auth/register`**
Registers a new user in the system.

- **Request Body:**
  ```json
  {
    "name": "Test Customer",
    "email": "customer@example.com",
    "password": "password123"
  }
````

  - **Success Response (`201 Created`):**
    ```json
    {
      "msg": "User registered successfully"
    }
    ```
  - **Error Response (`400 Bad Request`):**
    ```json
    {
      "error": {
        "code": "USER_EXISTS",
        "field": "email",
        "message": "A user with this email already exists."
      }
    }
    ```

**`POST /api/auth/login`**
Authenticates a user and returns a JWT.

  - **Request Body:**
    ```json
    {
      "email": "agent@example.com",
      "password": "password123"
    }
    ```
  - **Success Response (`200 OK`):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Tickets

**`POST /api/tickets`**
Creates a new support ticket.

  - **Headers:**
      - `x-auth-token: <Your JWT>`
      - `Idempotency-Key: <Generated UUID>`
  - **Request Body:**
    ```json
    {
      "title": "Cannot access my account",
      "description": "When I try to log in, I get a '500 Internal Server Error' page.",
      "priority": "High"
    }
    ```
  - **Success Response (`201 Created`):** Returns the newly created ticket object.

**`GET /api/tickets`**
Retrieves a list of tickets. Returns user-specific tickets for Customers and all tickets for Agents/Admins.

  - **Headers:** `x-auth-token: <Your JWT>`
  - **Query Parameters:**
      - `limit` (number, default: 10): The number of tickets to return.
      - `offset` (number, default: 0): The number of tickets to skip.
      - `search` (string): A keyword to search in ticket titles and descriptions.
      - `breached` (boolean): If `true`, returns only open tickets that have passed their SLA deadline.
  - **Example:** `GET /api/tickets?limit=5&offset=0&search=server`
  - **Success Response (`200 OK`):**
    ```json
    {
      "items": [
        {
          "_id": "60c72b2f9b1e8a001f8e4e1a",
          "title": "Server is down",
          "status": "Open",
          "...": "..."
        }
      ],
      "next_offset": 5
    }
    ```

**`GET /api/tickets/:id`**
Retrieves a single ticket by its ID.

  - **Headers:** `x-auth-token: <Your JWT>`
  - **Success Response (`200 OK`):** Returns the full ticket object, with comments populated.

**`PATCH /api/tickets/:id`**
Updates a ticket's status. (Agent/Admin only).

  - **Headers:** `x-auth-token: <Your JWT>`
  - **Request Body:**
    ```json
    {
      "status": "In Progress",
      "version": 0
    }
    ```
  - **Success Response (`200 OK`):** Returns the updated ticket object with `__v` incremented.
  - **Conflict Response (`409 Conflict`):**
    ```json
    {
      "error": {
        "code": "CONFLICT_ERROR",
        "message": "This ticket has been modified by someone else. Please refresh and try again."
      }
    }
    ```

**`POST /api/tickets/:id/comments`**
Adds a comment to a ticket.

  - **Headers:** `x-auth-token: <Your JWT>`
  - **Request Body:**
    ```json
    {
      "text": "Have you tried clearing your browser cache?"
    }
    ```
  - **Success Response (`201 Created`):** Returns the full ticket object with the new comment added.

### Users (Admin Only)

**`GET /api/users`**
Retrieves a list of all users in the system.

  - **Headers:** `x-auth-token: <Your ADMIN JWT>`
  - **Success Response (`200 OK`):** Returns an array of user objects.

**`PATCH /api/users/:id/role`**
Updates a specific user's role.

  - **Headers:** `x-auth-token: <Your ADMIN JWT>`
  - **Request Body:**
    ```json
    {
      "role": "Agent"
    }
    ```
  - **Success Response (`200 OK`):** Returns the updated user object.

-----

## Robustness Features

  - **Rate Limiting:** All API endpoints are limited to **60 requests per minute** per user. Exceeding this limit will result in a `429 Too Many Requests` error.
  - **Pagination:** The `GET /api/tickets` endpoint uses `limit` and `offset` query parameters for efficient data retrieval.
  - **Idempotency:** All `POST /api/tickets` requests support an `Idempotency-Key` header to prevent accidental duplicate submissions.
  - **Optimistic Locking:** The `PATCH /api/tickets/:id` endpoint is protected against stale data overwrites. If a conflict occurs, a `409 Conflict` error is returned.

-----

## Getting Started

### Prerequisites

  - Node.js (v16 or higher)
  - npm
  - MongoDB

### Backend Setup

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file and add your MONGO_URI and JWT_SECRET
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_key

# 4. Start the server
npm run dev
```

### Frontend Setup

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the React development server
npm run dev
```

-----

## Test Credentials

  - **Admin:**
      - **Email:** `admin@mail.com`
      - **Password:** `admin123`
  - **Agent:**
      - **Email:** `agent@test.com` (or promote another user)
      - **Password:** `password123`
  - **Customer:**
      - **Email:** `customer@test.com`
      - **Password:** `password123`

<!-- end list -->