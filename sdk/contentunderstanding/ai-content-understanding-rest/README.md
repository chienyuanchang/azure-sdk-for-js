# Azure ContentUnderstanding client library for JavaScript

This package contains an isomorphic SDK (runs both in Node.js and in browsers) for Azure ContentUnderstanding client.

The Content Understanding service extracts content and fields from multimodal input.

Key links:

- [Source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest)
- [Package (NPM)](https://www.npmjs.com/package/@azure-rest/ai-content-understanding)
- [API reference documentation](https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding?view=azure-node-preview)

## Getting started

### Currently supported environments

- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule)
- Latest versions of Safari, Chrome, Edge and Firefox.

See our [support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md) for more details.

### Prerequisites

- An [Azure subscription][azure_sub].

### Install the `@azure-rest/ai-content-understanding` package

Install the Azure ContentUnderstanding client library for JavaScript with `npm`:

```bash
npm install @azure-rest/ai-content-understanding
```

### Create and authenticate a `ContentUnderstandingClient`

To create a client object to access the Azure ContentUnderstanding API, you will need the `endpoint` of your Azure ContentUnderstanding resource and a `credential`. The Azure ContentUnderstanding client can use Azure Active Directory credentials to authenticate.
You can find the endpoint for your Azure ContentUnderstanding resource in the [Azure Portal][azure_portal].

You can authenticate with Azure Active Directory using a credential from the [@azure/identity][azure_identity] library or [an existing AAD Token](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-with-a-pre-fetched-access-token).

To use the [DefaultAzureCredential][defaultazurecredential] provider shown below, or other credential providers provided with the Azure SDK, please install the `@azure/identity` package:

```bash
npm install @azure/identity
```

You will also need to **register a new AAD application and grant access to Azure ContentUnderstanding** by assigning the suitable role to your service principal (note: roles such as `"Owner"` will not grant the necessary permissions).

For more information about how to create an Azure AD Application check out [this guide](https://learn.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

Using Node.js and Node-like environments, you can use the `DefaultAzureCredential` class to authenticate the client.

```ts snippet:ReadmeSampleCreateClient_Node
import { ContentUnderstandingClient } from "@azure-rest/ai-content-understanding";
import { DefaultAzureCredential } from "@azure/identity";

const client = new ContentUnderstandingClient("<endpoint>", new DefaultAzureCredential());
```

For browser environments, use the `InteractiveBrowserCredential` from the `@azure/identity` package to authenticate.

```ts snippet:ReadmeSampleCreateClient_Browser
import { InteractiveBrowserCredential } from "@azure/identity";
import { ContentUnderstandingClient } from "@azure-rest/ai-content-understanding";

const credential = new InteractiveBrowserCredential({
  tenantId: "<YOUR_TENANT_ID>",
  clientId: "<YOUR_CLIENT_ID>"
 });
const client = new ContentUnderstandingClient("<endpoint>", credential);
```


### JavaScript Bundle
To use this client library in the browser, first you need to use a bundler. For details on how to do this, please refer to our [bundling documentation](https://aka.ms/AzureSDKBundling).

## Key concepts

### ContentUnderstandingClient

`ContentUnderstandingClient` is the primary interface for developers using the Azure ContentUnderstanding client library. Explore the methods on this client object to understand the different features of the Azure ContentUnderstanding service that you can access.

## Troubleshooting

### Logging

Enabling logging may help uncover useful information about failures. In order to see a log of HTTP requests and responses, set the `AZURE_LOG_LEVEL` environment variable to `info`. Alternatively, logging can be enabled at runtime by calling `setLogLevel` in the `@azure/logger`:

```ts snippet:SetLogLevel
import { setLogLevel } from "@azure/logger";

setLogLevel("info");
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).

## Testing

This SDK includes comprehensive tests that can be run in different modes:

### Quick Start

```bash
# Install dependencies
pnpm install

# Build the SDK
npx turbo build --filter=@azure-rest/ai-content-understanding...

# Run tests in playback mode (no Azure resources needed)
pnpm test
```

### Test Modes

- **Playback Mode** (default): Uses pre-recorded HTTP interactions, no Azure resources required
- **Record Mode**: Runs against live Azure services and records interactions for future playback
- **Live Mode**: Runs against live Azure services without recording

### Run Tests in Record Mode

To record new test interactions or update existing ones:

```bash
# 1. Set up environment variables in test/.env
cp test/sample.env test/.env
# Edit test/.env with your Azure credentials

# 2. Run tests in record mode
TEST_MODE=record pnpm test
```

### Run Tests in Playback Mode

To run tests without Azure resources (using pre-recorded interactions):

```bash
# Simply run tests (playback is the default mode)
pnpm test

# Or explicitly set playback mode
TEST_MODE=playback pnpm test
```

### Package-scoped / faster workflows

- Build only this package and its dependencies (faster than building the whole monorepo):

```bash
npx turbo build --filter=@azure-rest/ai-content-understanding... --token 1
```

- Run only Node tests for faster iteration (skip browser tests):

```bash
# from package root
TEST_MODE=record pnpm test:node   # or TEST_MODE=playback pnpm test:node
```

### .env locations and debug tips

- Preferred: create `test/.env` by copying `test/sample.env` and filling your values. The test harness will load `test/.env` first.
- Fallback: you may also place a `.env` at the package root (same directory as `package.json` for this package); the test setup will load it as a fallback.
- You can also export credentials in your shell instead of using a file:

```bash
export AZURE_CONTENT_UNDERSTANDING_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com"
export AZURE_CONTENT_UNDERSTANDING_KEY="<your_key_here>"
TEST_MODE=record pnpm test:node
```

- When running tests in record mode, watch for debug lines printed by the test setup. They show presence (not value) of credentials:

```
DEBUG ENV ENDPOINT DEFINED: true
DEBUG ENV KEY DEFINED: true
```

- Do NOT commit real keys. Keep `test/sample.env` as the template and commit `test/.env` to your local only (or better: use CI secrets to run recordings in CI).

### Troubleshooting

- "key must be a non-empty string": the test process couldn't find your `AZURE_CONTENT_UNDERSTANDING_KEY`. Ensure `test/.env` or package-root `.env` is present and contains the key (or export it in your shell) before running tests.
- If you see "Invalid request" LRO errors during analyze tests, the tests were updated to fetch the operation result from the LRO status; ensure your service/region supports the analyzer used by the tests (prebuilt-documentAnalyzer) and that network access is available for URL-based inputs.

## Contributing

If you'd like to contribute to this library, please read the [contributing guide](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md) to learn more about how to build and test the code.

## Related projects

- [Microsoft Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js)

[azure_sub]: https://azure.microsoft.com/free/
[azure_portal]: https://portal.azure.com
[azure_identity]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity
[defaultazurecredential]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential
