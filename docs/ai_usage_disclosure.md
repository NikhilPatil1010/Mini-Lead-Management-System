# AI Usage Disclosure

## Overview
As a proactive student, I wanted to ensure this project truly reflects my understanding of software engineering, system architecture, and backend logic. I designed the core features, business rules, and database schemas entirely on my own. However, to work efficiently and meet professional standards, I used an AI coding assistant purely as a productivity tool.

## What I Did Myself (Core Logic & Ideas)
I take full ownership of the business logic and the technical problem-solving in this project:

1. **Database Schema Design:** I designed the relational model, decided on the foreign key constraints, and chose to use JSONB for activity logs to make the system flexible.
2. **Architecture:** I chose the decoupled Client-Server architecture and the layered pattern (Routes -> Controllers -> Services) because I learned it's the best way to keep code maintainable and testable.
3. **Solving the Race Condition:** The most challenging part of the project was the auto-assignment feature. I realized that multiple managers adding leads at the same time could assign them to the same agent. I researched and conceptualized the solution to use database transactions and row-level locking (`FOR UPDATE SKIP LOCKED`) to ensure fair distribution. The AI did not solve this for me; I directed the implementation based on my own research.
4. **Security & Authentication:** I made the decision to use stateless JWTs and bcrypt for password hashing based on best practices I've studied for secure web applications.

## How I Used AI (Productivity & Boilerplate)
I utilized AI strictly to speed up tedious tasks and format my code, much like a modern IDE feature:

1. **Boilerplate Code:** I used AI to quickly generate standard configuration files (like `.gitignore`, ESLint configs) and the basic Express server setup, saving me hours of repetitive typing.
2. **CSS and Styling:** I asked the AI to help me write the CSS for a "Glassmorphism" UI. While I understand CSS, getting the exact aesthetic right can be time-consuming, and the AI helped me generate the styling rules quickly.
3. **Syntax Translation:** I used AI to help translate some of my planned SQL queries into the specific syntax required by the `pg` library (like switching `?` to `$1` for parameterized queries).
4. **Formatting Documentation:** I used AI to format my thoughts and diagrams into clean Markdown and Mermaid syntax for these documentation files.

By using this approach, I was able to focus my time on the complex logic and architecture—the true learning objectives of this project—while still delivering a highly polished final product.
