// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Create a custom analyzer with field schema, use it to analyze a document, and clean up.
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
  console.log("Azure Content Understanding Sample: Create Custom Analyzer");
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

    // Step 4: Define the custom analyzer
    console.log("Step 4: Defining custom analyzer...");

    // Generate a unique analyzer ID using timestamp
    // Note: Analyzer IDs cannot contain hyphens
    const analyzerId = `sdk_sample_custom_analyzer_${Math.floor(Date.now() / 1000)}`;
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
    const customAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Custom analyzer for extracting company information",
      config: config,
      fieldSchema: fieldSchema,
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

    let result = null;
    let created = false;
    try {
      const poller = client.createOrReplace(analyzerId, customAnalyzer);
      result = await poller.pollUntilDone();
      created = true;
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Created at: ${new Date(result.createdAt).toUTCString()}`);
      console.log("");
    } catch (error) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 6: Use the analyzer to analyze an invoice
    if (created && result) {
      console.log("Step 6: Using the custom analyzer to analyze an invoice...");
      const fileUrl = "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
      console.log(`  URL: ${fileUrl}`);
      console.log("  Analyzing...");

      try {
        const analyzePoller = client.analyze(analyzerId, {
          inputs: [{ url: fileUrl }],
        });
        await analyzePoller.pollUntilDone();

        // Extract operation ID from the operation location to get the full result
        const operationLocation = analyzePoller.operationState.config.operationLocation;
        const url = new URL(operationLocation);
        const operationId = url.pathname.split("/").pop().split("?")[0];

        // Get the complete result with all data
        const operationStatus = await client.getResult(operationId);
        const analyzeResult = operationStatus.result;

        console.log("  ✅ Analysis completed successfully!");
        console.log("");

        // Display extracted custom fields
        if (analyzeResult?.contents && analyzeResult.contents.length > 0) {
          const content = analyzeResult.contents[0];
          if (content?.fields && Object.keys(content.fields).length > 0) {
            console.log("  📋 Extracted Custom Fields:");
            console.log("  " + "-".padEnd(38, "-"));

            // Extract the custom fields we defined
            if (content.fields.company_name) {
              const companyName = content.fields.company_name?.valueString ?? "(not found)";
              console.log(`    Company Name: ${companyName}`);
            }

            if (content.fields.total_amount) {
              const totalAmount = content.fields.total_amount?.valueNumber;
              const formattedAmount = totalAmount ? totalAmount.toFixed(2) : "(not found)";
              console.log(`    Total Amount: ${formattedAmount}`);
            }

            console.log("");
          } else {
            console.log("  No fields extracted");
            console.log("");
          }
        }
      } catch (error) {
        console.error(`  Failed to analyze with custom analyzer: ${error.message}`);
        // Continue to cleanup even if analysis fails
      }
    }

    // Step 7: Clean up (delete the created analyzer)
    if (created && result) {
      console.log("Step 7: Cleaning up (deleting analyzer)...");
      try {
        await client.delete(analyzerId);
        console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!`);
        console.log("");
      } catch (error) {
        console.error(`  Failed to delete analyzer: ${error.message}`);
        // Don't throw - cleanup failure shouldn't fail the sample
      }
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
    console.log("");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a custom analyzer with field schema");
    console.log("  2. Using the custom analyzer to extract structured fields");
    console.log("  3. Cleaning up by deleting the analyzer");
    console.log("");
    console.log("Next steps:");
    console.log("  - To retrieve analyzers: see listAnalyzers sample");
    console.log("  - To analyze with prebuilt analyzers: see analyzeBinary or analyzeUrl samples");
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
