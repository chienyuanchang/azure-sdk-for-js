# TypeScript Samples for ai-content-understanding-rest

This folder contains TypeScript sample code for using the Azure AI Content Understanding REST API.

## Structure
- `src/`: TypeScript sample files.
- `sample.env`: Example environment variables for authentication and configuration.
- `package.json`: Sample dependencies and scripts for running samples.
- `tsconfig.json`: TypeScript configuration for samples.

## How to Run
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up your environment variables (see `sample.env`).
3. Build the samples:
   ```bash
   pnpm run build
   ```
4. Run a sample:
   ```bash
   node dist/sampleAnalyzeBinary.js
   ```

## More Samples
Add more sample files to the `src/` folder following the naming convention: `sample<Operation>.ts`.

For JavaScript samples, see the `javascript/` folder.
