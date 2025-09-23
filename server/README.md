# AI-Ticket-Agent Backend Documentation

This document covers the backend logic in the `server` folder, providing structure, data models, and endpoint details for frontend integration.

---

## Overview

The backend is built with Node.js, Express, and MongoDB (via Mongoose). It provides RESTful APIs for user authentication, ticket management, and admin functions.

---

## Data Models

### 1. User Model (`src/models/user.model.js`)

Defines a user with roles and skills.

```js
{
  name: String,                   // User's name (required)
  email: String,                  // Unique email, validated (required)
  password: String,               // Hashed password (required, not selected by default)
  role: String,                   // "user", "moderator", or "admin" (default: "user")
  skills: [String],               // Optional skill tags
  timestamps: true                // createdAt, updatedAt
}
```

- **Password is hashed on save.**
- **JWT token generation available as a method.**

---

### 2. Ticket Model (`src/models/ticket.model.js`)

Represents a support ticket.

```js
{
  title: String,                  // Ticket title
  description: String,            // Detailed description
  status: String,                 // "open", "in-progress", "resolved" (default: "open")
  createdBy: ObjectId (User),     // Reference to User who created the ticket
  assignedTo: ObjectId (User),    // Reference to assigned support agent (optional)
  priority: String,               // "low", "medium", "high" (default: "medium")
  deadline: Date,                 // Optional deadline
  helpfulNotes: String,           // Notes from support/AI (optional)
  relatedSkills: [String],        // Skill tags to help assign tickets
  timestamps: true                // createdAt, updatedAt
}
```

---

## API Endpoints

These are the main API endpoints your frontend will call.

### User APIs

- `POST /api/users/register`  
  Register a new user.  
  Body: `{ name, email, password }`
- `POST /api/users/login`  
  Login and receive a JWT token.
- `GET /api/users/users`  
  List all users (admin only).
- `POST /api/users/logout`  
  Logout and clear auth token.

### Ticket APIs

- `GET /api/tickets`  
  List all tickets (filtering by status/priority/user supported).
- `GET /api/tickets/:id`  
  Get details for a specific ticket.
- `POST /api/tickets`  
  Create a new ticket.
- `DELETE /api/tickets/:id`  
  Delete a ticket.
- `GET /api/tickets/update/:ticketId`  
  Update ticket status (admin only).

---

## Authentication & Authorization

- Uses JWT tokens for authentication (stored in cookies or Authorization header).
- Roles:  
  - **user**: Can create/view their tickets.  
  - **admin**: Can manage all users/tickets.
- Frontend must include JWT token in requests for protected endpoints.

---

## AI Agent Integration

- Some ticket actions trigger AI responses to generate summaries, priority, and recommended skills.
- See `src/lib/agent.lib.js`:  
  - Generates structured AI output for tickets:
    ```json
    {
      "summary": "Short summary",
      "priority": "medium",
      "helpfulNotes": "...",
      "relatedSkills": ["javascript", "react"]
    }
    ```

---

## Example Data Flow

1. **User Registration/Login**:  
   - Frontend posts credentials, receives JWT token.
2. **Ticket Creation**:  
   - Frontend submits title/description/etc.
   - AI agent may add helpful notes or skills.
3. **Admin Dashboard**:  
   - List tickets, assign users, update status.
   - See `GET /api/users/users` and ticket update endpoints.

---

## Tips for Frontend

- **Data Structure:**  
  - Use the model fields for form validation and display.
  - Use `relatedSkills` to suggest agents or display tags.
- **Status & Priority:**  
  - Map ticket statuses and priorities to UI badges/colors.
- **Helpful Notes:**  
  - Display AI-generated notes or tips for each ticket.
- **Role-Based UI:**  
  - Show/hide admin features based on the user's role.

---

## References

- User Model: [`server/src/models/user.model.js`](./src/models/user.model.js)
- Ticket Model: [`server/src/models/ticket.model.js`](./src/models/ticket.model.js)
- Main Controllers: [`server/src/controllers/user.controllers.js`](./src/controllers/user.controllers.js)

---

## Need More Details?

- See controllers for exact request/response formats.
- Extend the models for additional frontend features if needed.
