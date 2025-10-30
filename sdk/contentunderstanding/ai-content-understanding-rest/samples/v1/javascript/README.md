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

| File Name | Description |
| --- | --- |
| [analyzeBinary.js](analyzeBinary.js) | Analyze a PDF using the prebuilt-documentAnalyzer. |

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

## Next Steps

Take a look at our API documentation for more information about the APIs that are available in the client.

- API Reference: https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding
- Package README: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md

For TypeScript samples, see the `typescript/` folder next to this directory.
