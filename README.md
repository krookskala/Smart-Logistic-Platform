# Smart Logistics Platform

A full-stack logistics application for managing shipments, courier assignment, and real-time delivery tracking.

This project demonstrates a role-based product architecture with separate experiences for administrators, end users, and couriers. It combines a Next.js frontend with a NestJS backend, PostgreSQL via Prisma, JWT authentication, RBAC, ownership checks, and Socket.IO-based live shipment updates.

## Highlights

- Role-based authentication and dashboard routing
- Separate dashboards for `ADMIN`, `USER`, and `COURIER`
- Admin user role management
- Courier assignment workflow
- Shipment creation and user-specific shipment visibility
- Courier-specific delivery update flow
- Per-shipment real-time tracking rooms with Socket.IO
- Audit logging for role changes, assignments, and tracking updates
- Request logging and health/readiness endpoint
- Backend RBAC and ownership enforcement
- Shared formatting, linting, and type-checking workflow
- CI pipeline with formatting, linting, type checking, backend tests, and build validation

## Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO Client

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.IO
- Class Validator

### Tooling

- ESLint
- Prettier
- TypeScript type checking
- GitHub Actions CI
- Docker / Docker Compose

## Role-Based Product Flows

### Admin

- View shipment metrics
- View shipment status distribution
- Assign couriers to shipments
- Manage user roles
- Promote users to couriers through role updates

### User

- Register and log in
- Create shipments
- View only their own shipments
- Open shipment tracking details

### Courier

- View only assigned deliveries
- Update tracking status
- Add delivery notes and optional coordinates
- See live shipment updates reflected in tracking pages

## Architecture Notes

This project is structured around domain responsibilities instead of keeping large JSX pages or monolithic service files.

### Frontend

- `src/app/admin` orchestrates admin state and composes admin components
- `src/app/user` orchestrates user shipment management
- `src/app/courier` orchestrates assigned-delivery workflows
- `src/components/admin`, `src/components/user`, `src/components/courier`, and `src/components/tracking` group UI by domain
- shared UI and shared types are centralized when reuse makes sense

### Backend

- auth logic is handled through JWT and role guards
- shipment access rules are centralized via `AccessControlService`
- tracking creation is restricted for assigned couriers and admins
- user role changes can automatically provision courier records when needed

## Security and Access Control

The backend enforces role-aware and ownership-aware access rules.

Examples:

- `ADMIN` can access all shipments and manage roles
- `USER` can only access shipments they created
- `COURIER` can only access shipments assigned to their courier record
- tracking events can only be created by admins or the assigned courier

This means the UI is role-specific, but the real security boundary is enforced in the backend.

## Real-Time Tracking

Shipment tracking updates are emitted through Socket.IO and displayed on the shipment tracking page.

The tracking detail page:

- fetches the shipment’s historical tracking events on load
- connects with the current JWT
- joins a `shipment:<id>` room via `joinShipmentRoom`
- listens for live updates emitted only to that room

This ensures each tracking page only shows events for the correct shipment.

## Project Structure

```text
Tracking App/
├── backend/
├── frontend/
├── docker/
├── .github/workflows/
├── docker-compose.yml
└── .env.example
```

## Environment Variables

Example values are provided in [.env.example](/C:/Users/Krookskala/Desktop/Tracking%20App/.env.example).

```env
DATABASE_URL=postgres://logistics:logistics@localhost:5432/logistics
JWT_SECRET=change-me
ALLOWED_ORIGINS=http://localhost:3000
JWT_ISSUER=
JWT_AUDIENCE=
PORT=3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Running the Project Locally

### Quick Start (Recommended)

A single command starts PostgreSQL (Docker), the backend (watch mode), and the frontend (dev server):

```bash
npm run dev
```

This starts:

- PostgreSQL on `5432` (via Docker)
- Backend on `3001` (NestJS watch mode with hot-reload)
- Frontend on `3000` (Next.js dev server with hot-reload)

All three processes run in parallel with color-coded output. Press `Ctrl+C` to stop everything.

To stop and remove the database container afterwards:

```bash
npm run dev:stop
```

### Option 2: Run with Full Docker Compose

If you prefer running everything inside Docker (no hot-reload):

```bash
docker compose up --build
```

### Option 3: Run Services Individually

Start PostgreSQL first, then:

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Quality Checks

From the project root:

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run test
```

These commands run the checks for both frontend and backend.

## CI

The GitHub Actions workflow runs:

- format check
- lint
- typecheck
- tests
- build

for both frontend and backend.

## Suggested Demo Flow

If you want to showcase this project in an interview or portfolio review, this is a strong end-to-end demo flow:

1. Start the stack (recommended with Docker Compose).
2. Seed demo data:
   - `cd backend`
   - `npm run prisma:seed`
3. Log in as `admin@example.com` (password: `Admin12345!`)
4. Promote `user1@example.com` to `COURIER` (role management panel).
5. Assign that courier to `Demo Shipment 2`.
6. Log in as `courier@example.com` (password: `Courier12345!`) and update tracking.
7. Open a shipment tracking page and show live updates pushed only to that shipment room.
8. Log in as `user2@example.com` (password: `User12345!`) and verify they only see their own shipments.

## What This Project Demonstrates

- Full-stack TypeScript development
- API and UI design for role-based systems
- Backend authorization and ownership enforcement
- Admin operations tooling
- Real-time event-driven UI updates
- Frontend component decomposition and maintainable structure
- Practical engineering workflow with formatting, linting, type checking, and CI

## Future Improvements

- Better auth error messaging from backend responses
- Full integration/e2e tests (beyond unit tests)
- Richer courier availability and dispatch logic

## Author Notes

This project was built to reflect how a real internal logistics platform could evolve from a simple shipment tracker into a role-aware operational product.

The focus was not only on features, but also on:

- clean separation of concerns
- maintainable frontend component structure
- meaningful backend access control
- realistic product flows between different roles
