import { categories, states, trades } from "@/lib/catalog";
import { hasCareerOneStopCredentials } from "@/lib/careeronestop";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    name: "TradePath Finder",
    trades,
    states,
    categories,
    apiStatus: {
      careerOneStop: hasCareerOneStopCredentials(),
      ollamaConfigured: Boolean(process.env.OLLAMA_BASE_URL),
      adsenseConfigured: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    },
    sources: [
      { name: "BLS OEWS wage tables", url: "https://www.bls.gov/oes/tables.htm" },
      { name: "CareerOneStop API Explorer", url: "https://api.careeronestop.org/api-explorer/" },
      { name: "O*NET OnLine", url: "https://www.onetonline.org/" },
    ],
  });
}
