# Azure ContentUnderstanding REST client library for JavaScript

The Content Understanding service extracts content and fields from multimodal input.

**Please rely heavily on our [REST client docs](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/rest-clients.md) to use this library**

Key links:

- [Source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/contentunderstanding/ai-content-understanding-rest)
- [Package (NPM)](https://www.npmjs.com/package/@azure-rest/ai-content-understanding)
- [API reference documentation](https://learn.microsoft.com/javascript/api/@azure-rest/ai-content-understanding?view=azure-node-preview)

## Getting started

### Currently supported environments

- LTS versions of Node.js

### Prerequisites

- You must have an [Azure subscription](https://azure.microsoft.com/free/) to use this package.

### Install the `@azure-rest/ai-content-understanding` package

Install the Azure ContentUnderstanding REST client REST client library for JavaScript with `npm`:

```bash
npm install @azure-rest/ai-content-understanding
```

### Create and authenticate a `ContentUnderstandingClient`

To use an [Azure Active Directory (AAD) token credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-with-a-pre-fetched-access-token),
provide an instance of the desired credential type obtained from the
[@azure/identity](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#credentials) library.

To authenticate with AAD, you must first `npm` install [`@azure/identity`](https://www.npmjs.com/package/@azure/identity) 

After setup, you can choose which type of [credential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#credentials) from `@azure/identity` to use.
As an example, [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential)
can be used to authenticate the client.

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
