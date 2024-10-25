"use server";

import { db } from "@/app/_lib/prisma";
import { upsertSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const upsertSale = actionClient
  .schema(upsertSaleSchema)
  .action(async ({ parsedInput: { products, id } }) => {
    const isUpdate = Boolean(id);

    if (isUpdate) {
      const existingSale = await db.sale.findUnique({
        where: { id },
        include: { saleProducts: true },
      });
      if (!existingSale) return;
      await db.sale.delete({
        where: { id },
      });
      for (const product of existingSale.saleProducts) {
        await db.product.update({
          where: { id: product.productId },
          data: {
            stock: {
              increment: product.quantity,
            },
          },
        });
      }
    }

    const sale = await db.sale.create({
      data: {
        date: new Date(),
      },
    });

    for (const product of products) {
      const productFromDb = await db.product.findUnique({
        where: {
          id: product.id,
        },
      });

      if (!productFromDb) {
        returnValidationErrors(upsertSaleSchema, {
          _errors: ["Product not found."],
        });
      }

      const productIsOutOfStock = product.quantity > productFromDb.stock;
      if (productIsOutOfStock) {
        returnValidationErrors(upsertSaleSchema, {
          _errors: ["Product out of stock."],
        });
      }

      await db.saleProduct.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: product.quantity,
          unitPrice: productFromDb.price,
        },
      });

      await db.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: {
            decrement: product.quantity,
          },
        },
      });
    }

    revalidatePath("/", "layout");
  });
