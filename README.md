# TradePath Finder

TradePath Finder is a production-ready Next.js site for exploring trade careers by state and city. It includes a curated launch catalog plus server-side integrations for official CareerOneStop data when API credentials are configured.

## What The Site Does

- Browse trade careers by category and subcategory.
- Filter by state and type any city.
- Show wage ranges, job duties, training path, licenses, certifications, and schools/programs.
- Clearly labels planning estimates vs. official CareerOneStop/BLS wage data.
- Keeps CareerOneStop and Ollama credentials server-side.
- Includes AdSense-ready trust pages, reserved ad placements, `robots.txt`, `sitemap.xml`, and `ads.txt`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. In Vercel, add these under Project Settings > Environment Variables.

```bash
CAREERONESTOP_TOKEN=
CAREERONESTOP_USER_ID=
OLLAMA_BASE_URL=
OLLAMA_API_KEY=
OLLAMA_MODEL=llama3.1
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## CareerOneStop API Setup

CareerOneStop requires a Web API registration. Their API docs say requests require a bearer token and user ID. The app is already wired for:

- Occupation details: `/v1/occupation/{userId}/{keyword}/{location}`
- Salary details: `/v1/comparesalaries/{userId}/wage`
- Licenses: `/v1/license/{userId}/{keyword}/{location}/{sortColumns}/{sortDirections}/{startRecord}/{limitRecord}`
- Certifications: `/v1/certificationfinder/{userId}/{keyword}/...`
- Training programs: `/v2/training/programs/{userId}/...`

Request access here:

- Web API overview: https://www.careeronestop.org/Developers/WebAPI/web-api.aspx
- API Explorer: https://api.careeronestop.org/api-explorer/

Once CareerOneStop issues the token and user ID, add them to Vercel as `CAREERONESTOP_TOKEN` and `CAREERONESTOP_USER_ID`, then redeploy.

## Ollama Setup

For Vercel, use a reachable Ollama-compatible HTTPS endpoint, not a local `localhost` URL. Set:

- `OLLAMA_BASE_URL`
- `OLLAMA_API_KEY` if the endpoint requires auth
- `OLLAMA_MODEL`

If Ollama is not configured, the site returns a practical fallback plan from the app data.

## AdSense Readiness

The app includes the structure Google reviewers usually expect:

- Original career guidance content on the homepage.
- Clear navigation and non-deceptive ad placements.
- Privacy, Terms, About, Contact, Methodology, and Disclaimer pages.
- `ads.txt` placeholder.
- AdSense script only loads when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.

Before applying to AdSense:

- Replace placeholder Contact text with a monitored business email or contact form.
- Update Privacy and Terms with the legal owner/business details.
- Set `NEXT_PUBLIC_SITE_URL` to the final domain.
- Replace `public/ads.txt` with the exact publisher line from AdSense.
- Do not place more ads than content, and do not label ads as anything other than advertising.

## Official Sources

- BLS OEWS wage tables: https://www.bls.gov/oes/tables.htm
- CareerOneStop API Explorer: https://api.careeronestop.org/api-explorer/
- O*NET OnLine: https://www.onetonline.org/
- Google AdSense Program Policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938

## Deployment

This project is ready for GitHub-backed Vercel deployment. Connect the GitHub repo to Vercel, add the environment variables above, and deploy the `main` branch.

Checks used:

```bash
npm run lint
npm run build
npm audit
```
