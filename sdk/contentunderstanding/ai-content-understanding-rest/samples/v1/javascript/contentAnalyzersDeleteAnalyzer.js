
// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: delete a custom analyzer using the delete API.
 *
 * Prerequisites:
 *   npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional)
 *   These variables can be set in a .env file in the samples directory for repeated use.
 *
 * Run:
 *   node contentAnalyzersDeleteAnalyzer.js
 */

import dotenv from "dotenv";
dotenv.config();

import { DefaultAzureCredential } from "@azure/identity";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";

// Helper to select credential based on environment
const getCredential = async () => {
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  if (key) {
    // Lazy import to avoid requiring @azure/core-auth for AAD samples
    const { AzureKeyCredential } = await import("@azure/core-auth");
    return new AzureKeyCredential(key);
  }
  return new DefaultAzureCredential();
};

// Main sample logic
const main = async () => {
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
  let initialResponse;
  try {
    initialResponse = await client
      .path("/analyzers/{analyzerId}", analyzerId)
      .put({
        body: customAnalyzer,
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
  if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
    await credential.close();
  }
};

// Entry point check for both ESM and CommonJS
if (typeof require !== "undefined" && require.main === module || import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
