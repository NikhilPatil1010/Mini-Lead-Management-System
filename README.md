# Mini Lead Management System

## Project Overview

The Mini Lead Management System is a resilient, enterprise-grade full-stack application engineered to streamline the lead lifecycle from acquisition to conversion. Architected with strict adherence to SOLID principles and an N-Tier backend design, the platform securely delineates privileges via stateless JWT Role-Based Access Control, ensuring Managers exclusively source leads while Agents focus entirely on execution. To guarantee SLA compliance and optimal workload distribution under high concurrency, the system employs a sophisticated, lock-safe auto-assignment algorithm natively powered by PostgreSQL's transactional engine, immediately routing incoming leads to the least-utilized agent without race conditions. 

From a frontend perspective, the application breaks away from generic component libraries to deliver a bespoke, hyper-responsive Glassmorphism Single Page Application built on React and Vite. By prioritizing raw, parameterized SQL execution over heavy ORM abstraction, and coupling it with immediate SMTP event-driven notifications (via Nodemailer) and live Swagger API documentation, this platform acts not just as a functional CRM, but as a blueprint for highly scalable, maintainable, and secure enterprise software design.

---

## 📦 Mandatory Deliverables (GitHub Links)

As per the technical assessment requirements, all mandatory documentation has been meticulously detailed and is accessible via the links below. *(Note: These relative links will resolve natively when viewed on GitHub).*

1. **[Architecture Explanation](./docs/architecture_explanation.md)** *(Mandatory)* 
   - Deep dive into the Layered (N-Tier) Architecture.
   - Tradeoff analysis (PostgreSQL vs NoSQL, Raw SQL vs ORM).
   - Concurrency resolution strategy using `FOR UPDATE SKIP LOCKED`.

2. **[Database Design](./docs/database_design.md)** *(Mandatory)*
   - Mermaid Entity-Relationship (ER) Diagram.
   - Schema decisions, JSONB usage for audit logs, and constraint logic.

3. **[AI Usage Disclosure](./docs/ai_usage_disclosure.md)** *(Mandatory)*
   - Transparent disclosure regarding the scope of AI acceleration for boilerplate generation versus the manual engineering of transactional boundaries.

---

## 🚀 Core Technical Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Vite, React Router, Axios, Custom CSS (Glassmorphism) |
| **Backend** | Node.js, Express.js, JWT, Bcrypt, Nodemailer, Swagger |
| **Database** | PostgreSQL (`pg` driver), Raw Parameterized SQL |

---

## ⚙️ Local Environment Setup

### 1. Database Initialization
1. Ensure PostgreSQL is installed and running locally.
2. Execute the following command in `psql` or pgAdmin:
   ```sql
   CREATE DATABASE management;
   ```
3. Navigate to the `backend/` directory, copy `.env.example` to `.env`, and update your PostgreSQL credentials (`DB_USER`, `DB_PASSWORD`, `DB_PORT`).

### 2. Backend Bootstrapping
```bash
cd backend
npm install
# Execute DDL migrations to build the relational schema
npm run migrate
# Launch the development server (Defaults to Port 5000)
npm run dev
```

### 3. Frontend Bootstrapping
```bash
cd frontend
npm install
# Launch the Vite HMR server (Defaults to Port 5173)
npm run dev
```

---

## 🔑 Default Test Accounts (Seeded)
The migration script automatically seeds the database with the following user profiles. The password for all accounts is `password123`.

- **Manager**: `manager1@test.com`
- **Agent 1**: `agent1@test.com`
- **Agent 2**: `agent2@test.com`

---

## 🌐 API Documentation

The backend incorporates an auto-generated Swagger UI for comprehensive API exploration. 
Once the backend is running, the documentation is accessible at:
**👉 `http://localhost:5000/api/docs`**

*(If utilizing tunneling software like ngrok, the Swagger documentation will dynamically adapt to route requests through the public URI).*
