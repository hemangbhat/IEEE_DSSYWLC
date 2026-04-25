import { randomBytes } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const MAX_UPLOAD_SIZE_BYTES = 500 * 1024;
export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageContentType =
  (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for S3 uploads.`);
  }
  return value;
}

let cachedClient: S3Client | null = null;

function getS3Client(): S3Client {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new S3Client({
    region: requiredEnv("S3_REGION"),
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true,
  });

  return cachedClient;
}

export function isAllowedImageContentType(
  fileType: string
): fileType is AllowedImageContentType {
  return (ALLOWED_IMAGE_CONTENT_TYPES as readonly string[]).includes(fileType);
}

function extensionFromContentType(contentType: AllowedImageContentType): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export function buildS3ObjectKey(
  registrationId: string,
  contentType: AllowedImageContentType
): string {
  const timestamp = Date.now();
  const randomPart = randomBytes(8).toString("hex");
  const extension = extensionFromContentType(contentType);
  return `students/${registrationId}/${timestamp}-${randomPart}.${extension}`;
}

export async function generatePresignedUploadUrl({
  key,
  contentType,
  fileSizeBytes,
}: {
  key: string;
  contentType: AllowedImageContentType;
  fileSizeBytes?: number;
}): Promise<{ url: string; key: string }> {
  if (fileSizeBytes !== undefined) {
    if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) {
      throw new Error("File size must be a positive number.");
    }
    if (fileSizeBytes > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error("File is larger than the 500KB upload limit.");
    }
  }

  const command = new PutObjectCommand({
    Bucket: requiredEnv("S3_BUCKET_NAME"),
    Key: key,
    ContentType: contentType,
    ...(fileSizeBytes ? { ContentLength: fileSizeBytes } : {}),
  });

  const url = await getSignedUrl(getS3Client(), command, { expiresIn: 300 });

  return { url, key };
}
