# System Constitution: MVC Architectural Blueprint

This document defines the core architecture and development principles for the System. Adherence to these standards ensures consistency, testability, and scalability.

## 1. Core Stack
- **Frontend**: React (SPA) with Vite.
- **Backend**: Express.js server serving as both an API host and static file server.
- **Database**: SQLite provided by `better-sqlite3` for local persistence.
- **Styling**: Tailwind CSS for responsive and modern UI.
- **Animation**: `motion` (framer-motion) for interactive transitions.

## 2. Directory Structure
- `/src/actions`: **Business Logic Layer**. Pure functions or units of work that interact with the DB. They do not know about Request/Response objects.
- `/src/controllers`: **Interface Layer**. Express handlers that translate HTTP requests into Action calls.
- `/src/db.ts`: **Data Layer**. Schema definitions, migrations, and the singleton database connection.
- `/src/api`: **Client Services**. API communication logic for the React frontend.
- `/spec`: **Testing Layer**. Behavioural and unit tests using Jasmine.
- `/src/cli`: **Maintenance Layer**. Command-line tools for installation and administration.

## 3. Data Invariants & Rules
- **Encapsulation**: Never query the database directly from a React component or an Express controller. Use an Action.
- **Schema Control**: All schema changes must be reflected in `src/db.ts` and mentioned in code-level migrations.
- **Error Handling**: Controllers must use the `handleActionResult` utility to ensure consistent error responses.
- **Auth Integrity**: Tokens are the primary method of stateless authentication.

## 4. Development Philosophy
1. **Spec First**: Define what a feature does before writing a line of code.
2. **Action Centric**: Business logic lives in Actions to enable alternate interfaces (Web, CLI, Tests).
3. **Defensive UI**: Handle loading, empty states, and errors gracefully.
