import { NextRequest, NextResponse } from "next/server";
import { listFiles, uploadFile, deleteFile } from "@/lib/google/drive";

function checkDriveConfig() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return "Google Drive is not configured. Add GOOGLE_SERVICE_ACCOUNT_KEY in Vercel environment variables.";
  }
  if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
    return "Google Drive folder is not configured. Add GOOGLE_DRIVE_FOLDER_ID in Vercel environment variables.";
  }
  return null;
}

/**
 * GET /api/media?subfolder=portfolio
 * List images from a Drive subfolder
 */
export async function GET(req: NextRequest) {
  const configError = checkDriveConfig();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  const subfolder = req.nextUrl.searchParams.get("subfolder") || undefined;

  try {
    const files = await listFiles(subfolder);
    return NextResponse.json({ files });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/media
 * Upload an image to Drive (FormData with "file" and optional "subfolder")
 */
export async function POST(req: NextRequest) {
  const configError = checkDriveConfig();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const subfolder = (formData.get("subfolder") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, file.name, file.type, subfolder);

    return NextResponse.json({ file: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/media?fileId=abc123
 * Delete an image from Drive
 */
export async function DELETE(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "fileId required" }, { status: 400 });
  }

  try {
    await deleteFile(fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
