// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * List all available content analyzers.
 *
 * This sample demonstrates how to list all available content analyzers.
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
  console.log("Azure Content Understanding Sample: List Analyzers");
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

    // Step 4: List all available analyzers
    console.log("Step 4: Listing all available analyzers...");
    const analyzers = [];

    try {
      for await (const analyzer of client.list()) {
        analyzers.push(analyzer);
      }

      console.log(`  Found ${analyzers.length} analyzer(s)`);
    } catch (error) {
      console.error(`  Failed to list analyzers: ${error.message}`);
      if (error.code) {
        console.error(`  Error Code: ${error.code}`);
      }
      throw error;
    }

    console.log("");

    // Step 5: Display summary
    console.log("Step 5: Summary...");
    console.log(`  Total analyzers: ${analyzers.length}`);

    const prebuiltCount = analyzers.filter((a) => a.analyzerId?.startsWith("prebuilt-")).length;
    const customCount = analyzers.length - prebuiltCount;
    console.log(`  Prebuilt analyzers: ${prebuiltCount}`);
    console.log(`  Custom analyzers: ${customCount}`);
    console.log("");

    // Step 6: Display detailed information about each analyzer
    if (analyzers.length > 0) {
      console.log("Step 6: Displaying analyzer details...");
      console.log("=============================================================");
      console.log("");

      for (let i = 0; i < analyzers.length; i++) {
        const analyzer = analyzers[i];
        console.log(`Analyzer ${i + 1}:`);
        console.log(`  ID: ${analyzer.analyzerId}`);
        console.log(`  Description: ${analyzer.description ?? "(none)"}`);
        console.log(`  Status: ${analyzer.status}`);
        console.log(
          `  Created at: ${new Date(analyzer.createdAt).toLocaleString()} UTC`,
        );
        console.log(
          `  Last modified: ${new Date(analyzer.lastModifiedAt).toLocaleString()} UTC`,
        );

        // Check if it's a prebuilt analyzer
        if (analyzer.analyzerId?.startsWith("prebuilt-")) {
          console.log("  Type: Prebuilt analyzer");
        } else {
          console.log("  Type: Custom analyzer");
        }

        // Show tags if available
        if (analyzer.tags && Object.keys(analyzer.tags).length > 0) {
          const tagStrings = Object.entries(analyzer.tags).map(
            ([key, value]) => `${key}=${value}`,
          );
          console.log(`  Tags: ${tagStrings.join(", ")}`);
        }

        console.log("");
      }
    } else {
      console.log("No analyzers found in this Content Understanding resource.");
      console.log("");
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
    console.log("");
    console.log("This sample demonstrated:");
    console.log("  1. Listing all available analyzers");
    console.log("  2. Counting prebuilt and custom analyzers");
    console.log("  3. Displaying analyzer properties");
    console.log("");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To get a specific analyzer: see getAnalyzer sample");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
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
