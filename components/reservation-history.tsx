"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type ReservationHistoryItem = {
  id: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "RELEASED";
  createdAt: string;
  expiresAt: string;
  product: { name: string };
  warehouse: { name: string; code: string };
};

export function ReservationHistory() {
  const [reservations, setReservations] = useState<ReservationHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadReservations() {
    const response = await fetch("/api/reservations", { cache: "no-store" });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "Unable to load recent reservations.");
      return;
    }

    setReservations(body.reservations);
  }

  useEffect(() => {
    void loadReservations();

    function refreshReservations() {
      void loadReservations();
    }

    window.addEventListener("focus", refreshReservations);
    window.addEventListener("pageshow", refreshReservations);

    return () => {
      window.removeEventListener("focus", refreshReservations);
      window.removeEventListener("pageshow", refreshReservations);
    };
  }, []);

  return (
    <Card className="overflow-hidden border-teal-100 bg-white/95">
      <CardHeader className="border-b border-slate-100 bg-white">
        <CardTitle>Recent Reservations</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        {error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertTitle>Unable to load history</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead>Reservation</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell className="text-ink/60" colSpan={7}>
                  No reservations yet.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => {
                const badge = getStatusBadge(reservation);

                return (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <Link
                        className="font-mono text-xs font-medium text-accent underline-offset-4 hover:underline"
                        href={`/reservations/${reservation.id}`}
                      >
                        {reservation.id.slice(0, 12)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{reservation.product.name}</TableCell>
                    <TableCell>
                      {reservation.warehouse.name}{" "}
                      <span className="text-ink/50">{reservation.warehouse.code}</span>
                    </TableCell>
                    <TableCell className="text-base font-semibold">{reservation.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(reservation.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(reservation.expiresAt)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function getStatusBadge(reservation: ReservationHistoryItem) {
  if (reservation.status === "PENDING" && new Date(reservation.expiresAt).getTime() <= Date.now()) {
    return { label: "EXPIRED", variant: "destructive" as const };
  }

  if (reservation.status === "PENDING") {
    return { label: "PENDING", variant: "warning" as const };
  }

  if (reservation.status === "CONFIRMED") {
    return { label: "CONFIRMED", variant: "success" as const };
  }

  return { label: "RELEASED", variant: "secondary" as const };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
