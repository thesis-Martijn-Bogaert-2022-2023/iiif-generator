# IIIF Generator
This is but a proof of concept, showing how a IIIF Manifest can be built using the results of a SPARQL query.

## Installation
1. Clone the repository and navigate to its root.
2. Run:
   ```bash
   yarn install
   ```

## Usage
Follow these steps to have the app create a IIIF Manifest in the project's root, based on the queries present in `querying.ts`:
1. Run:
   ```bash
   yarn build
   ```
2. Run:
   ```bash
   node dist/index.js
   ```
