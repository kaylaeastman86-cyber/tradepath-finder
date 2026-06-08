import type { Metadata } from "next";
import { SitePage } from "../site-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact TradePath Finder.",
};

export default function ContactPage() {
  return (
    <SitePage title="Contact">
      <p>
        For corrections, partnership requests, or school/provider updates, contact the TradePath Finder owner at the email
        address configured for the production site.
      </p>
      <p>
        Before launch, replace this placeholder with a monitored business email, contact form, or support mailbox. AdSense
        review expects contact information to be easy for visitors to find.
      </p>
    </SitePage>
  );
}
