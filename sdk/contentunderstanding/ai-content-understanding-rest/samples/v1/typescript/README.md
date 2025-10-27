
---
page_type: sample
languages:
  - typescript
products:
  - azure
  - azure-ai-content-understanding
urlFragment: ai-content-understanding-rest-typescript
---

# Azure AI Content Understanding REST client library samples for TypeScript

These sample programs show how to use the TypeScript client libraries for Azure AI Content Understanding REST in common scenarios.

| **File Name**                        | **Description**                                                        |
| ------------------------------------- | ---------------------------------------------------------------------- |
| [contentAnalyzersAnalyzeBinary.ts](src/contentAnalyzersAnalyzeBinary.ts) | Analyze a PDF using the prebuilt-documentAnalyzer.                     |

## Prerequisites


## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy `sample.env` to `.env` and fill in your endpoint/key:
   ```bash
   cp sample.env .env
   # Edit .env to add your values
   ```
3. Build the samples:
   ```bash
   pnpm run build
   ```
4. Run the sample:
    ```bash
    node dist/contentAnalyzersAnalyzeBinary.js
    ```

## Running with Published Packages

If you want to use the published NPM packages directly:

```bash
npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv typescript
npx tsc
node dist/contentAnalyzersAnalyzeBinary.js
```

## Notes

- The sample uses `DefaultAzureCredential` if `AZURE_CONTENT_UNDERSTANDING_KEY` is not set.
- The sample demonstrates a simple polling loop using the SDK's poller helper.

## Next Steps

- [API Reference](https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding)
- [Package README](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md)
- For JavaScript samples, see the [`javascript/`](../javascript) folder.

---
