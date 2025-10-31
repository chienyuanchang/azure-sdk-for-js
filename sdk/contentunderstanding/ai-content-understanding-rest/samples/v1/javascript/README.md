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

| File Name                                                    | Description                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [analyzeBinary.js](analyzeBinary.js)                         | Analyze a PDF using the prebuilt-documentAnalyzer.                                                                  |
| [analyzeBinaryRawJson.js](analyzeBinaryRawJson.js)           | Analyze a PDF using the prebuilt-documentAnalyzer and save the raw JSON response (for demonstration purposes only). |
| [analyzeUrl.js](analyzeUrl.js)                               | Analyze a document from a URL using the prebuilt-documentAnalyzer.                                                  |
| [analyzeUrlPrebuiltInvoice.js](analyzeUrlPrebuiltInvoice.js) | Analyze an invoice from a URL using the prebuilt-invoice analyzer and extract structured fields.                    |
| [createOrReplaceAnalyzer.js](createOrReplaceAnalyzer.js)     | Create a custom analyzer with field schema, use it to analyze a document, and clean up.                             |
| [deleteAnalyzer.js](deleteAnalyzer.js)                       | Delete a custom analyzer using the Delete API.                                                                      |
| [getAnalyzer.js](getAnalyzer.js)                             | Retrieve an analyzer using the Get API and display its properties.                                                  |
| [getResultFile.js](getResultFile.js)                         | Get result files (like keyframe images) from a video analysis operation.                                            |
| [listAnalyzers.js](listAnalyzers.js)                         | List all available analyzers and display their properties.                                                          |

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

2. Edit the file `sample.env`, adding the correct credentials to access the Azure service and run the samples. Then rename the file from `sample.env` to just `.env`. The sample program will read this file automatically.

3. Run the sample:

```bash
node analyzeBinary.js
```

Alternatively, run a single sample with the correct environment variables set (setting up the `.env` file is not required if you do this), for example:

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node analyzeBinary.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node analyzeUrl.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node analyzeUrlPrebuiltInvoice.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node createOrReplaceAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node deleteAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node getAnalyzer.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node getResultFile.js
```

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/" node listAnalyzers.js
```

## Next Steps

Take a look at our API documentation for more information about the APIs that are available in the client.

- API Reference: https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding
- Package README: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md

For TypeScript samples, see the `typescript/` folder next to this directory.
