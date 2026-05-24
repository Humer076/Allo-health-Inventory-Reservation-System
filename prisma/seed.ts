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

  const [pulseOximeter, glucoseStrips, faceMasks] = await Promise.all([
    prisma.product.create({
      data: {
        sku: "PULSE-OXIMETER-FP",
        name: "Fingertip Pulse Oximeter",
        description: "Compact SpO2 and pulse rate monitor for clinical checks.",
        priceCents: 129900
      }
    }),
    prisma.product.create({
      data: {
        sku: "GLUCOSE-STRIPS-50",
        name: "Blood Glucose Test Strips",
        description: "Pack of 50 strips for compatible glucose monitoring devices.",
        priceCents: 79900
      }
    }),
    prisma.product.create({
      data: {
        sku: "MASK-SURGICAL-100",
        name: "Surgical Face Masks",
        description: "Box of 100 disposable 3-ply masks for care teams.",
        priceCents: 349900
      }
    })
  ]);

  await prisma.inventory.createMany({
    data: [
      { productId: pulseOximeter.id, warehouseId: mumbai.id, totalStock: 42, reservedStock: 0 },
      { productId: pulseOximeter.id, warehouseId: delhi.id, totalStock: 28, reservedStock: 3 },
      { productId: glucoseStrips.id, warehouseId: mumbai.id, totalStock: 16, reservedStock: 1 },
      { productId: glucoseStrips.id, warehouseId: delhi.id, totalStock: 31, reservedStock: 0 },
      { productId: faceMasks.id, warehouseId: mumbai.id, totalStock: 7, reservedStock: 2 },
      { productId: faceMasks.id, warehouseId: delhi.id, totalStock: 12, reservedStock: 0 }
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
