import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outputPath = path.join(rootDir, "src", "data", "weekly-source-check.json");
const execFileAsync = promisify(execFile);

const sources = [
  {
    id: "bls-oews-release",
    name: "BLS OEWS release metadata",
    url: "https://download.bls.gov/pub/time.series/oe/oe.release",
    purpose: "Machine-readable OEWS release version check.",
  },
  {
    id: "bls-oews-occupations",
    name: "BLS OEWS occupation metadata",
    url: "https://download.bls.gov/pub/time.series/oe/oe.occupation",
    purpose: "Machine-readable occupation-code metadata used before wage parsing.",
  },
  {
    id: "onet-database",
    name: "O*NET database release",
    url: "https://www.onetcenter.org/database.html",
    purpose: "Official occupation tasks, skills, education, work context, and database release checks.",
  },
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0",
    },
  });
  const text = await response.text();
  if (response.status === 403) {
    const curlResult = await fetchTextWithCurl(url).catch(() => null);
    if (curlResult) return curlResult;
  }
  return {
    ok: response.ok,
    status: response.status,
    finalUrl: response.url,
    lastModified: response.headers.get("last-modified"),
    etag: response.headers.get("etag"),
    text,
  };
}

async function fetchTextWithCurl(url) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "--location",
      "--silent",
      "--show-error",
      "--max-time",
      "30",
      "--user-agent",
      "Mozilla/5.0",
      "--write-out",
      "\n__HTTP_STATUS__:%{http_code}\n__FINAL_URL__:%{url_effective}\n",
      url,
    ],
    { maxBuffer: 15 * 1024 * 1024 },
  );
  const statusMatch = stdout.match(/\n__HTTP_STATUS__:(\d+)/);
  const finalUrlMatch = stdout.match(/\n__FINAL_URL__:(.+)\n?$/);
  const text = stdout.replace(/\n__HTTP_STATUS__:\d+\n__FINAL_URL__:.+\n?$/s, "");
  const status = statusMatch ? Number(statusMatch[1]) : 0;
  return {
    ok: status >= 200 && status < 300,
    status,
    finalUrl: finalUrlMatch?.[1]?.trim() || url,
    lastModified: null,
    etag: null,
    text,
  };
}

function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractBlsRelease(text) {
  const lines = text.trim().split(/\r?\n/);
  const latest = lines[1]?.split(/\t/);
  return {
    latestReleaseCode: latest?.[0] || null,
    latestReleaseDescription: latest?.[1] || null,
    rows: Math.max(lines.length - 1, 0),
    note: "OEWS release metadata is checked from BLS machine-readable text files.",
  };
}

function extractBlsOccupations(text) {
  const lines = text.trim().split(/\r?\n/);
  const sample = lines.slice(1, 6).map((line) => {
    const [occupationCode, occupationText, displayLevel, selectable, sortSequence] = line.split(/\t/);
    return { occupationCode, occupationText, displayLevel, selectable, sortSequence };
  });
  return {
    rows: Math.max(lines.length - 1, 0),
    sample,
    note: "Occupation metadata is reachable; wage parsing should map TradePath trades to these SOC-style occupation codes.",
  };
}

function extractOnet(text) {
  const release = text.match(/O\*NET(?:®)?\s+([\d.]+)\s+Database/i)?.[0] || null;
  const highlights = text.match(/Highlights of the O\*NET[^#]+/i)?.[0] || "";
  const quarterly = /quarterly/i.test(text);
  return {
    release,
    updatedQuarterlyMentioned: quarterly,
    highlights: compactWhitespace(highlights).slice(0, 450),
    note: "O*NET is the occupation detail source for tasks, skills, work context, education, and interests.",
  };
}

async function buildOllamaSummary(records) {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.OLLAMA_API_KEY ? { authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1",
        stream: false,
        messages: [
          {
            role: "user",
            content: [
              "Summarize this weekly source audit for a trade-career website.",
              "Be concise. Do not invent data. Mention whether BLS and O*NET source pages were reachable.",
              JSON.stringify(records, null, 2),
            ].join("\n"),
          },
        ],
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.message?.content || data.response || null;
  } catch {
    return null;
  }
}

async function run() {
  const previous = await readFile(outputPath, "utf8")
    .then((text) => JSON.parse(text))
    .catch(() => null);

  const checkedAt = new Date().toISOString();
  const records = [];

  for (const source of sources) {
    try {
      const result = await fetchText(source.url);
      let extracted = {};
      if (source.id === "bls-oews-release") extracted = extractBlsRelease(result.text);
      if (source.id === "bls-oews-occupations") extracted = extractBlsOccupations(result.text);
      if (source.id === "onet-database") extracted = extractOnet(result.text);

      records.push({
        ...source,
        ok: result.ok,
        status: result.status,
        finalUrl: result.finalUrl,
        lastModifiedHeader: result.lastModified,
        etag: result.etag,
        extracted,
      });
    } catch (error) {
      records.push({
        ...source,
        ok: false,
        status: null,
        error: error instanceof Error ? error.message : "Unknown source check failure",
      });
    }
  }

  const ollamaSummary = await buildOllamaSummary(records);
  const payload = {
    checkedAt,
    schedule: "Sundays at 1:00 PM UTC via GitHub Actions, which is 9:00 AM Eastern during daylight time",
    status: records.every((record) => record.ok) ? "ok" : "needs-review",
    summary:
      ollamaSummary ||
      "Weekly source check completed. BLS and O*NET release pages are tracked here; deeper salary parsing should use BLS OEWS downloadable data instead of AI-generated wages.",
    previousCheckedAt: previous?.checkedAt || null,
    sources: records,
    nextSteps: [
      "Parse BLS OEWS current data into state and metro wage snapshots for mapped SOC codes.",
      "Import O*NET task and work-context files for mapped O*NET-SOC codes.",
      "Add reviewed state licensing board source links before publishing state-specific license claims.",
    ],
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Weekly source check written to ${path.relative(rootDir, outputPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
