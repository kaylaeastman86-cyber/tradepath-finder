import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "About",
  description: "About TradePath Finder and its trade career guidance mission.",
};

export default function AboutPage() {
  return (
    <SitePage title="About TradePath Finder">
      <p>
        TradePath Finder helps people compare trade careers by job duties, wage range, training path, licensing checks,
        certifications, and school or apprenticeship options by location.
      </p>
      <p>
        The site is built to combine a curated launch catalog with official data from CareerOneStop, BLS, and O*NET when
        API credentials are configured. Planning estimates are labeled so users can distinguish them from official wage
        records.
      </p>
    </SitePage>
  );
}
