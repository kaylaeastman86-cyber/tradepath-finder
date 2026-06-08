import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TradePath Finder privacy policy.",
};

export default function PrivacyPage() {
  return (
    <SitePage title="Privacy Policy">
      <p>
        TradePath Finder does not require visitors to create an account to browse trade career information. The app may
        process search terms, selected state, selected city, and selected trade to return career information.
      </p>
      <p>
        If advertising, analytics, or embedded third-party services are enabled, those providers may use cookies, web
        beacons, IP addresses, or similar identifiers to deliver, measure, and improve services. Google requires publishers
        to disclose that third parties may place and read cookies or use web beacons as a result of ad serving.
      </p>
      <p>
        Before production launch, update this page with the business owner name, contact email, analytics tools, ad
        networks, cookie consent approach, and any region-specific privacy disclosures.
      </p>
    </SitePage>
  );
}
