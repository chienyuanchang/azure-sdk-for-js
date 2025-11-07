// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Analyze a PDF file from disk using the prebuilt-documentAnalyzer and save the raw JSON response.
 *
 * IMPORTANT NOTES:
 * - The SDK returns analysis results with an object model, which is easier to navigate and retrieve
 *   the desired results compared to parsing raw JSON
 * - This sample is ONLY for demonstration purposes to show how to access raw JSON responses
 * - For production use, prefer the object model approach shown in the analyzeBinary sample
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

const fs = require("fs");
const path = require("path");
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
  console.log("Azure Content Understanding Sample: Analyze Binary (Raw JSON)");
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
    const client = new ContentUnderstandingClient(endpoint, credential);
    console.log("  Client created successfully\n");

    // Step 3: Read the PDF file
    console.log("Step 3: Reading PDF file...");
    const possiblePaths = [
      // Package root sample_files (preferred)
      path.join(__dirname, "..", "..", "..", "sample_files", "sample_invoice.pdf"),
      // When copied next to this sample folder
      path.join(__dirname, "sample_files", "sample_invoice.pdf"),
      // From current working directory
      path.join(process.cwd(), "sample_files", "sample_invoice.pdf"),
    ];

    let pdfPath;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        pdfPath = p;
        break;
      }
    }

    if (!pdfPath) {
      console.error("Error: Sample file not found. Searched in the following locations:");
      for (const p of possiblePaths) {
        console.error(`  - ${path.resolve(p)}`);
      }
      console.error("\nPlease ensure sample_invoice.pdf exists in a sample_files directory.");
      process.exit(1);
    }

    const pdfBytes = fs.readFileSync(pdfPath);
    console.log(`  File: ${pdfPath}`);
    console.log(`  Size: ${pdfBytes.length.toLocaleString()} bytes\n`);

    // Step 4: Get the ContentAnalyzers client
    console.log("Step 4: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    // Step 5: Analyze document using the poller
    console.log("Step 5: Analyzing document...");
    const analyzerId = "prebuilt-documentAnalyzer";
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Using protocol method to access raw JSON response");
    console.log("  Analyzing...");

    const poller = client.contentAnalyzers.analyzeBinary(analyzerId, "application/pdf", pdfBytes);
    await poller.pollUntilDone();
    console.log("  Analysis completed successfully\n");

    // Step 6: Process raw JSON response
    console.log("Step 6: Processing raw JSON response...");

    // Get the operation ID from the poller to retrieve the full result
    const operationLocation = poller.operationState.config.operationLocation;
    const operationIdMatch = operationLocation.match(/analyzerResults\/([^?]+)/);
    if (!operationIdMatch) {
      throw new Error("Could not extract operation ID from operation location");
    }
    const operationId = operationIdMatch[1];

    // Get the full operation status which includes the complete result
    const operationStatus = await client.contentAnalyzers.getResult(operationId);
    const analyzeResult = operationStatus.result;

    // Convert the result object to JSON string
    const rawJson = JSON.stringify(analyzeResult, null, 2);

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "sample_output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T").join("_").slice(0, 19);
    const outputFileName = `analyze_result_${timestamp}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, rawJson);

    console.log(`  Raw JSON response saved to: ${outputPath}`);
    console.log(`  File size: ${rawJson.length.toLocaleString()} characters\n`);

    // Step 7: Display key information from the response
    console.log("Step 7: Displaying key information from response...");
    if (analyzeResult.analyzerId) {
      console.log(`  Analyzer ID: ${analyzeResult.analyzerId}`);
    }

    if (analyzeResult.contents && analyzeResult.contents.length > 0) {
      console.log(`  Contents count: ${analyzeResult.contents.length}`);

      const firstContent = analyzeResult.contents[0];
      if (firstContent.kind) {
        console.log(`  Content kind: ${firstContent.kind}`);
      }
      if (firstContent.mimeType) {
        console.log(`  MIME type: ${firstContent.mimeType}`);
      }
    }
    console.log("");

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("NOTE: For easier data access, prefer using the object model");
    console.log("      approach shown in the analyzeBinary sample instead of");
    console.log("      parsing raw JSON manually.");
  } catch (err) {
    console.error();
    console.error("✗ An error occurred");
    console.error("  ", err?.message ?? err);
    if (err?.statusCode === 401) {
      console.error("  Please check your credentials and ensure they are valid.");
    }
    process.exit(1);
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
