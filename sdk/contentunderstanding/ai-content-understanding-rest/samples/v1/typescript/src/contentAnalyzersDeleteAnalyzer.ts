
// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: delete a custom analyzer using the delete API.
 *
 * Prerequisites:
 *   pnpm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional)
 *   These variables can be set in a .env file in the typescript directory for repeated use.
 *
 * Run:
 *   pnpm ts-node src/contentAnalyzersDeleteAnalyzer.ts
 */

import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { DefaultAzureCredential } from "@azure/identity";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";

// Polyfill __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Helper to select credential based on environment
const getCredential = async (): Promise<DefaultAzureCredential | { key: string }> => {
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  if (key) {
    // Lazy import to avoid requiring @azure/core-auth for AAD samples
    const { AzureKeyCredential } = await import("@azure/core-auth");
    return new AzureKeyCredential(key);
  }
  return new DefaultAzureCredential();
};

// Main sample logic
const main = async (): Promise<void> => {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error("Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env).");
  }
  const credential = await getCredential();

  // 2. Create the client
  const client = createClient(endpoint, credential);

  // 3. Create a custom analyzer for deletion demo
  const analyzerId = `sdk-sample-analyzer-to-delete-${Math.floor(Date.now() / 1000)}`;

  // Define the custom analyzer with field schema
  const customAnalyzer = {
    description: "Temporary analyzer for deletion demo",
    baseAnalyzerId: "prebuilt-documentAnalyzer",
    config: {
      enableFormula: true,
      enableLayout: true,
      enableOcr: true,
      returnDetails: true,
    },
    fieldSchema: {
      name: "demo_schema",
      description: "Schema for deletion demo",
      fields: {
        demo_field: {
          type: "string",
          method: "extract",
          description: "Demo field for deletion",
        },
      },
    },
  };

  console.log(`🔧 Creating analyzer '${analyzerId}' for deletion demo...`);

  // 4. Submit the create or replace request
  let initialResponse: any;
  try {
    initialResponse = await client
      .path("/analyzers/{analyzerId}", analyzerId)
      .put({
        body: customAnalyzer as any,
      });
  } catch (err) {
    console.error("Failed to submit create or replace request:", err);
    process.exit(1);
  }

  // 5. Poll for result using SDK poller helper
  if (["202", 202, "200", 200, "201", 201].includes(initialResponse.status)) {
    try {
      const poller = await getLongRunningPoller(client, initialResponse);
      const pollResult = await poller.pollUntilDone();
      console.log(`✅ Analyzer '${analyzerId}' created successfully!`);

      // 6. Delete the analyzer
      console.log(`\n🗑️  Deleting analyzer '${analyzerId}'...`);
      const deleteResponse = await client.path("/analyzers/{analyzerId}", analyzerId).delete();

      if ([204, "204"].includes(deleteResponse.status)) {
        console.log(`✅ Analyzer '${analyzerId}' deleted successfully!`);
      } else {
        console.error("Failed to delete analyzer:", deleteResponse.status);
      }
    } catch (err) {
      console.error("Error during polling or deletion:", err);
    }
  } else {
    console.error("Unexpected initial response status:", initialResponse.status);
    console.error(initialResponse.body);
  }

  // Manually close DefaultAzureCredential if it was used
  if (credential instanceof DefaultAzureCredential && typeof (credential as any).close === "function") {
    await (credential as any).close();
  }
};

// Entry point
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
