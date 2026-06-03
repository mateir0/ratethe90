import { NextResponse } from "next/server";
import { fetchMatchById } from "@/lib/football-data";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const match = await fetchMatchById(id);
    return NextResponse.json({ match });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 });
  }
}
