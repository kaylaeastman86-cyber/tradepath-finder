import { getCareerDetails } from "@/lib/careeronestop";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tradeId = url.searchParams.get("trade") || "electrician";
  const stateCode = url.searchParams.get("state") || "FL";
  const city = url.searchParams.get("city") || "";

  return Response.json(await getCareerDetails({ tradeId, stateCode, city }));
}
