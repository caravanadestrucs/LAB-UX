import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("authToken", "", { httpOnly: true, maxAge: 0, path: "/" });
  res.cookies.set("usuario", "", { maxAge: 0, path: "/" });
  return res;
}
