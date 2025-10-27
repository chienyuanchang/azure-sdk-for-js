---
page_type: sample
languages:
  - javascript
products:
  - azure
  - azure-ai-content-understanding
urlFragment: ai-content-understanding-rest-javascript
---

# Azure AI Content Understanding REST client library samples for JavaScript

These sample programs show how to use the JavaScript client libraries for Azure AI Content Understanding REST in common scenarios.

| **File Name**                                                                      | **Description**                                                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [contentAnalyzersAnalyzeBinary.js](contentAnalyzersAnalyzeBinary.js)               | Analyze a PDF using the prebuilt-documentAnalyzer.                                      |
| [contentAnalyzersAnalyzeBinaryRawJson.js](contentAnalyzersAnalyzeBinaryRawJson.js) | Analyze a PDF using the prebuilt-documentAnalyzer and save raw JSON response to a file. |

## Prerequisites

- [Node.js LTS](https://github.com/nodejs/release#release-schedule)
- An [Azure subscription](https://azure.microsoft.com/free/)
- An [Azure AI Content Understanding resource](https://learn.microsoft.com/azure/ai-services/content-understanding/)

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
3. Run the sample:
   ```bash
   node contentAnalyzersAnalyzeBinary.js
   ```

## Running with Published Packages

If you want to use the published NPM packages directly:

```bash
npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
node contentAnalyzersAnalyzeBinary.js
```

## Notes

- The sample uses `DefaultAzureCredential` if `AZURE_CONTENT_UNDERSTANDING_KEY` is not set.
- The sample demonstrates a simple polling loop using the SDK's poller helper.

## Next Steps

- [API Reference](https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding)
- [Package README](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md)
- For TypeScript samples, see the [`typescript/`](../typescript) folder.

---
