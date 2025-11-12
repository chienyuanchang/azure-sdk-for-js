// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Update a custom analyzer using the Update API.
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
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"]; // optional
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

async function main() {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Update Analyzer");
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

    // Step 4: Create initial analyzer
    console.log("Step 4: Creating initial analyzer...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    const analyzerId = `sdk_sample_analyzer_for_update_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    const initialAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Initial description",
      config: {
        enableFormula: true,
        enableLayout: true,
        enableOcr: true,
        estimateFieldSourceAndConfidence: true,
        returnDetails: true,
      },
      fieldSchema: {
        name: "update_demo_schema",
        description: "Schema for update demo",
        fields: {
          total_amount: {
            type: "number",
            method: "extract",
            description: "Total amount of this document",
          },
          company_name: {
            type: "string",
            method: "extract",
            description: "Name of the company",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
      tags: {
        tag1: "tag1_initial_value",
        tag2: "tag2_initial_value",
      },
    };

    try {
      console.log("  Creating analyzer (this may take a few moments)...");
      const poller = client.createOrReplace(analyzerId, initialAnalyzer);
      const createdAnalyzer = await poller.pollUntilDone();
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log(`  Status: ${createdAnalyzer.status}`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 5: Get the analyzer before update to verify initial state
    console.log("Step 5: Getting analyzer before update...");
    let analyzerBeforeUpdate;
    try {
      analyzerBeforeUpdate = await client.get(analyzerId);
      console.log("  ✅ Initial analyzer state verified:");
      console.log(`    Description: ${analyzerBeforeUpdate.description}`);
      const tagsList = Object.entries(analyzerBeforeUpdate.tags || {})
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      console.log(`    Tags: ${tagsList}`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to get analyzer: ${error.message}`);
      throw error;
    }

    // Step 6: Update the analyzer
    console.log("Step 6: Updating analyzer with new description and tags...");

    console.log("  Changes to apply:");
    console.log(`    New Description: Updated description`);
    console.log(`    Tag Updates: tag1 (updated), tag2 (removed), tag3 (added)`);
    console.log("");

    try {
      // For Update API, we need to send the fields that should be changed
      // Note: The service currently requires baseAnalyzerId and models even in PATCH requests
      const updateData = {
        baseAnalyzerId: analyzerBeforeUpdate.baseAnalyzerId,
        description: "Updated description",
        tags: {
          tag1: "tag1_updated_value",
          tag2: "",
          tag3: "tag3_value",
        },
        models: {
          completion: "gpt-4o-mini",
          embedding: "text-embedding-3-large",
        },
      };

      await client.update(analyzerId, updateData);

      console.log("  ✅ Analyzer updated successfully!");
      console.log("");
    } catch (error) {
      console.error(`  Failed to update analyzer: ${error.message}`);
      throw error;
    }

    // Step 7: Get the analyzer after update to verify changes persisted
    console.log("Step 7: Getting analyzer after update to verify changes...");
    let analyzerAfterUpdate;
    try {
      analyzerAfterUpdate = await client.get(analyzerId);
      console.log("  ✅ Updated analyzer state verified:");
      console.log(`    Description: ${analyzerAfterUpdate.description}`);
      const tagsList = Object.entries(analyzerAfterUpdate.tags || {})
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      console.log(`    Tags: ${tagsList}`);
      console.log("");

      // Verify the changes
      console.log("  📋 Verification:");
      if (analyzerAfterUpdate.description === "Updated description") {
        console.log("    ✓ Description updated correctly");
      }
      if (
        analyzerAfterUpdate.tags?.tag1 === "tag1_updated_value"
      ) {
        console.log("    ✓ tag1 updated correctly");
      }
      const tag2Value = analyzerAfterUpdate.tags?.tag2 ?? null;
      if (!tag2Value) {
        console.log("    ✓ tag2 removed correctly");
      }
      if (analyzerAfterUpdate.tags?.tag3 === "tag3_value") {
        console.log("    ✓ tag3 added correctly");
      }
      console.log("");
    } catch (error) {
      console.error(`  Failed to get analyzer after update: ${error.message}`);
      throw error;
    }

    // Step 8: Clean up (delete the created analyzer)
    console.log("Step 8: Cleaning up (deleting analyzer)...");
    try {
      await client.delete(analyzerId);
      console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to delete analyzer: ${error.message}`);
      // Don't throw - cleanup failure shouldn't fail the sample
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
    console.log("");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a custom analyzer with initial configuration");
    console.log("  2. Updating analyzer properties (description and tags)");
    console.log("  3. Verifying the updates persisted");
    console.log("  4. Cleaning up by deleting the analyzer");
    console.log("");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample");
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
