import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "TradePath Finder terms of use.",
};

export default function TermsPage() {
  return (
    <SitePage title="Terms of Use">
      <p>
        TradePath Finder provides informational career research content. Users are responsible for verifying wage,
        licensing, school, apprenticeship, and certification details with official agencies and providers.
      </p>
      <p>
        Users may not misuse the site, attempt to disrupt service, scrape at abusive rates, or represent planning
        estimates as guaranteed wages or official licensing decisions.
      </p>
      <p>
        Before launch, replace this general template with terms reviewed for the business entity that will own and operate
        the website.
      </p>
    </SitePage>
  );
}
