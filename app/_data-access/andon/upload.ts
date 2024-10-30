import S3 from "aws-sdk/clients/s3";

import { StorageProvider } from "@/services/storage/interface";
import { config } from "@/config";
import { convertFileToBuffer } from "@/app/_helpers/convert-file-to-buffer";

export class MinioStorageProvider implements StorageProvider {
  client: S3;

  constructor() {
    this.client = new S3({
      endpoint: config.storage.endpoint,
      apiVersion: "latest",
      accessKeyId: config.storage.accessKey,
      secretAccessKey: config.storage.secretKey,
      s3ForcePathStyle: true,
    });
  }

  async upload(file: File): Promise<string> {
    const fileBuffer = await convertFileToBuffer(file);

    const params = {
      Bucket: config.storage.bucket as string,
      Key: file.name,
      Body: fileBuffer,
      ACL: "public-read",
    };

    try {
      const { Location } = await this.client.upload(params).promise();
      return Location;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Error uploading file");
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: config.storage.bucket as string,
      Key: path,
    };

    try {
      await this.client.deleteObject(params).promise();
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error("Error deleting file");
    }
  }
}
