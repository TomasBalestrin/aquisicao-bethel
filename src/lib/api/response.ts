import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, count?: number): NextResponse {
  const body: { data: T; count?: number } = { data };
  if (count !== undefined) body.count = count;
  return NextResponse.json(body, { status: 200 });
}

export function apiError(
  error: string,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json({ error, message }, { status });
}
