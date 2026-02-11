import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth/google-oauth";
import { createSessionToken, COOKIE_NAME, EXPIRY_DAYS } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Password login is not configured" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!isAuthorizedAdmin(email)) {
      return NextResponse.json(
        { error: "This email is not authorized for admin access" },
        { status: 403 }
      );
    }

    const token = await createSessionToken({
      email,
      name: email.split("@")[0],
      picture: "",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
