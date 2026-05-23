"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";

type ProductResponse = {
  id: string;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  warehouses: {
    warehouseId: string;
    warehouseName: string;
    warehouseCode: string;
    totalStock: number;
    reservedStock: number;
    availableStock: number;
  }[];
};

export function ProductList() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [activeReservations, setActiveReservations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  async function loadProducts(options: { showLoading?: boolean } = {}) {
    if (options.showLoading ?? true) {
      setLoading(true);
    }
    setError(null);

    const response = await fetch("/api/products", { cache: "no-store" });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error ?? "Unable to load products.");
      toast({
        title: "Unable to load products",
        description: body.error ?? "Please try again.",
        variant: "error"
      });
      setLoading(false);
      return;
    }

    setProducts(body.products);
    setLoading(false);
  }

  async function loadReservationMetrics() {
    const response = await fetch("/api/reservations", { cache: "no-store" });
    const body = await response.json();

    if (response.ok) {
      setActiveReservations(body.activeReservations);
    }
  }

  function applyReservedStockUpdate(productId: string, warehouseId: string) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        return {
          ...product,
          warehouses: product.warehouses.map((warehouse) => {
            if (warehouse.warehouseId !== warehouseId) {
              return warehouse;
            }

            return {
              ...warehouse,
              reservedStock: warehouse.reservedStock + 1,
              availableStock: warehouse.availableStock - 1
            };
          })
        };
      })
    );
  }

  async function reserve(productId: string, warehouseId: string) {
    const key = `${productId}:${warehouseId}`;
    setPendingKey(key);
    setError(null);

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, warehouseId, quantity: 1 })
    });
    const body = await response.json();

    setPendingKey(null);

    if (!response.ok) {
      const message = body.error ?? "Unable to reserve stock.";
      const visibleMessage =
        response.status === 409 ? "Another customer reserved the last available unit." : message;
      setError(visibleMessage);
      toast({
        title: response.status === 409 ? "Out of stock" : "Reservation failed",
        description: visibleMessage,
        variant: response.status === 409 ? "warning" : "error"
      });
      await loadProducts();
      return;
    }

    toast({
      title: "Reservation created",
      description: "Stock has been reserved for 10 minutes.",
      variant: "success"
    });
    applyReservedStockUpdate(productId, warehouseId);
    router.push(`/reservations/${body.reservation.id}`);
    void loadProducts({ showLoading: false });
    void loadReservationMetrics();
  }

  useEffect(() => {
    void loadProducts({ showLoading: false });
    void loadReservationMetrics();
  }, []);

  useEffect(() => {
    function refreshProducts() {
      void loadProducts({ showLoading: false });
      void loadReservationMetrics();
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        refreshProducts();
      }
    }

    window.addEventListener("focus", refreshProducts);
    window.addEventListener("pageshow", refreshProducts);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshProducts);
      window.removeEventListener("pageshow", refreshProducts);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-5">
          <p className="text-sm text-ink/70">Loading inventory...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <InventoryMetrics products={products} activeReservations={activeReservations} />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{error.includes("Another customer") ? "Stock conflict" : "Reservation failed"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <p className="mt-1 text-sm font-medium text-slate-500">{product.sku}</p>
                <CardDescription className="mt-3 max-w-2xl">{product.description}</CardDescription>
              </div>
              <p className="text-lg font-semibold text-slate-950">INR {(product.priceCents / 100).toFixed(2)}</p>
            </CardHeader>

            <CardContent>
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.warehouses.map((warehouse) => {
                    const key = `${product.id}:${warehouse.warehouseId}`;
                    const stockStatus = getStockStatus(warehouse.availableStock);

                    return (
                      <TableRow key={warehouse.warehouseId}>
                        <TableCell>
                          <span className="font-medium text-slate-900">{warehouse.warehouseName}</span>
                          <span className="ml-2 text-slate-400">{warehouse.warehouseCode}</span>
                        </TableCell>
                        <TableCell className="text-base font-semibold">{warehouse.totalStock}</TableCell>
                        <TableCell className="text-base font-semibold">{warehouse.reservedStock}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-base font-semibold">{warehouse.availableStock}</span>
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            disabled={warehouse.availableStock < 1 || pendingKey === key}
                            onClick={() => reserve(product.id, warehouse.warehouseId)}
                          >
                            {pendingKey === key
                              ? "Reserving..."
                              : warehouse.availableStock < 1
                                ? "Out of Stock"
                                : "Reserve"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InventoryMetrics({
  products,
  activeReservations
}: {
  products: ProductResponse[];
  activeReservations: number;
}) {
  const warehouseIds = new Set<string>();
  let totalAvailableInventory = 0;

  for (const product of products) {
    for (const warehouse of product.warehouses) {
      warehouseIds.add(warehouse.warehouseId);
      totalAvailableInventory += warehouse.availableStock;
    }
  }

  const metrics = [
    { label: "Products", value: products.length },
    { label: "Active reservations", value: activeReservations },
    { label: "Warehouses", value: warehouseIds.size },
    { label: "Available inventory", value: totalAvailableInventory }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getStockStatus(availableStock: number) {
  if (availableStock === 0) {
    return { label: "Out of Stock", variant: "destructive" as const };
  }

  if (availableStock <= 10) {
    return { label: "Low Stock", variant: "warning" as const };
  }

  return { label: "In Stock", variant: "success" as const };
}
