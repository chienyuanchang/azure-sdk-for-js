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

These sample programs show how to use the TypeScript client libraries for Azure AI Content Understanding REST in some common scenarios.

| File Name                                                        | Description                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [analyzeBinary.ts](src/analyzeBinary.ts)                         | Analyze a PDF using the prebuilt-documentAnalyzer.                                                                  |
| [analyzeBinaryRawJson.ts](src/analyzeBinaryRawJson.ts)           | Analyze a PDF using the prebuilt-documentAnalyzer and save the raw JSON response (for demonstration purposes only). |
| [analyzeUrl.ts](src/analyzeUrl.ts)                               | Analyze a document from a URL using the prebuilt-documentAnalyzer.                                                  |
| [analyzeUrlPrebuiltInvoice.ts](src/analyzeUrlPrebuiltInvoice.ts) | Analyze an invoice from a URL using the prebuilt-invoice analyzer and extract structured fields.                    |
| [createOrReplaceAnalyzer.ts](src/createOrReplaceAnalyzer.ts)     | Create a custom analyzer with field schema, use it to analyze a document, and clean up.                             |
| [deleteAnalyzer.ts](src/deleteAnalyzer.ts)                       | Delete a custom analyzer using the Delete API.                                                                      |
| [getAnalyzer.ts](src/getAnalyzer.ts)                             | Retrieve an analyzer using the Get API and display its properties.                                                  |
| [getResultFile.ts](src/getResultFile.ts)                         | Get result files (like keyframe images) from a video analysis operation.                                            |
| [listAnalyzers.ts](src/listAnalyzers.ts)                         | List all available analyzers and display their properties.                                                          |
| [updateAnalyzer.ts](src/updateAnalyzer.ts)                       | Update a custom analyzer with new description and tags using the Update API.                                        |

## Prerequisites

The sample programs are compatible with LTS versions of Node.js.

You need an Azure subscription and an Azure AI Content Understanding resource.

Samples retrieve credentials to access the service endpoint from environment variables. Alternatively, edit the source code to include the appropriate credentials. See the sample for details on which environment variables it requires to function.

## Setup

To run the samples using the published version of the package:

1. Install the dependencies using npm:

```bash
npm install
```

2. Compile the samples:

```bash
npm run build
```

3. Edit the file `sample.env`, adding the correct credentials to access the Azure service and run the samples. Then rename the file from `sample.env` to just `.env`. The sample program will read this file automatically.

4. Run the sample:

```bash
node dist/analyzeBinary.js
```

Alternatively, run a single sample with the correct environment variables set (setting up the `.env` file is not required if you do this), for example:

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/analyzeBinary.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/analyzeUrl.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/analyzeUrlPrebuiltInvoice.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/createOrReplaceAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/deleteAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/getAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/getResultFile.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/listAnalyzers.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node dist/updateAnalyzer.js
```

## Next Steps

Take a look at our API documentation for more information about the APIs that are available in the client.

- API Reference: https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding
- Package README: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md

For JavaScript samples, see the `javascript/` folder next to this directory.
