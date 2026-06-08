import { searchOccupations } from "@/lib/careeronestop";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  return Response.json(await searchOccupations(keyword));
}
