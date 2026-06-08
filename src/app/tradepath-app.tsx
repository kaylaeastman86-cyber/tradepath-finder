"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StateOption, Trade } from "@/lib/catalog";

type Wage = {
  source: string;
  year: string;
  area: string;
  low: number;
  median: number;
  high: number;
};

type LivePayload = {
  wage: Wage;
  live: {
    connected: boolean;
    description?: string;
    tasks: string[];
    licenses: Record<string, unknown>[];
    certifications: Record<string, unknown>[];
    training: Record<string, unknown>[];
    errors: Record<string, string | null>;
  };
};

type OfficialResult = {
  title: string;
  code: string;
  description: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: { label: string; score: number }[];
};

type Props = {
  initialTrades: Trade[];
  initialStates: StateOption[];
  categories: string[];
  sourceAudit: {
    checkedAt: string;
    schedule: string;
    status: string;
    summary: string;
    sources: { id: string; name: string; ok?: boolean; status?: number | null; url: string }[];
  };
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const categoryGuides: Record<
  string,
  {
    quiz: QuizQuestion[];
    reality: string[];
    businessPath: string[];
  }
> = {
  "Construction & Building": {
    quiz: [
      {
        id: "outdoors",
        question: "How do you feel about physical work, changing jobsites, weather, and early starts?",
        options: [
          { label: "That sounds workable for me", score: 2 },
          { label: "I can handle some of it", score: 1 },
          { label: "I need mostly indoor predictable work", score: 0 },
        ],
      },
      {
        id: "precision",
        question: "Do you like measuring, layout, tools, plans, and seeing visible progress?",
        options: [
          { label: "Yes, that is the kind of work I want", score: 2 },
          { label: "Maybe, if I can learn it step by step", score: 1 },
          { label: "No, I would rather avoid tool-heavy work", score: 0 },
        ],
      },
      {
        id: "safety",
        question: "Can you follow strict safety rules even when the crew is moving fast?",
        options: [
          { label: "Yes, safety rules help me focus", score: 2 },
          { label: "I would need practice", score: 1 },
          { label: "That would probably frustrate me", score: 0 },
        ],
      },
    ],
    reality: [
      "Work can be seasonal, physically demanding, and deadline-driven.",
      "Pay usually rises with documented hours, licenses, specialty skills, and reliability.",
      "The people who move up fastest tend to learn safety, plans, communication, and estimating, not only tool use.",
    ],
    businessPath: [
      "Start as a helper, apprentice, or entry-level crew member and document every hour and project type.",
      "Move into lead hand, foreman, estimator, or licensed journeyman/master work once experience and exams allow.",
      "Before starting a company, plan for contractor licensing, insurance, bonding, tools, a truck, permits, bookkeeping, taxes, and customer acquisition.",
    ],
  },
  "Healthcare & Public Safety": {
    quiz: [
      {
        id: "people",
        question: "Are you comfortable helping people who may be stressed, sick, scared, or in pain?",
        options: [
          { label: "Yes, that is meaningful to me", score: 2 },
          { label: "Some situations may take practice", score: 1 },
          { label: "I would rather avoid that", score: 0 },
        ],
      },
      {
        id: "rules",
        question: "Can you follow protocols, privacy rules, and documentation requirements carefully?",
        options: [
          { label: "Yes, structure helps me", score: 2 },
          { label: "I can learn it", score: 1 },
          { label: "I prefer less regulated work", score: 0 },
        ],
      },
      {
        id: "pace",
        question: "How do you handle fast decisions and responsibility for other people's safety?",
        options: [
          { label: "I stay calm and focused", score: 2 },
          { label: "I would need training and repetition", score: 1 },
          { label: "That sounds too stressful", score: 0 },
        ],
      },
    ],
    reality: [
      "Entry-level healthcare roles can be emotionally demanding and highly regulated.",
      "Advancement usually depends on certification, scope of practice, clinical hours, and employer requirements.",
      "Public safety roles may involve shift work, testing, background checks, physical standards, and stressful calls.",
    ],
    businessPath: [
      "Build experience and credentials first; many independent healthcare services require strict licensing and compliance.",
      "Possible business paths include training services, staffing support, mobile services where legal, consulting, or moving into administration.",
      "Before business ownership, confirm state scope rules, insurance, HIPAA/privacy duties, medical director rules where applicable, and local permits.",
    ],
  },
  "Manufacturing & Industrial": {
    quiz: [
      {
        id: "machines",
        question: "Do you like machines, measurement, troubleshooting, and repeatable processes?",
        options: [
          { label: "Yes, that fits me", score: 2 },
          { label: "I am curious but new to it", score: 1 },
          { label: "Not really", score: 0 },
        ],
      },
      {
        id: "detail",
        question: "Can you stay focused on details, tolerances, quality checks, and safety locks?",
        options: [
          { label: "Yes, details are my lane", score: 2 },
          { label: "With training, yes", score: 1 },
          { label: "I prefer looser work", score: 0 },
        ],
      },
      {
        id: "shifts",
        question: "Could you work shifts, overtime, or plant schedules if the pay and growth are right?",
        options: [
          { label: "Yes", score: 2 },
          { label: "Sometimes", score: 1 },
          { label: "No", score: 0 },
        ],
      },
    ],
    reality: [
      "Industrial work rewards reliability, safety, diagnostics, and quality discipline.",
      "Plants may run nights, weekends, overtime, or rotating shifts.",
      "Cross-training in electrical, mechanical, PLCs, machining, welding, and quality can raise earning power.",
    ],
    businessPath: [
      "Start by building a specialty: machining, welding, maintenance, automation, quality, or fabrication.",
      "Move into lead technician, planner, supervisor, inspector, programmer, or independent repair/fabrication work.",
      "Business ownership often requires equipment, shop space, insurance, supplier relationships, quoting skills, and quality documentation.",
    ],
  },
};

const defaultCategoryGuide = {
  quiz: [
    {
      id: "hands-on",
      question: "Do you want hands-on work where skill improves through practice?",
      options: [
        { label: "Yes, I learn best by doing", score: 2 },
        { label: "Some hands-on work is good", score: 1 },
        { label: "I prefer mostly desk-based work", score: 0 },
      ],
    },
    {
      id: "credential",
      question: "Are you willing to complete a license, certificate, apprenticeship, or exam if it unlocks better pay?",
      options: [
        { label: "Yes", score: 2 },
        { label: "Maybe if the path is clear", score: 1 },
        { label: "No", score: 0 },
      ],
    },
    {
      id: "growth",
      question: "Would you eventually want to lead crews, specialize, train others, or build a business?",
      options: [
        { label: "Yes, I want a growth path", score: 2 },
        { label: "Maybe later", score: 1 },
        { label: "I only want a steady job", score: 0 },
      ],
    },
  ],
  reality: [
    "Every trade has tradeoffs: pay, physical demands, schedules, licensing, risk, and long-term body impact vary by field.",
    "The safest decision is to verify wages, school claims, and licensing rules with official agencies before paying for training.",
    "Talk to at least two workers in the field before committing; real day-to-day work often differs from online highlight videos.",
  ],
  businessPath: [
    "Learn the trade first, then learn estimating, customer service, pricing, insurance, taxes, and operations.",
    "Do not quit into a business too early; build savings, tools, references, licensing, and a simple bookkeeping process first.",
    "A strong business path usually starts with reliable work, documented results, repeat customers, and clean compliance.",
  ],
};

function estimateWage(trade: Trade, region: StateOption, city: string): Wage {
  const major = ["new york", "los angeles", "san jose", "seattle", "boston", "chicago", "denver", "miami", "san francisco"].some((item) =>
    city.toLowerCase().includes(item),
  );
  const median = Math.round((trade.nationalMedian * region.wageIndex * (major ? 1.08 : city ? 1.02 : 1)) / 100) * 100;
  return {
    source: "Planning estimate",
    year: "Local estimate until official data is connected",
    area: city ? `${city}, ${region.code}` : region.name,
    low: Math.round((median * 0.76) / 100) * 100,
    median,
    high: Math.round((median * 1.28) / 100) * 100,
  };
}

function labelOf(record: Record<string, unknown>, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = record[key];
    if (value) return String(value);
  }
  return fallback;
}

