# Accurate API documentation

The documentation of the Accurate shipping API, published with GitHub Pages from the `docs/` folder:
**https://accuratess.github.io/lg-api/**

## What's here

| Path | What it is |
|---|---|
| `pages/*.md` | The guide, one file per section, in file-name order |
| `schema.gql` | The API's public schema: the API reference is generated from it |
| `src/` | The page template, styles and script |
| `assets/` | Logo and icon |
| `build.mjs` | Builds the site into `docs/` |
| `docs/` | The built website (generated: don't edit by hand) |

## Edit and publish

```bash
npm install      # once
npm run build    # writes docs/
```

Commit everything, including `docs/`, and push: GitHub Pages publishes it.

## Writing pages

Plain Markdown, plus:

- A code block's title: ` ```json title=Variables `
- Tabs (one tab per code block):

  ````md
  :::tabs
  ```graphql title=Query
  …
  ```
  ```json title=Variables
  …
  ```
  :::
  ````

- Numbered step cards: `:::steps` around a numbered list, closed by `:::`
- A tip box: `:::tip` … `:::`

Link to a section with `#its-title` (e.g. `#create-a-shipment`), to an operation with `#op-saveShipment`, to a type with `#type-ShipmentInput`.
