import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  ALLOWED_IMAGE_CONTENT_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  buildS3ObjectKey,
  generatePresignedUploadUrl,
  isAllowedImageContentType,
} from "@/lib/s3";

type UploadType = "ieee_card" | "payment_screenshot";

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const SESSION_COOKIE_NAME = "upload_session_id";

const ipRateLimits = new Map<string, RateLimitEntry>();
const sessionRateLimits = new Map<string, RateLimitEntry>();

function cleanExpiredEntries(store: Map<string, RateLimitEntry>) {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) {
      store.delete(key);
    }
  }
}

function exceedsLimit(store: Map<string, RateLimitEntry>, key: string): boolean {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.expiresAt <= now) {
    store.set(key, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  store.set(key, existing);
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function parseUploadType(value: string): UploadType | null {
  if (value === "ieee_card" || value === "payment_screenshot") {
    return value;
  }
  return null;
}

function parseFileSizeHint(fileName: string): number | null {
  const match = fileName
    .toLowerCase()
    .match(/(?:^|[\s_.-])(\d+(?:\.\d+)?)\s*(kb|mb)(?:$|[\s_.-])/);

  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value)) {
    return null;
  }

  return match[2] === "mb" ? value * 1024 * 1024 : value * 1024;
}

export async function POST(request: NextRequest) {
  cleanExpiredEntries(ipRateLimits);
  cleanExpiredEntries(sessionRateLimits);

  const ipKey = `ip:${getClientIp(request)}`;

  const existingSessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sessionId = existingSessionId ?? randomUUID();
  const sessionKey = `session:${sessionId}`;

  if (exceedsLimit(ipRateLimits, ipKey) || exceedsLimit(sessionRateLimits, sessionKey)) {
    return NextResponse.json(
      {
        error: "Too many upload URL requests. Please wait a few minutes and try again.",
      },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const fileName =
    payload && typeof payload === "object" && "fileName" in payload
      ? String(payload.fileName || "").trim()
      : "";
  const fileType =
    payload && typeof payload === "object" && "fileType" in payload
      ? String(payload.fileType || "").trim()
      : "";
  const uploadTypeRaw =
    payload && typeof payload === "object" && "uploadType" in payload
      ? String(payload.uploadType || "").trim()
      : "";
  const fileSize =
    payload && typeof payload === "object" && "fileSize" in payload
      ? Number(payload.fileSize)
      : undefined;

  const uploadType = parseUploadType(uploadTypeRaw);

  if (!fileName || !uploadType) {
    return NextResponse.json(
      { error: "fileName and uploadType are required." },
      { status: 400 }
    );
  }

  if (!isAllowedImageContentType(fileType)) {
    return NextResponse.json(
      {
        error: `Unsupported file type. Allowed types: ${ALLOWED_IMAGE_CONTENT_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  if (fileSize !== undefined) {
    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "Invalid fileSize value." },
        { status: 400 }
      );
    }

    if (fileSize > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size must be 500KB or smaller." },
        { status: 400 }
      );
    }
  }

  const sizeHintFromName = parseFileSizeHint(fileName);
  if (sizeHintFromName !== null && sizeHintFromName > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File name suggests file exceeds the 500KB limit." },
      { status: 400 }
    );
  }

  try {
    const registrationId = `${sessionId}-${uploadType}`;
    const key = buildS3ObjectKey(registrationId, fileType);
    const { url, key: s3Key } = await generatePresignedUploadUrl({
      key,
      contentType: fileType,
      fileSizeBytes: fileSize,
    });

    const response = NextResponse.json({ uploadUrl: url, s3Key });

    if (!existingSessionId) {
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionId,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: RATE_LIMIT_WINDOW_MS / 1000,
      });
    }

    return response;
  } catch (error) {
    console.error("Failed to generate upload URL:", error);
    return NextResponse.json(
      { error: "Unable to generate upload URL right now." },
      { status: 500 }
    );
  }
}
