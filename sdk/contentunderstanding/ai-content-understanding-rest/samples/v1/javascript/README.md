# JavaScript Samples for ai-content-understanding-rest

This folder contains JavaScript sample code for using the Azure AI Content Understanding REST API.

## Structure
- `sample.env`: Example environment variables for authentication and configuration.
- `package.json`: Sample dependencies and scripts for running samples.
- `content_analyzers_analyze_binary.js`: Example usage of the Content Analyzers API.
- `sample_files/`: Example input files for binary/text analysis.

## How to Run
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up your environment variables (see `sample.env`).
3. Run a sample:
   ```bash
   node content_analyzers_analyze_binary.js
   ```

## Quick Run (published packages)
1. Make sure `package.json` contains the required dependencies (or install them):
   ```bash
   npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
   ```
2. Run the sample:
   ```bash
   node content_analyzers_analyze_binary.js
   ```

## Local Development
1. From the repo root, install workspace packages and build the client package:
   ```bash
   pnpm install
   npx turbo build -F ./sdk/contentunderstanding/ai-content-understanding-rest...
   ```
2. From the sample folder, install (pnpm will link local workspace package):
   ```bash
   pnpm install
   ```
3. Run the sample:
   ```bash
   node content_analyzers_analyze_binary.js
   ```

## Notes
- The sample uses `DefaultAzureCredential` if `AZURE_CONTENT_UNDERSTANDING_KEY` is not set.
- The sample demonstrates a simple polling loop against the `operation-location` returned by the service.

## More Samples
Add more sample files following the naming convention: `sample<Operation>.js`.

For TypeScript samples, see the `typescript/` folder.
