export const config = {
  storage: {
    endpoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "",
    secretKey: process.env.MINIO_SECRET_KEY || "",
    bucket: process.env.MINIO_BUCKET || "my-bucket",
    publicUrl: process.env.MINIO_PUBLIC_URL || "http://localhost:9000",
  },
  // ... outras configurações
};
