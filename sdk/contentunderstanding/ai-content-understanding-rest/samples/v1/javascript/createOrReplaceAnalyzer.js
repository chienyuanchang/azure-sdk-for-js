// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample demonstrates how to create a custom analyzer using the CreateOrReplace API.
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
 *   node createOrReplaceAnalyzer.js
 *
 * This sample demonstrates:
 * 1. Authenticate with Azure AI Content Understanding
 * 2. Create a custom analyzer with field schema
 * 3. Wait for analyzer creation to complete
 * 4. Use the custom analyzer to analyze a document
 * 5. Clean up by deleting the created analyzer
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
  console.log("Azure Content Understanding Sample: Create Custom Analyzer");
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

    // Step 4: Define the custom analyzer
    console.log("Step 4: Defining custom analyzer...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    analyzerId = `sdk_sample_custom_analyzer_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    // Create field schema with custom fields
    const fieldSchema = {
      name: "company_schema",
      description: "Schema for extracting company information",
      fields: {
        company_name: {
          type: "string",
          method: "extract",
          description: "Name of the company",
        },
        total_amount: {
          type: "number",
          method: "extract",
          description: "Total amount on the document",
        },
      },
    };

    // Create analyzer configuration
    const config = {
      enableFormula: true,
      enableLayout: true,
      enableOcr: true,
      estimateFieldSourceAndConfidence: true,
      returnDetails: true,
    };

    // Create the custom analyzer object
    // Note: Use "prebuilt-document" as the base analyzer for custom document analyzers
    // (not "prebuilt-documentAnalyzer" which is a different prebuilt)
    const customAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Custom analyzer for extracting company information",
      config: config,
      fieldSchema: fieldSchema,
      // Add model mappings for completion and embedding models (required for custom analyzers)
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    console.log("  Analyzer configuration:");
    console.log(`    Base Analyzer: ${customAnalyzer.baseAnalyzerId}`);
    console.log(`    Description: ${customAnalyzer.description}`);
    console.log(`    Fields: ${Object.keys(fieldSchema.fields).length}`);
    console.log(`    Models: ${Object.keys(customAnalyzer.models).length}`);
    console.log("");

    // Step 5: Create the analyzer
    console.log("Step 5: Creating custom analyzer...");
    console.log("  This may take a few moments...");

    try {
      const initialResponse = await client.path("/analyzers/{analyzerId}", analyzerId).put({
        body: customAnalyzer,
      });

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }

      const poller = await getLongRunningPoller(client, initialResponse);
      const pollResult = await poller.pollUntilDone();
      const result = pollResult.body;

      analyzerCreated = true;
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log(`  Status: ${result.status}`);
      if (result.createdAt) {
        const createdDate = new Date(result.createdAt);
        console.log(
          `  Created at: ${createdDate.toISOString().replace("T", " ").substring(0, 19)} UTC`,
        );
      }
      console.log("");
    } catch (error) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 6: Use the analyzer to analyze an invoice
    if (analyzerCreated) {
      console.log("Step 6: Using the custom analyzer to analyze an invoice...");
      const fileUrl =
        "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
      console.log(`  URL: ${fileUrl}`);
      console.log("  Analyzing...");

      try {
        const analyzeResponse = await client
          .path("/analyzers/{analyzerId}:analyze", analyzerId)
          .post({
            body: {
              inputs: [{ url: fileUrl }],
            },
          });

        if (isUnexpected(analyzeResponse)) {
          throw analyzeResponse.body.error;
        }

        const analyzePoller = await getLongRunningPoller(client, analyzeResponse);
        const analyzePollResult = await analyzePoller.pollUntilDone();
        const analyzeResult = analyzePollResult.body?.result ?? analyzePollResult.body;

        console.log("  ✅ Analysis completed successfully!\n");

        // Display extracted custom fields
        if (analyzeResult.contents && analyzeResult.contents.length > 0) {
          const content = analyzeResult.contents[0];
          if (content.fields && Object.keys(content.fields).length > 0) {
            console.log("  📋 Extracted Custom Fields:");
            console.log("  " + "-".repeat(38));

            // Extract the custom fields we defined
            const companyName = content.fields.company_name?.valueString ?? "(not found)";
            console.log(`    Company Name: ${companyName}`);

            const totalAmount = content.fields.total_amount?.valueNumber;
            const totalAmountStr =
              totalAmount !== undefined && totalAmount !== null
                ? totalAmount.toFixed(2)
                : "(not found)";
            console.log(`    Total Amount: ${totalAmountStr}`);

            console.log("");
          } else {
            console.log("  No fields extracted\n");
          }
        }
      } catch (error) {
        console.error(`  Failed to analyze with custom analyzer: ${error.message}`);
        // Continue to cleanup even if analysis fails
      }
    }

    // Step 7: Clean up (delete the created analyzer)
    if (analyzerCreated && analyzerId) {
      console.log("Step 7: Cleaning up (deleting analyzer)...");
      try {
        const deleteResponse = await client.path("/analyzers/{analyzerId}", analyzerId).delete();
        if (isUnexpected(deleteResponse)) {
          throw deleteResponse.body.error;
        }
        console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!\n`);
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
    console.log("  1. Creating a custom analyzer with field schema");
    console.log("  2. Using the custom analyzer to extract structured fields");
    console.log("  3. Cleaning up by deleting the analyzer\n");
    console.log("Next steps:");
    console.log("  - To retrieve analyzers: see listAnalyzers sample (if available)");
    console.log("  - To analyze with prebuilt analyzers: see analyzeBinary or analyzeUrl samples");
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
