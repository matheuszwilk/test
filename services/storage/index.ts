import { StorageProvider } from "./interface";
import { MinioStorageService } from "./implementations/minio";

export const storageProvider: StorageProvider = new MinioStorageService({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || "",
  bucket: process.env.MINIO_BUCKET || "aws-f6",
});
