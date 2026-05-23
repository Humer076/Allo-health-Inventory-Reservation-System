import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  const [mumbai, delhi] = await Promise.all([
    prisma.warehouse.create({
      data: { code: "MUM-FC", name: "Mumbai Fulfillment Center", city: "Mumbai" }
    }),
    prisma.warehouse.create({
      data: { code: "DEL-FC", name: "Delhi Fulfillment Center", city: "Delhi" }
    })
  ]);

  const [tee, bottle, sneakers] = await Promise.all([
    prisma.product.create({
      data: {
        sku: "TSHIRT-BLK-M",
        name: "Black Cotton T-Shirt",
        description: "Midweight everyday cotton t-shirt in black.",
        priceCents: 129900
      }
    }),
    prisma.product.create({
      data: {
        sku: "BOTTLE-STEEL-750",
        name: "750ml Steel Bottle",
        description: "Insulated stainless steel bottle for daily use.",
        priceCents: 79900
      }
    }),
    prisma.product.create({
      data: {
        sku: "SNEAKER-WHT-9",
        name: "White Low-Top Sneakers",
        description: "Minimal low-top sneakers with a rubber sole.",
        priceCents: 349900
      }
    })
  ]);

  await prisma.inventory.createMany({
    data: [
      { productId: tee.id, warehouseId: mumbai.id, totalStock: 42, reservedStock: 0 },
      { productId: tee.id, warehouseId: delhi.id, totalStock: 28, reservedStock: 3 },
      { productId: bottle.id, warehouseId: mumbai.id, totalStock: 16, reservedStock: 1 },
      { productId: bottle.id, warehouseId: delhi.id, totalStock: 31, reservedStock: 0 },
      { productId: sneakers.id, warehouseId: mumbai.id, totalStock: 7, reservedStock: 2 },
      { productId: sneakers.id, warehouseId: delhi.id, totalStock: 12, reservedStock: 0 }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
