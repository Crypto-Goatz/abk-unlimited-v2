import { NextResponse } from "next/server";

function mask(val: string | undefined): string {
  if (!val) return "not set";
  if (val.length <= 8) return "****";
  return val.slice(0, 4) + "****" + val.slice(-4);
}

function emailFromKey(keyBase64: string | undefined): string {
  if (!keyBase64) return "not set";
  try {
    const json = JSON.parse(Buffer.from(keyBase64, "base64").toString("utf-8"));
    return json.client_email || "not set";
  } catch {
    return "invalid key";
  }
}

/**
 * GET /api/settings/env
 * Returns masked environment variable values for the settings dashboard.
 */
export async function GET() {
  return NextResponse.json({
    GOOGLE_SERVICE_ACCOUNT_EMAIL: emailFromKey(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    GOOGLE_SHEETS_ID: mask(process.env.GOOGLE_SHEETS_ID),
    GOOGLE_DRIVE_FOLDER_ID: mask(process.env.GOOGLE_DRIVE_FOLDER_ID),
    GEMINI_API_KEY: mask(process.env.GEMINI_API_KEY),
    CRO9_API_KEY: mask(process.env.NEXT_PUBLIC_CRO9_KEY),
    CRM_API_KEY: mask(process.env.CRM_API_KEY),
  });
}
