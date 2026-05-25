"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type ReservationResponse = {
  id: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "RELEASED";
  expiresAt: string;
  product: { name: string; sku: string };
  warehouse: { name: string; code: string };
};

const RESERVATION_TTL_MS = 10 * 60 * 1000;

export function ReservationDetail({ reservationId }: { reservationId: string }) {
  const { toast } = useToast();
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pendingAction, setPendingAction] = useState<"confirm" | "release" | null>(null);

  async function loadReservation() {
    const response = await fetch(`/api/reservations/${reservationId}`, { cache: "no-store" });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "Unable to load reservation.");
      toast({
        title: "Unable to load reservation",
        description: body.error ?? "Please try again.",
        variant: "error"
      });
      return;
    }

    setReservation(body.reservation);
  }

  async function mutateReservation(action: "confirm" | "release") {
    setPendingAction(action);
    setError(null);

    const response = await fetch(`/api/reservations/${reservationId}/${action}`, {
      method: "POST"
    });
    const body = await response.json();

    setPendingAction(null);

    if (!response.ok) {
      const message = body.error ?? `Unable to ${action} reservation.`;
      setError(message);
      toast({
        title: action === "confirm" ? "Confirm failed" : "Cancel failed",
        description: message,
        variant: response.status === 410 ? "warning" : "error"
      });
      if (body.reservation) {
        setReservation(body.reservation);
      }
      return;
    }

    toast({
      title: action === "confirm" ? "Purchase confirmed" : "Reservation cancelled",
      description:
        action === "confirm"
          ? "The reservation has been marked as confirmed."
          : "Reserved stock has been released.",
      variant: "success"
    });
    setReservation(body.reservation);
  }

  useEffect(() => {
    void loadReservation();
  }, [reservationId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = useMemo(() => {
    if (!reservation) return 0;
    return Math.max(0, new Date(reservation.expiresAt).getTime() - now);
  }, [now, reservation]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const remainingPercent = Math.min(100, Math.max(0, (remaining / RESERVATION_TTL_MS) * 100));
  const isExpired = reservation?.status === "PENDING" && remaining === 0;
  const isPending = reservation?.status === "PENDING" && !isExpired;

  if (!reservation) {
    return (
      <section className="border border-black/10 bg-white p-5 shadow-sm">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Reservation error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <p>Loading reservation...</p>
        )}
      </section>
    );
  }

  const statusBadge = getReservationStatusBadge(reservation.status, isExpired);

  return (
    <section className="border border-black/10 bg-white p-5 shadow-sm">
      {error ? (
        <Alert className="mb-5" variant="destructive">
          <AlertTitle>Reservation error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink/60">Product</dt>
          <dd className="mt-1 font-medium">
            {reservation.product.name} <span className="text-ink/50">{reservation.product.sku}</span>
          </dd>
        </div>
        <div>
          <dt className="text-ink/60">Warehouse</dt>
          <dd className="mt-1 font-medium">
            {reservation.warehouse.name}{" "}
            <span className="text-ink/50">{reservation.warehouse.code}</span>
          </dd>
        </div>
        <div>
          <dt className="text-ink/60">Quantity</dt>
          <dd className="mt-1 text-base font-semibold">{reservation.quantity}</dd>
        </div>
        <div>
          <dt className="text-ink/60">Status</dt>
          <dd className="mt-1">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-black/10 pt-5">
        <p className="text-sm text-ink/60">Time remaining</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          {reservation.status === "PENDING"
            ? `${minutes}:${seconds.toString().padStart(2, "0")}`
            : "Closed"}
        </p>
        {reservation.status === "PENDING" ? (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className={
                remainingPercent < 20
                  ? "h-full rounded-full bg-red-600 transition-all duration-1000"
                  : "h-full rounded-full bg-accent transition-all duration-1000"
              }
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isPending ? (
          <>
            <Button disabled={pendingAction !== null} onClick={() => mutateReservation("confirm")}>
              {pendingAction === "confirm" ? "Confirming..." : "Confirm purchase"}
            </Button>
            <Button
              variant="outline"
              disabled={pendingAction !== null}
              onClick={() => mutateReservation("release")}
            >
              {pendingAction === "release" ? "Cancelling..." : "Cancel"}
            </Button>
          </>
        ) : (
          <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            This reservation is closed. No checkout action is needed.
          </p>
        )}
        <Link className="px-4 py-2 text-sm font-medium text-accent" href="/">
          Back to products
        </Link>
      </div>
    </section>
  );
}

function getReservationStatusBadge(status: ReservationResponse["status"], isExpired: boolean) {
  if (isExpired) {
    return { label: "EXPIRED", variant: "destructive" as const };
  }

  if (status === "PENDING") {
    return { label: "PENDING", variant: "warning" as const };
  }

  if (status === "CONFIRMED") {
    return { label: "CONFIRMED", variant: "success" as const };
  }

  return { label: "RELEASED", variant: "secondary" as const };
}
