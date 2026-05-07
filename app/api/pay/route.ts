import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const random = Math.random();

  if (random < 0.15) {
    await new Promise((resolve) => setTimeout(resolve, 8000));
    return NextResponse.json({ error: "Timeout" }, { status: 504 });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (random < 0.4) {
    return NextResponse.json(
      { success: false, reason: "Insufficient funds" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
