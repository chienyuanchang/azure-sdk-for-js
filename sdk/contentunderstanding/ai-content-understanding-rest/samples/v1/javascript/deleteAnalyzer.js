// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Delete a custom analyzer using the Delete API.
 *
 * This sample demonstrates how to delete a custom analyzer. It creates a
 * temporary analyzer first, then deletes it.
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const { ContentUnderstandingClient } = require("@azure-rest/ai-content-understanding");
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

  try {
    // Step 1: Load endpoint and choose credential
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
    const client = new ContentUnderstandingClient(endpoint, credential);
    console.log("  Client created successfully\n");

    // Step 3: Get the ContentAnalyzers client
    console.log("Step 3: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    // Step 4: Create a temporary analyzer for deletion demo
    console.log("Step 4: Creating temporary analyzer for deletion demo...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    const analyzerId = `sdk_sample_analyzer_to_delete_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    // Create field schema
    const fieldSchema = {
      name: "demo_schema",
      description: "Schema for deletion demo",
      fields: {
        demo_field: {
          type: "string",
          method: "extract",
          description: "Demo field for deletion",
        },
      },
    };

    // Create analyzer configuration
    const config = {
      returnDetails: true,
    };

    // Create the temporary analyzer object
    const tempAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Temporary analyzer for deletion demo",
      config: config,
      fieldSchema: fieldSchema,
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    try {
      const poller = client.createOrReplace(analyzerId, tempAnalyzer);
      const createdAnalyzer = await poller.pollUntilDone();
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log(`  Status: ${createdAnalyzer.status}`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 5: Delete the analyzer
    console.log("Step 5: Deleting the analyzer...");
    try {
      await client.delete(analyzerId);
      console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to delete analyzer: ${error.message}`);
      throw error;
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
    console.log("");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a temporary custom analyzer");
    console.log("  2. Deleting the analyzer using the Delete API");
    console.log("");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample");
    console.log("");
  } catch (error) {
    if (error.status === 401) {
      console.error("");
      console.error("✗ Authentication failed");
      console.error(`  Error: ${error.message}`);
      console.error("  Please check your credentials and ensure they are valid.");
      process.exit(1);
    } else if (error.status) {
      console.error("");
      console.error("✗ Service request failed");
      console.error(`  Status: ${error.status}`);
      console.error(`  Error Code: ${error.code}`);
      console.error(`  Message: ${error.message}`);
      process.exit(1);
    } else {
      console.error("");
      console.error("✗ An unexpected error occurred");
      console.error(`  Error: ${error.message}`);
      console.error(`  Type: ${error.constructor.name}`);
      process.exit(1);
    }
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