function DetailStack({
  records,
  fallback,
  type,
}: {
  records?: Record<string, unknown>[];
  fallback: { title: string; text: string }[];
  type: "license" | "cert" | "school";
}) {
  const hasRecords = Boolean(records?.length);
  const items = hasRecords ? records || [] : fallback;

  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        if (!hasRecords) {
          const fallbackItem = item as { title: string; text: string };
          return (
            <div className="border-l-4 border-[#205b91] bg-[#f7f9fb] p-3" key={`${fallbackItem.title}-${index}`}>
              <strong className="block text-sm">{fallbackItem.title}</strong>
              <span className="mt-1 block text-sm leading-6 text-[#5e6b78]">{fallbackItem.text}</span>
            </div>
          );
        }

        const record = item as Record<string, unknown>;
        const agency = record.LicenseAgency as Record<string, unknown> | undefined;
        const title =
          type === "license"
            ? labelOf(record, ["Title", "Name"], "License")
            : type === "cert"
              ? labelOf(record, ["Name", "Title"], "Certification")
              : labelOf(record, ["ProgramName", "SchoolName", "ProviderName"], "Training program");
        const text =
          type === "license"
            ? `${labelOf(agency || {}, ["Name"], labelOf(record, ["State"], "State agency"))}${record.LicExamIndDesc ? ` | ${String(record.LicExamIndDesc)}` : ""}`
            : type === "cert"
              ? labelOf(record, ["Organization", "Type", "Related"], "Certification provider")
              : labelOf(record, ["SchoolName", "ProviderName", "City", "Location"], "Local provider");

        return (
          <div className="border-l-4 border-[#205b91] bg-[#f7f9fb] p-3" key={`${title}-${index}`}>
            <strong className="block text-sm">{title}</strong>
            <span className="mt-1 block text-sm leading-6 text-[#5e6b78]">{text}</span>
          </div>
        );
      })}
    </div>
  );
}

