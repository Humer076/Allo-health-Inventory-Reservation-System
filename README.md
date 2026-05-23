<<<<<<< HEAD
# Allo Inventory Reservations

Next.js App Router take-home project for reserving inventory during checkout.

## Stack

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` to a hosted PostgreSQL database.

4. Run migrations and seed data:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

## API

- `GET /api/products` lists products with available stock per warehouse.
- `GET /api/warehouses` lists warehouses.
- `POST /api/reservations` reserves stock for checkout.
- `GET /api/reservations/:id` supports the reservation detail page.
- `POST /api/reservations/:id/confirm` confirms a successful payment.
- `POST /api/reservations/:id/release` releases a pending reservation.
- `POST /api/cron/release-expired-reservations` releases expired pending reservations.

## Concurrency Approach

The reservation endpoint uses a single conditional PostgreSQL update inside a Prisma
transaction:

```sql
UPDATE "Inventory"
SET "reservedStock" = "reservedStock" + quantity
WHERE "productId" = productId
  AND "warehouseId" = warehouseId
  AND "totalStock" - "reservedStock" >= quantity
```

If the update affects zero rows, the API returns `409`. This avoids a read-check-write
race and lets PostgreSQL decide which concurrent request wins the last available unit.

## Expiry Approach

Pending reservations have an `expiresAt` timestamp. Expired reservations are released by
lazy cleanup before inventory reads and reservation writes. A cron endpoint is also included
for production deployments and can be called every minute by Vercel Cron.

## Trade-Offs

- Idempotency is not implemented yet. I would add a small `IdempotencyKey` table with a
  unique key per method and path, then persist the original response for retries.
- The UI is intentionally simple so the reservation and concurrency logic stays easy to
  review.
=======
# Allo-health-Inventory-Reservation-System
A production-style inventory reservation system built with Next.js, Prisma, PostgreSQL, and Neon. Supports real-time stock reservations, concurrency-safe inventory handling, reservation lifecycle management, and warehouse-based inventory tracking.
>>>>>>> 53043bb51fb4512d9fae22c934905ce7c515c3f0
