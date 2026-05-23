import { prisma, prismaTransactionOptions } from "@/lib/prisma";
import { releaseExpiredReservations } from "@/lib/expiry";

export async function listProductsWithAvailability() {
  await prisma.$transaction(async (tx) => {
    await releaseExpiredReservations(tx);
  }, prismaTransactionOptions);

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      inventories: {
        orderBy: { warehouse: { code: "asc" } },
        include: { warehouse: true }
      }
    }
  });

  return products.map((product) => ({
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    warehouses: product.inventories.map((inventory) => ({
      warehouseId: inventory.warehouseId,
      warehouseName: inventory.warehouse.name,
      warehouseCode: inventory.warehouse.code,
      totalStock: inventory.totalStock,
      reservedStock: inventory.reservedStock,
      availableStock: inventory.totalStock - inventory.reservedStock
    }))
  }));
}
