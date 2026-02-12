import { NextResponse } from "next/server";

/**
 * GET /api/settings/status
 * Returns which integrations are configured based on env var presence.
 */
export async function GET() {
  return NextResponse.json({
    googleSheets: !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_SHEETS_ID),
    googleDrive: !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_DRIVE_FOLDER_ID),
    gemini: !!process.env.GEMINI_API_KEY,
    cro9: !!process.env.NEXT_PUBLIC_CRO9_KEY,
    crm: !!(process.env.CRM_API_KEY || process.env.CRM_CLIENT_ID),
    googleOAuth: !!(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET),
    socialPlanner: false,
    appsScript: false,
  });
}
