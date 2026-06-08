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

type Props = {
  initialTrades: Trade[];
  initialStates: StateOption[];
  categories: string[];
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

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

export function TradePathApp({ initialTrades, initialStates, categories }: Props) {
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
  const [loading, setLoading] = useState<"live" | "plan" | null>(null);

  const trade = initialTrades.find((item) => item.id === selectedTradeId) || initialTrades[0];
  const region = initialStates.find((item) => item.code === selectedState) || initialStates[0];
  const wage = livePayload?.wage || estimateWage(trade, region, selectedCity);

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
  }

  function selectState(code: string) {
    const next = initialStates.find((item) => item.code === code);
    setSelectedState(code);
    setSelectedCity(next?.cities[0] || "");
    setLivePayload(null);
  }

  const taskList = livePayload?.live.tasks?.length ? livePayload.live.tasks : trade.duties;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1500px] p-4 text-[#17212b]">
      <div className="grid min-h-[calc(100vh-2rem)] grid-cols-[340px_minmax(0,1fr)] border border-[#d8e0e7] bg-white shadow-[0_18px_45px_rgba(21,33,45,0.12)] max-[1120px]:grid-cols-1">
        <aside className="flex flex-col gap-5 border-r border-[#d8e0e7] bg-[#fbfcfd] p-6 max-[1120px]:border-b max-[1120px]:border-r-0">
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
          </div>
        </aside>

        <section className="grid gap-5 bg-gradient-to-b from-white to-[#f6f8fa] p-6">
          <section className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[#d8e0e7] pb-5 max-[760px]:grid-cols-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-[#205b91]">
                {trade.category} | {trade.subcategory} {trade.soc ? `| ${trade.soc}` : ""}
              </p>
              <h2 className="mt-1 text-4xl font-bold leading-tight tracking-normal max-[760px]:text-3xl">{trade.title}</h2>
              <p className="mt-3 max-w-4xl leading-7 text-[#354656]">{livePayload?.live.description || trade.summary}</p>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-2">
              <button className="min-h-11 rounded-md bg-[#237455] px-4 font-bold text-white disabled:opacity-70" disabled={loading === "live"} onClick={refreshLive} type="button">
                {loading === "live" ? "Refreshing" : "Refresh official data"}
              </button>
              <button className="min-h-11 rounded-md border border-[#d8e0e7] bg-white px-4 font-bold disabled:opacity-70" disabled={loading === "plan"} onClick={buildPlan} type="button">
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
