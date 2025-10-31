// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample demonstrates how to list all available content analyzers.
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
 *   node listAnalyzers.js
 *
 * This sample demonstrates:
 * 1. Authenticate with Azure AI Content Understanding
 * 2. List all available analyzers (both prebuilt and custom)
 * 3. Display summary statistics (prebuilt vs custom analyzers)
 * 4. Display detailed information about each analyzer
 */

const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const ContentUnderstanding = require("@azure-rest/ai-content-understanding").default;
const { paginate, isUnexpected } = require("@azure-rest/ai-content-understanding");
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

    // Step 4: List all available analyzers
    console.log("Step 4: Listing all available analyzers...");
    const analyzers = [];

    try {
      const initialResponse = await client.path("/analyzers").get();

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }

      // Use paginate helper to iterate through all pages
      const analyzerPages = paginate(client, initialResponse);

      for await (const analyzer of analyzerPages) {
        analyzers.push(analyzer);
      }

      console.log(`  Found ${analyzers.length} analyzer(s)\n`);
    } catch (error) {
      console.error(`  Failed to list analyzers: ${error.message}`);
      throw error;
    }

    // Step 5: Display summary
    console.log("Step 5: Summary...");
    console.log(`  Total analyzers: ${analyzers.length}`);

    const prebuiltCount = analyzers.filter((a) => a.analyzerId?.startsWith("prebuilt-")).length;
    const customCount = analyzers.filter((a) => !a.analyzerId?.startsWith("prebuilt-")).length;
    console.log(`  Prebuilt analyzers: ${prebuiltCount}`);
    console.log(`  Custom analyzers: ${customCount}\n`);

    // Step 6: Display detailed information about each analyzer
    if (analyzers.length > 0) {
      console.log("Step 6: Displaying analyzer details...");
      console.log("=============================================================\n");

      for (let i = 0; i < analyzers.length; i++) {
        const analyzer = analyzers[i];
        console.log(`Analyzer ${i + 1}:`);
        console.log(`  ID: ${analyzer.analyzerId}`);
        console.log(`  Description: ${analyzer.description ?? "(none)"}`);
        console.log(`  Status: ${analyzer.status}`);

        if (analyzer.createdAt) {
          const createdDate = new Date(analyzer.createdAt);
          console.log(
            `  Created at: ${createdDate.toISOString().replace("T", " ").substring(0, 19)} UTC`,
          );
        }

        if (analyzer.lastModifiedAt) {
          const modifiedDate = new Date(analyzer.lastModifiedAt);
          console.log(
            `  Last modified: ${modifiedDate.toISOString().replace("T", " ").substring(0, 19)} UTC`,
          );
        }

        // Check if it's a prebuilt analyzer
        if (analyzer.analyzerId?.startsWith("prebuilt-")) {
          console.log("  Type: Prebuilt analyzer");
        } else {
          console.log("  Type: Custom analyzer");
        }

        // Show tags if available
        if (analyzer.tags && Object.keys(analyzer.tags).length > 0) {
          const tagList = Object.entries(analyzer.tags)
            .map(([key, value]) => `${key}=${value}`)
            .join(", ");
          console.log(`  Tags: ${tagList}`);
        }

        console.log();
      }
    } else {
      console.log("No analyzers found in this Content Understanding resource.\n");
    }

    // Try to close DAC if supported
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("This sample demonstrated:");
    console.log("  1. Authenticating with the Content Understanding service");
    console.log("  2. Listing all available analyzers using pagination");
    console.log("  3. Displaying summary statistics");
    console.log("  4. Showing detailed properties for each analyzer\n");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To retrieve a specific analyzer: see getAnalyzer sample");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
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
