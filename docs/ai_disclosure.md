# AI Usage Disclosure

In the development of this Mini Lead Management System, an AI coding assistant was utilized to accelerate the scaffolding and generation of boilerplate code. However, the architectural decisions, logic flow, and core design principles were heavily guided by senior engineering best practices.

## How AI Was Used
- **Scaffolding**: Used to generate standard boilerplate for Express routes, React components, Redux slices, and basic database migrations.
- **Form Generation**: Assisted in quickly generating repetitive UI forms and table layouts using Bootstrap.
- **Documentation Setup**: Helped draft the initial OpenAPI/Swagger definitions and Markdown skeletons.

## What Was Strictly Designed Manually
While AI generated code, the following aspects were strictly enforced and guided by the human developer:
- **Strict Layered Architecture**: Forcing the AI to adhere to a strict separation of Routes, Controllers, and Services. The AI was explicitly instructed *never* to put logic in routes or database queries in controllers.
- **Concurrency-Safe Logic**: The complex `SELECT FOR UPDATE SKIP LOCKED` query used in the Lead Auto-Assignment feature was a deliberate architectural choice to prevent race conditions at scale.
- **Security Posture**: The implementation of `httpOnly` cookies for refresh tokens, Zod validation logic, and the global error handler were mandated human-driven requirements.
- **Code Aesthetics**: The AI was continually prompted to produce clean, modular code with minimal over-commenting, avoiding the typical "AI patterns" and generic helper bloat.
