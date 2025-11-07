// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample demonstrates how to update a custom analyzer using the Update API.
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
 *   node updateAnalyzer.js
 *
 * This sample demonstrates:
 * 1. Create an initial analyzer
 * 2. Get the analyzer to verify initial state
 * 3. Update the analyzer with new description and tags
 * 4. Get the analyzer again to verify changes persisted
 * 5. Clean up the created analyzer
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
  console.log("Azure Content Understanding Sample: Update Analyzer");
  console.log("=============================================================\n");

  let analyzerId = null;
  let analyzerCreated = false;

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

    // Step 4: Create initial analyzer
    console.log("Step 4: Creating initial analyzer...");

    // Generate a unique analyzer ID using timestamp
    analyzerId = `sdk_sample_analyzer_for_update_${Math.floor(Date.now() / 1000)}`;
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
      const createResponse = await client.path("/analyzers/{analyzerId}", analyzerId).put({
        body: initialAnalyzer,
      });

      if (isUnexpected(createResponse)) {
        throw createResponse.body.error;
      }

      const poller = await getLongRunningPoller(client, createResponse);
      const pollResult = await poller.pollUntilDone();
      const createdAnalyzer = pollResult.body;

      analyzerCreated = true;
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
      const getResponse = await client.path("/analyzers/{analyzerId}", analyzerId).get();
      if (isUnexpected(getResponse)) {
        throw getResponse.body.error;
      }
      analyzerBeforeUpdate = getResponse.body;
      console.log("  ✅ Initial analyzer state verified:");
      console.log(`    Description: ${analyzerBeforeUpdate.description}`);
      const tagEntries = Object.entries(analyzerBeforeUpdate.tags || {})
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      console.log(`    Tags: ${tagEntries}`);
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
      const updatePayload = {
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

      const updateResponse = await client.path("/analyzers/{analyzerId}", analyzerId).patch({
        contentType: "application/merge-patch+json",
        body: updatePayload,
      });

      if (isUnexpected(updateResponse)) {
        throw updateResponse.body.error;
      }

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
      const getResponse = await client.path("/analyzers/{analyzerId}", analyzerId).get();
      if (isUnexpected(getResponse)) {
        throw getResponse.body.error;
      }
      analyzerAfterUpdate = getResponse.body;
      console.log("  ✅ Updated analyzer state verified:");
      console.log(`    Description: ${analyzerAfterUpdate.description}`);
      const tagEntries = Object.entries(analyzerAfterUpdate.tags || {})
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      console.log(`    Tags: ${tagEntries}`);
      console.log("");

      // Verify the changes
      console.log("  📋 Verification:");
      if (analyzerAfterUpdate.description === "Updated description") {
        console.log("    ✓ Description updated correctly");
      }
      if (analyzerAfterUpdate.tags && analyzerAfterUpdate.tags.tag1 === "tag1_updated_value") {
        console.log("    ✓ tag1 updated correctly");
      }
      const tag2Value = analyzerAfterUpdate.tags ? analyzerAfterUpdate.tags.tag2 : null;
      if (!tag2Value || tag2Value === "") {
        console.log("    ✓ tag2 removed correctly");
      }
      if (analyzerAfterUpdate.tags && analyzerAfterUpdate.tags.tag3 === "tag3_value") {
        console.log("    ✓ tag3 added correctly");
      }
      console.log("");
    } catch (error) {
      console.error(`  Failed to get analyzer after update: ${error.message}`);
      throw error;
    }

    // Step 8: Clean up (delete the created analyzer)
    if (analyzerCreated && analyzerId) {
      console.log("Step 8: Cleaning up (deleting analyzer)...");
      try {
        const deleteResponse = await client.path("/analyzers/{analyzerId}", analyzerId).delete();
        if (isUnexpected(deleteResponse)) {
          throw deleteResponse.body.error;
        }
        console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!`);
        console.log("");
      } catch (error) {
        console.error(`  Failed to delete analyzer: ${error.message}`);
        // Don't throw - cleanup failure shouldn't fail the sample
      }
    }

    // Try to close DAC if supported
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a custom analyzer with initial configuration");
    console.log("  2. Updating analyzer properties (description and tags)");
    console.log("  3. Verifying the updates persisted");
    console.log("  4. Cleaning up by deleting the analyzer\n");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample");
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
