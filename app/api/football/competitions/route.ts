import { NextResponse } from "next/server";
import { SUPPORTED_COMPETITIONS } from "@/lib/competitions";

export async function GET() {
  return NextResponse.json({ competitions: SUPPORTED_COMPETITIONS });
}
