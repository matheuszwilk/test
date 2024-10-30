"use server";

import { storageProvider } from "@/services/storage";

interface FormState {
  url: string;
}

export async function submitFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const url = await storageProvider.upload(file);

  return {
    url,
  };
}
