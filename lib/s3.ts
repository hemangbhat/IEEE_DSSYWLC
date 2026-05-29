import { randomBytes } from "crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const MAX_UPLOAD_SIZE_BYTES = 500 * 1024;

/** Allowed for payment screenshots (images only). */
export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Allowed for IEEE card uploads (images + PDF). */
export const ALLOWED_DOCUMENT_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type AllowedImageContentType =
  (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

export type AllowedDocumentContentType =
  (typeof ALLOWED_DOCUMENT_CONTENT_TYPES)[number];

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
    forcePathStyle: false,
  });

  return cachedClient;
}

export function isAllowedImageContentType(
  fileType: string
): fileType is AllowedImageContentType {
  return (ALLOWED_IMAGE_CONTENT_TYPES as readonly string[]).includes(fileType);
}

export function isAllowedDocumentContentType(
  fileType: string
): fileType is AllowedDocumentContentType {
  return (ALLOWED_DOCUMENT_CONTENT_TYPES as readonly string[]).includes(fileType);
}

function extensionFromContentType(contentType: AllowedDocumentContentType): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export function buildS3ObjectKey(
  registrationId: string,
  contentType: AllowedDocumentContentType
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
  contentType: AllowedDocumentContentType;
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
  });

  const url = await getSignedUrl(getS3Client(), command, { expiresIn: 300 });

  return { url, key };
}

/**
 * Fetch metadata (size + content type) for an uploaded object.
 * Returns null if the object does not exist (or on error).
 */
export async function getS3ObjectMeta(
  key: string
): Promise<{ contentLength: number; contentType: string } | null> {
  try {
    const result = await getS3Client().send(
      new HeadObjectCommand({
        Bucket: requiredEnv("S3_BUCKET_NAME"),
        Key: key,
      })
    );
    return {
      contentLength: result.ContentLength ?? 0,
      contentType: result.ContentType ?? "",
    };
  } catch {
    return null;
  }
}

/** Delete an S3 object. Best-effort; logs but does not throw on failure. */
export async function deleteS3Object(key: string): Promise<void> {
  try {
    await getS3Client().send(
      new DeleteObjectCommand({
        Bucket: requiredEnv("S3_BUCKET_NAME"),
        Key: key,
      })
    );
  } catch (error) {
    console.error("Failed to delete S3 object:", key, error);
  }
}

/** Build a permanent public URL for an S3 object given its key. */
export function buildS3PublicUrl(key: string): string {
  const bucket = process.env.S3_BUCKET_NAME || "";
  const region = process.env.S3_REGION || "ap-south-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(key)}`;
}
