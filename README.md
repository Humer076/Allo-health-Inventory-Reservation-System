# StockFlow — Inventory Reservation System

A production-style inventory reservation system built with Next.js, Prisma, PostgreSQL, and Neon.

The system supports:
- real-time inventory reservations
- warehouse-based stock tracking
- reservation lifecycle management
- concurrency-safe inventory updates
- automatic expired reservation release

---

## Live Demo

https://allo-health-inventory-reservation-s.vercel.app/

---

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Neon Database

### Deployment
- Vercel

---

## Architecture

The application follows a layered full-stack architecture using Next.js App Router.

### Frontend Layer
- Built using Next.js and React
- UI components built with Tailwind CSS and shadcn/ui
- Dashboard displays:
  - inventory metrics
  - warehouse stock
  - reservation history
  - reservation status lifecycle

### API Layer
Implemented using Next.js API Routes.

Main APIs:
- `/api/products`
- `/api/reservations`
- `/api/reservations/[id]`
- `/api/reservations/[id]/confirm`
- `/api/reservations/[id]/release`
- `/api/cron/release-expired-reservations`

The API layer handles:
- inventory validation
- reservation lifecycle
- concurrency-safe updates
- stock calculations

### Database Layer
PostgreSQL database hosted on Neon.

Managed using Prisma ORM.

Main entities:
- Product
- Warehouse
- Inventory
- Reservation

### Concurrency Handling
Reservations use atomic conditional inventory updates to prevent overselling during simultaneous requests.

Inventory is updated safely using transactional reservation logic.

### Reservation Lifecycle

PENDING → CONFIRMED  
PENDING → RELEASED  
PENDING → EXPIRED

Expired reservations are automatically released back into available inventory.

### Deployment Architecture
- Frontend + Backend deployed on Vercel
- PostgreSQL hosted on Neon
- Environment variables managed securely using Vercel project settings

---

## Features

### Inventory Dashboard
- Product listing
- Warehouse inventory tracking
- Available stock calculation
- Low stock indicators
- Reservation metrics dashboard

### Reservation Lifecycle
- Create reservation
- Confirm reservation
- Release reservation
- Expire reservation automatically

### Reservation History
- Recent reservation tracking
- Status badges
- Created/expiry timestamps
- Reservation detail page

### Concurrency Safety
The reservation system prevents race conditions using atomic database updates.

Inventory reservations are handled using conditional updates to ensure stock cannot be oversold during simultaneous requests.

---

## Inventory Logic

The inventory system follows this logic:

### Total Inventory
Represents total physical stock available in warehouse.

### Reserved Inventory
Represents units currently held by active reservations.

### Available Inventory

available = total - reserved

Example:

- Total = 30
- Reserved = 4
- Available = 26

Total inventory never changes during reservation holds.

---

## Reservation Statuses

### PENDING
Reservation created and inventory held temporarily.

### CONFIRMED
Reservation confirmed successfully.

### RELEASED
Reservation manually released back into inventory.

### EXPIRED
Reservation expired automatically after timeout.

---

## API Routes

### Products

GET `/api/products`

Returns:
- products
- warehouse inventory
- reservation metrics

---

### Create Reservation

POST `/api/reservations`

Creates a temporary inventory hold.

---

### Get Reservation

GET `/api/reservations/[id]`

Returns reservation details.

---

### Confirm Reservation

POST `/api/reservations/[id]/confirm`

Marks reservation as confirmed.

---

### Release Reservation

POST `/api/reservations/[id]/release`

Releases held inventory.

---

### Expiry Cleanup

GET `/api/cron/release-expired-reservations`

Automatically releases expired reservations.

Protected using:

CRON_SECRET

---

## Database Schema

Main models:
- Product
- Warehouse
- Inventory
- Reservation

### Inventory Constraints

Inventory uses:

```prisma
@@unique([productId, warehouseId])
