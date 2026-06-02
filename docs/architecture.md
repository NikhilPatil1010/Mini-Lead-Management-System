# Architecture Outline: Mini Lead Management System

This document provides a high-level overview of the system architecture, designed for scalability, maintainability, and clean separation of concerns.

## 1. High-Level Architecture
- **Client (Frontend)**: React Single Page Application (SPA). Interacts with the backend via REST APIs. Handles UI state with Redux Toolkit and routing via React Router.
- **Server (Backend)**: Stateless Node.js / Express.js application. Acts as the API gateway and business logic processor.
- **Database**: PostgreSQL relational database. Stores structured data (Users, Leads, Activity Logs) with enforced constraints and triggers.
- **Cache/Background (Future)**: Redis. Included in Docker Compose for future enhancements like caching heavy dashboard queries or managing background queues (BullMQ).

## 2. Backend Design Pattern (Layered Architecture)
The backend enforces a strict 3-tier architecture to ensure logic is isolated, testable, and reusable.

### A. Routes Layer (`src/routes`)
- Maps HTTP endpoints to specific controller functions.
- Enforces request-level validation (Zod schemas) and authentication/authorization (JWT verification, Role checks).
- *Rule: No business logic.*

### B. Controller Layer (`src/controllers`)
- Extracts parameters from `req.body`, `req.params`, and `req.user`.
- Invokes the appropriate Service Layer function.
- Formats the HTTP response (using a standard `sendResponse` utility).
- *Rule: No database queries or business logic.*

### C. Service Layer (`src/services`)
- Contains the core business logic (e.g., auto-assignment algorithm, determining if a user can edit a lead).
- Interacts with the database pool to execute queries.
- Throws domain-specific errors which are caught by the centralized error handler.
- *Rule: Does not know about HTTP requests/responses.*

## 3. Data Model & Concurrency Management
- **Transactions & Locking**: The "Least-Loaded Agent" assignment logic relies on PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED` inside a transaction. This ensures that even if 100 leads are created simultaneously, race conditions are avoided, and load is distributed perfectly.
- **Audit Trails**: Activity logging is decoupled from the main request lifecycle. Controller functions trigger fire-and-forget asynchronous calls to the `activityLog.service` to minimize latency.

## 4. Security Measures
- **Authentication**: JWT Access Token (short-lived, passed in response body) and Refresh Token (long-lived, passed in `httpOnly` secure cookies to prevent XSS).
- **Protection**:
  - `helmet`: Sets secure HTTP headers.
  - `cors`: Restricts API access to the known frontend origin.
  - `express-rate-limit`: Prevents brute-force attacks on auth routes and generic rate-limiting on all APIs.
  - Parameterized Queries: All database interactions use `pg` parameterization (`$1, $2`) to prevent SQL Injection.
