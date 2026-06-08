import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How TradePath Finder sources wages, job duties, licensing, certifications, and training data.",
};

export default function MethodologyPage() {
  return (
    <SitePage title="Methodology">
      <p>
        TradePath Finder uses a curated launch catalog for immediate browsing and server-side API routes for official
        CareerOneStop data. When CareerOneStop credentials are configured, the app requests occupation details, wages,
        licenses, certifications, and local training programs.
      </p>
      <p>
        Wage data is shown as official CareerOneStop/BLS data when available. Otherwise, the page displays a clearly
        labeled planning estimate based on seeded national medians and local adjustment factors.
      </p>
      <ul>
        <li>BLS OEWS wage tables: https://www.bls.gov/oes/tables.htm</li>
        <li>CareerOneStop API Explorer: https://api.careeronestop.org/api-explorer/</li>
        <li>O*NET OnLine: https://www.onetonline.org/</li>
      </ul>
    </SitePage>
  );
}