function AdSlot({ label }: { label: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <aside className="border border-dashed border-[#c8d3dc] bg-white p-4 text-center text-xs text-[#5e6b78]" aria-label={label}>
      {client ? "Advertisement" : "Ad placement reserved"}
    </aside>
  );
}

function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function TradePathApp({ initialTrades, initialStates, categories, sourceAudit }: Props) {
  const [selectedTradeId, setSelectedTradeId] = useState(initialTrades[0].id);
  const [selectedState, setSelectedState] = useState("FL");
  const [selectedCity, setSelectedCity] = useState("Jacksonville");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [livePayload, setLivePayload] = useState<LivePayload | null>(null);
  const [plan, setPlan] = useState("");
  const [planSource, setPlanSource] = useState("");
  const [officialResults, setOfficialResults] = useState<OfficialResult[]>([]);
  const [officialSearchNote, setOfficialSearchNote] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<"live" | "plan" | null>(null);

  const trade = initialTrades.find((item) => item.id === selectedTradeId) || initialTrades[0];
  const region = initialStates.find((item) => item.code === selectedState) || initialStates[0];
  const wage = livePayload?.wage || estimateWage(trade, region, selectedCity);
  const categoryGuide = categoryGuides[trade.category] || defaultCategoryGuide;
  const quizScore = Object.values(quizAnswers).reduce((total, score) => total + score, 0);
  const maxQuizScore = categoryGuide.quiz.length * 2;
  const quizResult =
    Object.keys(quizAnswers).length < categoryGuide.quiz.length
      ? "Answer the questions to see fit guidance."
      : quizScore >= maxQuizScore - 1
        ? "Strong fit signal. Next step: compare training options and talk to someone currently doing the work."
        : quizScore >= Math.ceil(maxQuizScore / 2)
          ? "Possible fit. Focus on shadowing, videos, and entry-level tasks before spending money."
          : "Weak fit signal for this category. Try another category quiz before choosing a program.";

  const filteredTrades = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialTrades.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const haystack = [item.title, item.category, item.subcategory, item.summary, item.soc, item.onet, ...item.credentials, ...item.duties].join(" ").toLowerCase();
      return categoryMatch && (!q || haystack.includes(q));
    });
  }, [category, initialTrades, query]);

  async function refreshLive() {
    setLoading("live");
    const params = new URLSearchParams({ trade: selectedTradeId, state: selectedState, city: selectedCity });
    const response = await fetch(`/api/live?${params.toString()}`);
    const payload = (await response.json()) as LivePayload;
    setLivePayload(payload);
    setLoading(null);
  }

  async function buildPlan() {
    setLoading("plan");
    setPlan("Building career plan...");
    const params = new URLSearchParams({ trade: selectedTradeId, state: selectedState, city: selectedCity });
    const response = await fetch(`/api/plan?${params.toString()}`);
    const payload = (await response.json()) as { usedOllama: boolean; plan: string; career: LivePayload };
    setLivePayload(payload.career);
    setPlan(payload.plan);
    setPlanSource(payload.usedOllama ? "Ollama" : "TradePath fallback");
    setLoading(null);
  }

  async function searchOfficialOccupations() {
    if (!query.trim()) {
      setOfficialSearchNote("Type a trade, skill, or occupation keyword first.");
      return;
    }
    setOfficialSearchNote("Searching official occupation records...");
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const payload = (await response.json()) as { connected: boolean; records: OfficialResult[]; reason?: string };
    setOfficialResults(payload.records || []);
    setOfficialSearchNote(
      payload.connected
        ? `${payload.records.length} official records returned by CareerOneStop.`
        : payload.reason || "CareerOneStop credentials are needed for official occupation search.",
    );
  }

  function selectTrade(id: string) {
    setSelectedTradeId(id);
    setLivePayload(null);
    setPlan("");
    setQuizAnswers({});
  }

  function selectState(code: string) {
    const next = initialStates.find((item) => item.code === code);
    setSelectedState(code);
    setSelectedCity(next?.cities[0] || "");
    setLivePayload(null);
  }

  const taskList = livePayload?.live.tasks?.length ? livePayload.live.tasks : trade.duties;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1500px] p-4 text-[#17212b] max-[640px]:p-2">
      <div className="grid min-h-[calc(100vh-2rem)] grid-cols-[340px_minmax(0,1fr)] border border-[#d8e0e7] bg-white shadow-[0_18px_45px_rgba(21,33,45,0.12)] max-[1120px]:grid-cols-1">
        <aside className="flex flex-col gap-5 border-r border-[#d8e0e7] bg-[#fbfcfd] p-6 max-[1120px]:border-b max-[1120px]:border-r-0 max-[640px]:p-4">
          <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-3">
            <div className="grid h-13 w-13 place-items-center rounded-lg bg-[#17212b] font-bold text-white">TP</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">TradePath Finder</h1>
              <p className="mt-1 text-sm text-[#5e6b78]">Trades, wages, credentials, and schools by location</p>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            Trade
            <select className="h-11 rounded-md border border-[#d8e0e7] bg-white px-3" value={selectedTradeId} onChange={(event) => selectTrade(event.target.value)}>
              {initialTrades.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            State
            <select className="h-11 rounded-md border border-[#d8e0e7] bg-white px-3" value={selectedState} onChange={(event) => selectState(event.target.value)}>
              {initialStates.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            City
            <input
              className="h-11 rounded-md border border-[#d8e0e7] bg-white px-3"
              list="city-options"
              value={selectedCity}
              onChange={(event) => {
                setSelectedCity(event.target.value);
                setLivePayload(null);
              }}
              placeholder="Type any city"
            />
            <datalist id="city-options">
              {region.cities.map((city) => (
                <option value={city} key={city} />
              ))}
            </datalist>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Search directory
            <input
              className="h-11 rounded-md border border-[#d8e0e7] bg-white px-3"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, field, license, duty"
              type="search"
            />
          </label>
          <button className="min-h-10 rounded-md border border-[#205b91] bg-white px-3 text-sm font-bold text-[#205b91]" onClick={searchOfficialOccupations} type="button">
            Search official occupations
          </button>
          {officialSearchNote ? <p className="text-sm leading-6 text-[#5e6b78]">{officialSearchNote}</p> : null}

          <div className="flex flex-wrap gap-2" aria-label="Career categories">
            {["All", ...categories].map((item) => (
              <button
                className={`min-h-9 rounded-full border px-3 text-sm ${category === item ? "border-[#143d63] bg-[#143d63] text-white" : "border-[#d8e0e7] bg-white"}`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-auto grid gap-2 border border-[#d8e0e7] bg-white p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[#5e6b78]">Official data</span>
              <strong>{livePayload?.live.connected ? "Connected" : "Env needed"}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#5e6b78]">AdSense</span>
              <strong>Ready slots</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#5e6b78]">Weekly check</span>
              <strong>{sourceAudit.status === "ok" ? "Clean" : "Review"}</strong>
            </div>
          </div>
        </aside>

        <section className="grid gap-5 bg-gradient-to-b from-white to-[#f6f8fa] p-6 max-[640px]:p-4">
          <section className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[#d8e0e7] pb-5 max-[760px]:grid-cols-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-[#205b91]">
                {trade.category} | {trade.subcategory} {trade.soc ? `| ${trade.soc}` : ""}
              </p>
              <h2 className="mt-1 text-4xl font-bold leading-tight tracking-normal max-[760px]:text-3xl">{trade.title}</h2>
              <p className="mt-3 max-w-4xl leading-7 text-[#354656]">{livePayload?.live.description || trade.summary}</p>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-2 max-[760px]:justify-stretch">
              <button className="min-h-11 rounded-md bg-[#237455] px-4 font-bold text-white disabled:opacity-70 max-[760px]:flex-1" disabled={loading === "live"} onClick={refreshLive} type="button">
                {loading === "live" ? "Refreshing" : "Refresh official data"}
              </button>
              <button className="min-h-11 rounded-md border border-[#d8e0e7] bg-white px-4 font-bold disabled:opacity-70 max-[760px]:flex-1" disabled={loading === "plan"} onClick={buildPlan} type="button">
                {loading === "plan" ? "Building" : "Build career plan"}
              </button>
            </div>
          </section>

          <section className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1" aria-label="Wage range">
            {[
              ["Low", wage.low],
              ["Median", wage.median],
              ["High", wage.high],
            ].map(([label, value]) => (
              <div className={`grid min-h-24 content-center gap-2 border border-[#d8e0e7] bg-white p-4 ${label === "Median" ? "bg-[#f1fbf6]" : ""}`} key={label}>
                <span className="text-xs text-[#5e6b78]">{label}</span>
                <strong className="text-2xl">{formatMoney(Number(value))}</strong>
              </div>
            ))}
            <div className="grid min-h-24 content-center gap-2 border border-[#d8e0e7] bg-white p-4">
              <span className="text-xs text-[#5e6b78]">Area</span>
              <strong className="text-lg">{wage.area}</strong>
            </div>
          </section>

          <AdSlot label="Top ad placement" />

          <section className="grid gap-3 border border-[#d8e0e7] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Weekly Source Check</h3>
                <p className="mt-1 text-sm text-[#5e6b78]">
                  Last checked {sourceAudit.checkedAt.slice(0, 10)}. Scheduled for Sundays so salary and occupation sources do not quietly go stale.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${sourceAudit.status === "ok" ? "bg-[#f1fbf6] text-[#237455]" : "bg-[#fff5e8] text-[#a56613]"}`}>
                {sourceAudit.status}
              </span>
            </div>
            <p className="leading-7 text-[#314354]">{sourceAudit.summary}</p>
            <div className="grid grid-cols-3 gap-2 max-[900px]:grid-cols-1">
              {sourceAudit.sources.length ? (
                sourceAudit.sources.map((source) => (
                  <a className="border border-[#d8e0e7] bg-[#f7f9fb] p-3 text-sm" href={source.url} key={source.id} rel="noopener noreferrer" target="_blank">
                    <strong className="block">{source.name}</strong>
                    <span className="mt-1 block text-[#5e6b78]">Status: {source.ok ? "reachable" : "needs review"} {source.status ? `(${source.status})` : ""}</span>
                  </a>
                ))
              ) : (
                <span className="text-sm text-[#5e6b78]">First scheduled source run pending.</span>
              )}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
            <article className="border border-[#d8e0e7] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">What The Job Entails</h3>
                <span className="text-xs text-[#5e6b78]">{wage.source}</span>
              </div>
              <ul className="list-disc space-y-2 pl-5 leading-7 text-[#314354]">
                {taskList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="border border-[#d8e0e7] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Training Path</h3>
                <span className="text-xs text-[#5e6b78]">{wage.year}</span>
              </div>
              <ol className="list-decimal space-y-2 pl-5 leading-7 text-[#314354]">
                {trade.training.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </section>

          <section className="grid grid-cols-3 gap-3 max-[1100px]:grid-cols-1">
            <article className="border border-[#d8e0e7] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">License Requirements</h3>
              <DetailStack
                records={livePayload?.live.licenses}
                fallback={trade.credentials.map((item) => ({ title: item, text: `Verify the exact requirement with ${region.name}'s licensing board or local agency.` }))}
                type="license"
              />
            </article>
            <article className="border border-[#d8e0e7] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">Certifications</h3>
              <DetailStack
                records={livePayload?.live.certifications}
                fallback={trade.credentials.slice(0, 4).map((item) => ({ title: item, text: "Confirm with employers, the state board, and official credential providers." }))}
                type="cert"
              />
            </article>
            <article className="border border-[#d8e0e7] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">Schools And Programs</h3>
              <DetailStack
                records={livePayload?.live.training}
                fallback={trade.nextSteps.map((item) => ({ title: item, text: `${selectedCity}, ${region.code}` }))}
                type="school"
              />
            </article>
          </section>

          <section className="grid grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] gap-3 max-[980px]:grid-cols-1">
            <article className="border border-[#d8e0e7] bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Category Fit Quiz</h3>
                <span className="text-sm text-[#5e6b78]">{trade.category}</span>
              </div>
              <div className="grid gap-4">
                {categoryGuide.quiz.map((question) => (
                  <fieldset className="grid gap-2 border border-[#d8e0e7] bg-[#f7f9fb] p-3" key={question.id}>
                    <legend className="font-semibold">{question.question}</legend>
                    <div className="grid gap-2">
                      {question.options.map((option) => (
                        <label className="flex min-h-11 items-center gap-3 rounded-md border border-[#d8e0e7] bg-white px-3 text-sm" key={option.label}>
                          <input
                            checked={quizAnswers[question.id] === option.score}
                            name={question.id}
                            onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: option.score }))}
                            type="radio"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <div className="mt-4 border-l-4 border-[#237455] bg-[#f1fbf6] p-3">
                <strong className="block">Quiz guidance</strong>
                <span className="mt-1 block text-sm leading-6 text-[#314354]">{quizResult}</span>
              </div>
            </article>

            <aside className="grid gap-3">
              <section className="border border-[#d8e0e7] bg-white p-4">
                <h3 className="mb-3 text-lg font-bold">Video References</h3>
                <p className="mb-3 text-sm leading-6 text-[#5e6b78]">
                  These links open YouTube searches instead of hand-picked claims. Prefer official schools, unions, employers, and workers showing ordinary day-to-day tasks.
                </p>
                <div className="grid gap-2">
                  {[
                    [`${trade.title} day in the life`, "Day-in-the-life videos"],
                    [`${trade.title} apprenticeship training`, "Training and apprenticeship videos"],
                    [`${trade.title} pros cons real work`, "Reality-check videos"],
                  ].map(([search, label]) => (
                    <a
                      className="rounded-md border border-[#d8e0e7] bg-[#f7f9fb] px-3 py-2 text-sm font-semibold text-[#205b91]"
                      href={youtubeSearchUrl(search)}
                      key={search}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </section>

              <section className="border border-[#d8e0e7] bg-white p-4">
                <h3 className="mb-3 text-lg font-bold">Fact Check Sources</h3>
                <ul className="grid gap-2 text-sm leading-6 text-[#314354]">
                  <li>BLS and CareerOneStop for wage and labor-market data.</li>
                  <li>O*NET and CareerOneStop for job tasks and occupation details.</li>
                  <li>State licensing boards for license rules, exams, and legal scope.</li>
                  <li>Schools and apprenticeship sponsors for cost, length, placement, and completion requirements.</li>
                </ul>
              </section>
            </aside>
          </section>

          <section className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
            <article className="border border-[#d8e0e7] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">What Actually Happens In The Field</h3>
              <ul className="list-disc space-y-2 pl-5 leading-7 text-[#314354]">
                {categoryGuide.reality.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="border border-[#d8e0e7] bg-white p-4">
              <h3 className="mb-3 text-lg font-bold">Path From Worker To Business Owner</h3>
              <ol className="list-decimal space-y-2 pl-5 leading-7 text-[#314354]">
                {categoryGuide.businessPath.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </section>

          {plan ? (
            <section className="border border-[#d8e0e7] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold">Career Plan</h3>
                <span className="text-xs text-[#5e6b78]">{planSource}</span>
              </div>
              <pre className="whitespace-pre-wrap font-sans leading-7 text-[#314354]">{plan}</pre>
            </section>
          ) : null}

          <section className="border border-[#d8e0e7] bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Trade Directory</h3>
              <span className="text-sm text-[#5e6b78]">{filteredTrades.length} trades in the launch catalog</span>
            </div>
            {officialResults.length ? (
              <div className="mb-4 grid gap-3 border border-[#d8e0e7] bg-[#f7f9fb] p-4">
                <h4 className="font-bold">Official CareerOneStop Search Results</h4>
                <div className="grid gap-2">
                  {officialResults.slice(0, 8).map((item) => (
                    <div className="border border-[#d8e0e7] bg-white p-3" key={`${item.title}-${item.code}`}>
                      <strong className="block">{item.title || "Occupation"}</strong>
                      <span className="text-sm text-[#5e6b78]">{item.code || "No code returned"}</span>
                      {item.description ? <p className="mt-1 text-sm leading-6 text-[#314354]">{item.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-3 gap-3 max-[1180px]:grid-cols-2 max-[760px]:grid-cols-1">
              {filteredTrades.map((item) => (
                <button
                  className={`grid min-h-44 gap-2 border p-4 text-left ${item.id === trade.id ? "border-[#205b91] ring-1 ring-[#205b91]" : "border-[#d8e0e7]"}`}
                  key={item.id}
                  onClick={() => selectTrade(item.id)}
                  type="button"
                >
                  <strong>{item.title}</strong>
                  <p className="text-sm leading-6 text-[#5e6b78]">{item.summary}</p>
                  <div className="mt-auto flex justify-between gap-3 text-xs text-[#5e6b78]">
                    <span>{item.subcategory}</span>
                    <span>{formatMoney(item.nationalMedian)} national median</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d8e0e7] pt-4 text-sm text-[#5e6b78]">
            <span>TradePath Finder uses official sources where connected and clearly labels planning estimates.</span>
            <nav className="flex flex-wrap gap-4" aria-label="Site links">
              <Link className="font-semibold text-[#205b91]" href="/about">About</Link>
              <Link className="font-semibold text-[#205b91]" href="/methodology">Methodology</Link>
              <Link className="font-semibold text-[#205b91]" href="/privacy">Privacy</Link>
              <Link className="font-semibold text-[#205b91]" href="/terms">Terms</Link>
              <Link className="font-semibold text-[#205b91]" href="/contact">Contact</Link>
            </nav>
          </footer>
        </section>
      </div>
    </main>
  );
}
