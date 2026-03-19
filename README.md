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
- Real-time tracking updates with Socket.IO
- Backend RBAC and ownership enforcement
- Shared formatting, linting, and type-checking workflow
- CI pipeline with formatting, linting, type checking, and build validation

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
- shipment access is filtered by role and ownership
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
- listens for live updates
- filters socket events by the active shipment id

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
PORT=3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Running the Project Locally

### Option 1: Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on `5432`
- Backend on `3001`
- Frontend on `3000`

### Option 2: Run Frontend and Backend Separately

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
```

These commands run the checks for both frontend and backend.

## CI

The GitHub Actions workflow runs:

- format check
- lint
- typecheck
- build

for both frontend and backend.

## Suggested Demo Flow

If you want to showcase this project in an interview or portfolio review, this is a strong end-to-end demo flow:

1. Log in as `ADMIN`
2. Update a user’s role to `COURIER`
3. Assign a courier to a shipment
4. Log in as `COURIER`
5. Update shipment status and tracking data
6. Open the shipment tracking page and show live updates
7. Log in as `USER` and show role-limited shipment visibility

## What This Project Demonstrates

- Full-stack TypeScript development
- API and UI design for role-based systems
- Backend authorization and ownership enforcement
- Admin operations tooling
- Real-time event-driven UI updates
- Frontend component decomposition and maintainable structure
- Practical engineering workflow with formatting, linting, type checking, and CI

## Future Improvements

- Seed/demo data for easier first-run setup
- Better auth error messaging from backend responses
- Integration and end-to-end tests
- Shipment-specific socket rooms instead of global broadcast
- Audit logs for role and assignment changes
- Richer courier availability and dispatch logic

## Author Notes

This project was built to reflect how a real internal logistics platform could evolve from a simple shipment tracker into a role-aware operational product.

The focus was not only on features, but also on:

- clean separation of concerns
- maintainable frontend component structure
- meaningful backend access control
- realistic product flows between different roles
