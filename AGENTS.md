# AGENTS.md

## Repo shape

- Static site with no `package.json`, build, test, lint, or codegen. Files deploy as written; do not add a build step just to edit content.
- `index.html` is self-contained: inline CSS, inline JS, and JSON-LD in `<head>`.
- Case study pages live under `case_studies/` and share `_shared/case-study.css` and `_shared/case-study.js`.
- Preview from the repo root: `python3 -m http.server 8000`, then open `http://localhost:8000/`.

## Editing rules

- Keep the visible `#faq` text and JSON-LD `FAQPage` text verbatim in sync. Edit both together.
- Do not use em dashes in site copy, including HTML entity forms. Use commas, periods, or parentheses.
- Avoid real estate jargon and estate-agent framing. Use plain terms such as "house", "home", "architecture" and "place".
- Keep the primary CTA as "Start a Film".
- Canonical domain is `https://www.zippitymedialab.com`. Keep canonical, Open Graph, Twitter, JSON-LD IDs and sitemap URLs on that host.
- Every content image needs descriptive alt text. Keep hero images eager and lazy-load images below the fold.
- After editing shared case-study CSS or JS, bump the matching `?v=` query string in every case study page that loads it.
- Case study "Download all files" buttons are illustrative placeholders. `**/download/` is gitignored, so those local assets are not deployed.

## Forms and deployment

- Homepage enquiries post directly to Web3Forms from inline JS. `contact.php` and `inquiries.txt` are gitignored legacy files and are not deployed; do not edit `contact.php` expecting live behaviour.
- Production is Cloudflare Pages from `main` on `git@github.com:igor-olejar/zippity_media_lab.git`. Local edits are not live until committed and pushed.
