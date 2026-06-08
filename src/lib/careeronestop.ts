import { estimateWage, findState, findTrade, type Trade } from "./catalog";

type ApiResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; skipped?: true; status?: number; reason: string; data?: unknown };

const API_BASE = "https://api.careeronestop.org";

function getCredentials() {
  return {
    token: process.env.CAREERONESTOP_TOKEN || "",
    userId: process.env.CAREERONESTOP_USER_ID || "",
  };
}

export function hasCareerOneStopCredentials() {
  const { token, userId } = getCredentials();
  return Boolean(token && userId);
}

async function careerOneStopRequest<T>(pathname: string, query: Record<string, string> = {}): Promise<ApiResult<T>> {
  const { token, userId } = getCredentials();
  if (!token || !userId) {
    return { ok: false, skipped: true, reason: "CAREERONESTOP_TOKEN and CAREERONESTOP_USER_ID are not configured." };
  }

  const url = new URL(`${API_BASE}${pathname.replace("{userId}", encodeURIComponent(userId))}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  const text = await response.text();
  let data: unknown = text;
  try {
    data = JSON.parse(text);
  } catch {
    // Some CareerOneStop errors are not JSON.
  }

  if (!response.ok) {
    return { ok: false, status: response.status, reason: `CareerOneStop returned ${response.status}`, data };
  }

  return { ok: true, data: data as T };
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const parsed = Number(String(value).replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function arrayOf<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function searchOccupations(keyword: string) {
  if (!keyword.trim()) return { connected: hasCareerOneStopCredentials(), records: [] };

  const response = await careerOneStopRequest<Record<string, unknown>>(
    `/v1/occupation/{userId}/${encodeURIComponent(keyword)}/N/0/25`,
    {
      datasettype: "onet",
      searchby: "default",
    },
  );

  if (!response.ok) {
    return { connected: false, records: [], reason: response.reason };
  }

  const data = response.data;
  const records = arrayOf<Record<string, unknown>>(data.OccupationList || data.Occupations || data.SearchResults).map((item) => ({
    title: String(item.OnetTitle || item.Title || item.OccupationTitle || item.Name || ""),
    code: String(item.OnetCode || item.Code || item.OccupationCode || ""),
    description: String(item.Description || item.OnetDescription || ""),
  }));

  return { connected: true, records };
}

export async function getCareerDetails(params: { tradeId: string; stateCode: string; city: string }) {
  const trade = findTrade(params.tradeId);
  const state = findState(params.stateCode);
  const city = params.city || state.cities[0];
  const location = city ? `${city}, ${state.code}` : state.code;
  const keyword = trade.onet || trade.title;
  const fallbackWage = estimateWage(trade, state, city);

  const [occupation, salary, licenses, certifications, training] = await Promise.all([
    careerOneStopRequest<Record<string, unknown>>(`/v1/occupation/{userId}/${encodeURIComponent(keyword)}/${encodeURIComponent(location)}`, {
      wages: "true",
      tasks: "true",
      training: "true",
      skills: "true",
      projectedEmployment: "true",
      stateLMILinks: "true",
      trainingPrograms: "true",
      toolsAndTechnology: "true",
      enableMetaData: "true",
    }),
    careerOneStopRequest<Record<string, unknown>>("/v1/comparesalaries/{userId}/wage", {
      keyword,
      location,
      enableMetaData: "true",
    }),
    careerOneStopRequest<Record<string, unknown>>(`/v1/license/{userId}/${encodeURIComponent(keyword)}/${encodeURIComponent(state.code)}/0/0/0/10`),
    careerOneStopRequest<Record<string, unknown>>(`/v1/certificationfinder/{userId}/${encodeURIComponent(keyword)}/0/0/0/0/0/0/0/0/0/10`),
    careerOneStopRequest<Record<string, unknown>>(
      `/v2/training/programs/{userId}/${encodeURIComponent(keyword)}/${encodeURIComponent(location)}/50/0/0/0/0/0/N/0/0/0/0/10`,
      { enableMetaData: "true" },
    ),
  ]);

  const occupationDetail = occupation.ok ? arrayOf<Record<string, unknown>>(occupation.data.OccupationDetail)[0] : null;
  const salaryDetail = salary.ok ? (salary.data.OccupationDetail as Record<string, unknown> | undefined) : null;
  const wageSource = (salaryDetail?.Wages || occupationDetail?.Wages) as Record<string, unknown> | undefined;
  const areaWage =
    arrayOf<Record<string, unknown>>(wageSource?.BLSAreaWagesList)[0] ||
    arrayOf<Record<string, unknown>>(wageSource?.StateWagesList)[0] ||
    arrayOf<Record<string, unknown>>(wageSource?.NationalWagesList)[0];

  const officialWage = areaWage
    ? {
        source: "CareerOneStop / BLS",
        year: String(wageSource?.WageYear || "Official wage data"),
        area: String(areaWage.AreaName || location),
        low: toNumber(areaWage.Pct25) || fallbackWage.low,
        median: toNumber(areaWage.Median) || fallbackWage.median,
        high: toNumber(areaWage.Pct75) || fallbackWage.high,
      }
    : null;

  return {
    trade,
    state,
    city,
    wage: officialWage || fallbackWage,
    fallbackWage,
    live: {
      connected: [occupation, salary, licenses, certifications, training].some((result) => result.ok),
      occupation: occupationDetail,
      description: String(occupationDetail?.OnetDescription || ""),
      tasks: arrayOf<string>(occupationDetail?.Tasks).filter(Boolean).slice(0, 12),
      tools: arrayOf<Record<string, unknown>>(occupationDetail?.ToolsAndTechnology).slice(0, 10),
      licenses: licenses.ok ? arrayOf<Record<string, unknown>>(licenses.data.LicenseList).slice(0, 10) : [],
      certifications: certifications.ok ? arrayOf<Record<string, unknown>>(certifications.data.CertList).slice(0, 10) : [],
      training:
        (training.ok ? arrayOf<Record<string, unknown>>(training.data.SchoolPrograms).slice(0, 10) : []) ||
        arrayOf<Record<string, unknown>>(occupationDetail?.TrainingPrograms).slice(0, 10),
      errors: {
        occupation: occupation.ok ? null : occupation.reason,
        salary: salary.ok ? null : salary.reason,
        licenses: licenses.ok ? null : licenses.reason,
        certifications: certifications.ok ? null : certifications.reason,
        training: training.ok ? null : training.reason,
      },
    },
  };
}

export function buildFallbackPlan(trade: Trade, location: string, median: number) {
  return [
    `This week: verify the ${trade.title} requirements for ${location} through the state licensing board or local workforce office before paying for a program.`,
    `Training path: ${trade.training.join(" ")}`,
    `Credentials to check: ${trade.credentials.join("; ")}.`,
    `School search: compare apprenticeships, community colleges, union training centers, employer-sponsored programs, and CareerOneStop training results. Ask each program about total cost, length, placement rate, exam pass rate, and whether it satisfies state licensing requirements.`,
    `Wage reality check: the current displayed median is ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(median)}. Treat it as a planning figure unless the wage source says CareerOneStop / BLS.`,
  ].join("\n\n");
}
