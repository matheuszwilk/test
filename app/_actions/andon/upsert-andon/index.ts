"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { upsertAndonReportDataSchema } from "./schemas";
import { actionClient } from "@/app/_lib/safe-action";

export const updateAndonReport = actionClient
  .schema(upsertAndonReportDataSchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    upsertAndonReportDataSchema.parse(data);
    await db.andon_monthly_top_defects.update({
      where: { id },
      data,
    });
    revalidatePath("/report", "page");
    revalidatePath("/");
  });
