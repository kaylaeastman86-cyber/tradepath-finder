import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "TradePath Finder wage and licensing disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <SitePage title="Disclaimer">
      <p>
        TradePath Finder is an informational career research tool. It does not issue licenses, certify eligibility,
        guarantee admission to a school, guarantee employment, or guarantee wages.
      </p>
      <p>
        License rules can vary by state, city, county, board, employer, and specialty. Users should verify requirements
        directly with the responsible licensing board, school, apprenticeship sponsor, or employer before paying fees or
        enrolling.
      </p>
    </SitePage>
  );
}
