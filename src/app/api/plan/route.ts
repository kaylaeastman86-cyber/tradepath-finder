import { buildFallbackPlan, getCareerDetails } from "@/lib/careeronestop";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const career = await getCareerDetails({
    tradeId: url.searchParams.get("trade") || "electrician",
    stateCode: url.searchParams.get("state") || "FL",
    city: url.searchParams.get("city") || "",
  });

  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_MODEL || "llama3.1";
  const location = `${career.city}, ${career.state.code}`;

  if (!baseUrl) {
    return Response.json({
      usedOllama: false,
      plan: buildFallbackPlan(career.trade, location, career.wage.median),
      career,
    });
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.OLLAMA_API_KEY ? { authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "user",
            content: [
              "Create a practical trade-career action plan. Use only the supplied data. Do not invent license rules.",
              `Trade: ${career.trade.title}`,
              `Location: ${location}`,
              `Summary: ${career.live.description || career.trade.summary}`,
              `Duties: ${(career.live.tasks.length ? career.live.tasks : career.trade.duties).join("; ")}`,
              `Training: ${career.trade.training.join("; ")}`,
              `Credentials: ${career.trade.credentials.join("; ")}`,
              `Wage source: ${career.wage.source}, median ${career.wage.median}`,
              `Licenses: ${JSON.stringify(career.live.licenses.slice(0, 5))}`,
              `Certifications: ${JSON.stringify(career.live.certifications.slice(0, 5))}`,
              `Training providers: ${JSON.stringify(career.live.training.slice(0, 5))}`,
              "Return: next step this week, training path, license/certification checks, school search, wage reality check.",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    return Response.json({
      usedOllama: true,
      plan: data.message?.content || data.response || "",
      career,
    });
  } catch (error) {
    return Response.json({
      usedOllama: false,
      plan: buildFallbackPlan(career.trade, location, career.wage.median),
      career,
      error: error instanceof Error ? error.message : "Ollama request failed",
    });
  }
}
