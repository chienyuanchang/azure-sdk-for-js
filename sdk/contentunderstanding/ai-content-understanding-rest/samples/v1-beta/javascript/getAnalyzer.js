// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * @summary Retrieve an analyzer using the Get API and display its properties.
 *
 * Retrieve an analyzer using the Get API and display its properties.
 *
 * This sample demonstrates how to retrieve a custom analyzer. It creates a
 * temporary analyzer first, then retrieves it to display all properties.
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

require("dotenv/config");
const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const { ContentUnderstandingClient } = require("@azure-rest/ai-content-understanding");
// Helper to select credential based on environment
function getCredential() {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

// Main sample logic
async function main() {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Get Analyzer");
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

    // Step 4: Create a temporary analyzer for retrieval demo
    console.log("Step 4: Creating temporary analyzer for retrieval demo...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    const analyzerId = `sdk_sample_analyzer_to_retrieve_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    // Create field schema
    const fieldSchema = {
      name: "retrieval_schema",
      description: "Schema for retrieval demo",
      fields: {
        demo_field: {
          type: "string",
          method: "extract",
          description: "Demo field for retrieval",
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
      description: "Custom analyzer for retrieval demo",
      config: config,
      fieldSchema: fieldSchema,
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    let created = false;
    let retrievedAnalyzer = null;

    try {
      console.log("  Creating analyzer (this may take a few moments)...");
      const poller = client.createOrReplace(analyzerId, tempAnalyzer);
      await poller.pollUntilDone();
      created = true;
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log("");
    } catch (error) {
      const err = error;
      console.error(`  Failed to create analyzer: ${err.message}`);
      throw error;
    }

    // Step 5: Retrieve the analyzer
    console.log("Step 5: Retrieving the analyzer...");
    try {
      retrievedAnalyzer = await client.get(analyzerId);
      console.log(`  ✅ Analyzer '${analyzerId}' retrieved successfully!`);
      console.log("");
    } catch (error) {
      const err = error;
      console.error(`  Failed to retrieve analyzer: ${err.message}`);
      throw error;
    }

    // Step 6: Display analyzer properties
    console.log("Step 6: Displaying analyzer properties...");
    console.log("=============================================================");
    if (retrievedAnalyzer) {
      console.log(`  Analyzer ID: ${retrievedAnalyzer.analyzerId}`);
      console.log(`  Description: ${retrievedAnalyzer.description}`);
      console.log(`  Status: ${retrievedAnalyzer.status}`);
      console.log(`  Base Analyzer: ${retrievedAnalyzer.baseAnalyzerId}`);
      console.log(`  Created at: ${new Date(retrievedAnalyzer.createdAt).toUTCString()}`);
      console.log(`  Last modified: ${new Date(retrievedAnalyzer.lastModifiedAt).toUTCString()}`);

      if (retrievedAnalyzer.fieldSchema) {
        console.log(`  Field Schema:`);
        console.log(`    Name: ${retrievedAnalyzer.fieldSchema.name}`);
        console.log(`    Description: ${retrievedAnalyzer.fieldSchema.description}`);
        console.log(
          `    Fields: ${Object.keys(retrievedAnalyzer.fieldSchema.fields ?? {}).length}`,
        );

        if (retrievedAnalyzer.fieldSchema.fields) {
          for (const [fieldName, fieldDef] of Object.entries(
            retrievedAnalyzer.fieldSchema.fields,
          )) {
            const def = fieldDef;
            console.log(`      - ${fieldName}: ${def.type} (${def.method})`);
          }
        }
      }

      if (retrievedAnalyzer.models && Object.keys(retrievedAnalyzer.models).length > 0) {
        console.log(`  Models:`);
        for (const [modelKey, modelValue] of Object.entries(retrievedAnalyzer.models)) {
          console.log(`    ${modelKey}: ${modelValue}`);
        }
      }

      if (retrievedAnalyzer.tags && Object.keys(retrievedAnalyzer.tags).length > 0) {
        const tagStrings = Object.entries(retrievedAnalyzer.tags).map(
          ([key, value]) => `${key}=${value}`,
        );
        console.log(`  Tags: ${tagStrings.join(", ")}`);
      }
    }
    console.log("=============================================================");
    console.log("");

    // Step 7: Clean up (delete the analyzer)
    if (created) {
      console.log("Step 7: Cleaning up (deleting analyzer)...");
      try {
        await client.delete(analyzerId);
        console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!`);
        console.log("");
      } catch (error) {
        const err = error;
        console.error(`  Failed to delete analyzer: ${err.message}`);
        // Don't throw - cleanup failure shouldn't fail the sample
      }
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
    console.log("");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a temporary custom analyzer");
    console.log("  2. Retrieving the analyzer using the Get API");
    console.log("  3. Displaying analyzer properties and configuration");
    console.log("  4. Cleaning up by deleting the analyzer");
    console.log("");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
    console.log("");
  } catch (error) {
    const err = error;
    if (err?.status === 401) {
      console.error("");
      console.error("✗ Authentication failed");
      console.error(`  Error: ${err.message}`);
      console.error("  Please check your credentials and ensure they are valid.");
      process.exit(1);
    } else if (err?.status) {
      console.error("");
      console.error("✗ Service request failed");
      console.error(`  Status: ${err.status}`);
      console.error(`  Error Code: ${err.code}`);
      console.error(`  Message: ${err.message}`);
      process.exit(1);
    } else {
      console.error("");
      console.error("✗ An unexpected error occurred");
      console.error(`  Error: ${err?.message}`);
      console.error(`  Type: ${err?.constructor?.name}`);
      process.exit(1);
    }
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
