# Accurate API documentation

The documentation of the Accurate shipping API, in English and Arabic, published with GitHub Pages from the `docs/` folder:
**https://accuratess.github.io/lg-api/**

## What's here

| Path | What it is |
|---|---|
| `pages/en/*.md`, `pages/ar/*.md` | The guide: getting started, authentication, shipments, webhooks, codes, errors, what changed |
| `schema.gql` | The API's public schema: the reference part of the site is generated from it |
| `magidoc.mjs` | The site's configuration (menu titles, site root) |
| `assets/` | Logos |
| `docs/` | The built website (generated: don't edit by hand) |

## Edit and publish

1. Edit the pages in `pages/en` and `pages/ar` (keep both languages in step), or update `schema.gql`.
2. Rebuild the site:

   ```bash
   npx @magidoc/cli@6.4.5 generate
   ```

3. Commit everything, including `docs/`, and push: GitHub Pages publishes it.

Pages are ordered by their file name (`01-…`, `02-…`). Their menu titles are in `magidoc.mjs`; Arabic pages keep English menu titles because Magidoc can't serve pages with Arabic URLs, and show their Arabic title as the page heading.
