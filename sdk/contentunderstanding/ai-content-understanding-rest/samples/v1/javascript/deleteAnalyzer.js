// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample demonstrates how to delete a custom analyzer using the Delete API.
 *
 * Prerequisites:
 *   - Azure subscription
 *   - Azure Content Understanding resource
 *
 * Setup:
 *   Set the following environment variables or add them to .env file:
 *   - AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   - AZURE_CONTENT_UNDERSTANDING_KEY (optional - DefaultAzureCredential will be used if not set)
 *
 * To run:
 *   node deleteAnalyzer.js
 *
 * This sample demonstrates:
 * 1. Authenticate with Azure AI Content Understanding
 * 2. Create a temporary analyzer (for deletion demo)
 * 3. Delete the analyzer using the delete API
 */

const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const ContentUnderstanding = require("@azure-rest/ai-content-understanding").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-content-understanding");
require("dotenv/config");

// Helper to select credential based on environment
function getCredential() {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

async function main() {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Delete Analyzer");
  console.log("=============================================================\n");

  let analyzerId = null;

  try {
    // Step 1: Load configuration
    console.log("Step 1: Loading configuration...");
    const endpoint = (process.env["AZURE_CONTENT_UNDERSTANDING_ENDPOINT"] || "").trim();
    if (!endpoint) {
      throw new Error(
        "AZURE_CONTENT_UNDERSTANDING_ENDPOINT is required. Set it in your environment or .env file.",
      );
    }
    console.log(`  Endpoint: ${endpoint}\n`);

    // Step 2: Create the client with appropriate authentication
    console.log("Step 2: Creating Content Understanding client...");
    const credential = getCredential();
    console.log(
      `  Authentication: ${credential instanceof DefaultAzureCredential ? "DefaultAzureCredential" : "API Key"}`,
    );
    const client = ContentUnderstanding(endpoint, credential);
    console.log("  Client created successfully\n");

    // Step 3: Get the ContentAnalyzers client
    console.log("Step 3: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    // Step 4: Create a temporary analyzer for deletion demo
    console.log("Step 4: Creating temporary analyzer for deletion demo...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    analyzerId = `sdk_sample_analyzer_to_delete_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    // Create a simple custom analyzer
    const tempAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Temporary analyzer for deletion demo",
      config: {
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
      // Add required model mappings
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    try {
      const initialResponse = await client.path("/analyzers/{analyzerId}", analyzerId).put({
        body: tempAnalyzer,
      });

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }

      const poller = await getLongRunningPoller(client, initialResponse);
      const pollResult = await poller.pollUntilDone();
      const result = pollResult.body;

      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log(`  Status: ${result.status}\n`);
    } catch (error) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 5: Delete the analyzer
    console.log("Step 5: Deleting the analyzer...");
    try {
      const deleteResponse = await client.path("/analyzers/{analyzerId}", analyzerId).delete();
      if (isUnexpected(deleteResponse)) {
        throw deleteResponse.body.error;
      }
      console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!\n`);
    } catch (error) {
      console.error(`  Failed to delete analyzer: ${error.message}`);
      throw error;
    }

    // Try to close DAC if supported
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a temporary custom analyzer");
    console.log("  2. Deleting the analyzer using the Delete API\n");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample (if available)");
  } catch (err) {
    console.error();
    console.error("✗ An error occurred");
    console.error("  ", err?.message ?? err);
    process.exit(1);
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
