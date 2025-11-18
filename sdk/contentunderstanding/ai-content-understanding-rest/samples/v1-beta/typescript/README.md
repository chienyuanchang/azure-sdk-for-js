# Azure Content Understanding client library samples for TypeScript (Beta)

These sample programs show how to use the TypeScript client libraries for Azure Content Understanding in some common scenarios.

| **File Name**                                             | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [analyzeBinary.ts][analyzebinary]                         | Analyze a PDF file from disk using the prebuilt-documentSearch. Analyze a PDF file from disk using the prebuilt-documentSearch. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [analyzeBinaryRawJson.ts][analyzebinaryrawjson]           | Analyze a PDF file from disk using the prebuilt-documentSearch and save the raw JSON response. Analyze a PDF file from disk using the prebuilt-documentSearch and save the raw JSON response. IMPORTANT NOTES: - The SDK returns analysis results with an object model, which is easier to navigate and retrieve the desired results compared to parsing raw JSON - This sample is ONLY for demonstration purposes to show how to access raw JSON responses - For production use, prefer the object model approach shown in the analyzeBinary sample Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                |
| [analyzeUrl.ts][analyzeurl]                               | Analyze a document from a URL using the prebuilt-documentSearch. Analyze a document from a URL using the prebuilt-documentSearch. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [analyzeUrlPrebuiltInvoice.ts][analyzeurlprebuiltinvoice] | Analyze an invoice from a URL using the prebuilt-invoice analyzer and extract structured fields. Analyze an invoice from a URL using the prebuilt-invoice analyzer and extract structured fields. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                                   |
| [createOrReplaceAnalyzer.ts][createorreplaceanalyzer]     | Create a custom analyzer with field schema, use it to analyze a document, and clean up. Create a custom analyzer with field schema, use it to analyze a document, and clean up. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [deleteAnalyzer.ts][deleteanalyzer]                       | Delete a custom analyzer using the Delete API. Delete a custom analyzer using the Delete API. This sample demonstrates how to delete a custom analyzer. It creates a temporary analyzer first, then deletes it. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                     |
| [getAnalyzer.ts][getanalyzer]                             | Retrieve an analyzer using the Get API and display its properties. Retrieve an analyzer using the Get API and display its properties. This sample demonstrates how to retrieve a custom analyzer. It creates a temporary analyzer first, then retrieves it to display all properties. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                               |
| [getResultFile.ts][getresultfile]                         | Get result files (like keyframe images) from a video analysis operation. Get result files (like keyframe images) from a video analysis operation. This sample demonstrates: 1. Analyzing a video file to generate keyframes 2. Extracting operation ID from the analysis 3. Getting result files (keyframe images) using the operation ID 4. Saving the keyframe images to local files Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                              |
| [listAnalyzers.ts][listanalyzers]                         | This sample demonstrates how to list all available content analyzers. This sample demonstrates how to list all available content analyzers. Prerequisites: - Azure subscription - Azure Content Understanding resource Setup: Set the following environment variables or add them to .env file: - AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) - AZURE_CONTENT_UNDERSTANDING_KEY (optional - DefaultAzureCredential will be used if not set) To run: npm run build && node dist/listAnalyzers.js This sample demonstrates: 1. Authenticate with Azure AI Content Understanding 2. List all available analyzers (both prebuilt and custom) 3. Display summary statistics (prebuilt vs custom analyzers) 4. Display detailed information about each analyzer |
| [updateAnalyzer.ts][updateanalyzer]                       | Update a custom analyzer using the Update API. Update a custom analyzer using the Update API. Environment variables: AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required) AZURE_CONTENT_UNDERSTANDING_KEY (optional; DefaultAzureCredential used if not set)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Prerequisites

The sample programs are compatible with [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule).

Before running the samples in Node, they must be compiled to JavaScript using the TypeScript compiler. For more information on TypeScript, see the [TypeScript documentation][typescript]. Install the TypeScript compiler using:

```bash
npm install -g typescript
```

You need [an Azure subscription][freesub] to run these sample programs.

Samples retrieve credentials to access the service endpoint from environment variables. Alternatively, edit the source code to include the appropriate credentials. See each individual sample for details on which environment variables/credentials it requires to function.

Adapting the samples to run in the browser may require some additional consideration. For details, please see the [package README][package].

## Setup

To run the samples using the published version of the package:

1. Install the dependencies using `npm`:

```bash
npm install
```

2. Compile the samples:

```bash
npm run build
```

3. Edit the file `sample.env`, adding the correct credentials to access the Azure service and run the samples. Then rename the file from `sample.env` to just `.env`. The sample programs will read this file automatically.

4. Run whichever samples you like (note that some samples may require additional setup, see the table above):

```bash
node dist/analyzeBinary.js
```

Alternatively, run a single sample with the correct environment variables set (setting up the `.env` file is not required if you do this), for example (cross-platform):

```bash
cross-env AZURE_CONTENT_UNDERSTANDING_KEY="<azure content understanding key>" AZURE_CONTENT_UNDERSTANDING_ENDPOINT="<azure content understanding endpoint>" node dist/analyzeBinary.js
```

## Next Steps

Take a look at our [API Documentation][apiref] for more information about the APIs that are available in the clients.

[analyzebinary]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/analyzeBinary.ts
[analyzebinaryrawjson]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/analyzeBinaryRawJson.ts
[analyzeurl]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/analyzeUrl.ts
[analyzeurlprebuiltinvoice]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/analyzeUrlPrebuiltInvoice.ts
[createorreplaceanalyzer]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/createOrReplaceAnalyzer.ts
[deleteanalyzer]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/deleteAnalyzer.ts
[getanalyzer]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/getAnalyzer.ts
[getresultfile]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/getResultFile.ts
[listanalyzers]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/listAnalyzers.ts
[updateanalyzer]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/contentunderstanding/ai-content-understanding-rest/samples/v1-beta/typescript/src/updateAnalyzer.ts
[apiref]: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview
[freesub]: https://azure.microsoft.com/free/
[package]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest/README.md
[typescript]: https://www.typescriptlang.org/docs/home.html
