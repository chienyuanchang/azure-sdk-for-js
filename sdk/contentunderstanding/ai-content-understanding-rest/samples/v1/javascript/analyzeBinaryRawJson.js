// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Analyze a PDF file from disk using the prebuilt-documentAnalyzer and save the raw JSON response.
 *
 * IMPORTANT NOTES:
 * - The SDK returns analysis results with an object model, which is easier to navigate and retrieve
 *   the desired results compared to parsing raw JSON
 * - This sample is ONLY for demonstration purposes to show how to access raw JSON responses
 * - For production use, prefer the object model approach shown in analyzeBinary.js
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

const fs = require("fs");
const path = require("path");
const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const ContentUnderstanding = require("@azure-rest/ai-content-understanding").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-content-understanding");
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
    // Step 1: Load configuration from environment
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

    // Step 5: Analyze document using protocol method to get raw response
    console.log("Step 5: Analyzing document...");
    const analyzerId = "prebuilt-documentAnalyzer";
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Using protocol method to access raw JSON response");
    console.log("  Analyzing...");

    const initialResponse = await client
      .path("/analyzers/{analyzerId}:analyzeBinary", analyzerId)
      .post({
        body: pdfBytes,
        contentType: "application/pdf",
        headers: { "Content-Type": "application/pdf" },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const pollResult = await poller.pollUntilDone();
    console.log("  Analysis completed successfully\n");

    // Step 6: Parse and pretty-print the raw JSON
    console.log("Step 6: Processing raw JSON response...");

    // The poll result contains the full response body
    const responseBody = pollResult.body;

    // Pretty-print the JSON
    const prettyJson = JSON.stringify(responseBody, null, 2);

    // Create output directory if it doesn't exist
    const outputDir = "sample_output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split(".")[0];
    const outputFileName = `analyze_result_${timestamp}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, prettyJson);

    console.log(`  Raw JSON response saved to: ${outputPath}`);
    console.log(`  File size: ${prettyJson.length.toLocaleString()} characters\n`);

    // Step 7: Display some key information from the response
    console.log("Step 7: Displaying key information from response...");
    const result = responseBody.result;

    if (result?.analyzerId) {
      console.log(`  Analyzer ID: ${result.analyzerId}`);
    }

    if (result?.contents && Array.isArray(result.contents)) {
      console.log(`  Contents count: ${result.contents.length}`);

      if (result.contents.length > 0) {
        const firstContent = result.contents[0];
        if (firstContent.kind) {
          console.log(`  Content kind: ${firstContent.kind}`);
        }
        if (firstContent.mimeType) {
          console.log(`  MIME type: ${firstContent.mimeType}`);
        }
      }
    }
    console.log();

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("NOTE: For easier data access, prefer using the object model");
    console.log("      approach shown in the analyzeBinary.js sample instead of");
    console.log("      parsing raw JSON manually.");

    // Try to close DAC if supported
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }
  } catch (err) {
    console.error();
    console.error("✗ An error occurred");
    console.error("  ", err?.message ?? err);
    if (err?.status) {
      console.error(`  Status: ${err.status}`);
    }
    if (err?.code) {
      console.error(`  Error Code: ${err.code}`);
    }
    process.exit(1);
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
