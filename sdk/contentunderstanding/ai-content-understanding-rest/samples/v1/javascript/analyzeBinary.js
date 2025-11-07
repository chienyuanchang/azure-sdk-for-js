// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Analyze a PDF file from disk using the prebuilt-documentAnalyzer.
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

// Print markdown and document info (mirrors C# sample output)
function printAnalysisResult(analyzeResult) {
  if (!analyzeResult?.contents || analyzeResult.contents.length === 0) {
    console.log("(No content returned from analysis)");
    return;
  }

  const content = analyzeResult.contents[0];

  console.log("Step 6: Displaying markdown content...");
  console.log("=============================================================");
  console.log(content.markdown ?? "(No markdown content available)");
  console.log("=============================================================\n");

  if (content?.kind === "document") {
    const doc = content;
    console.log("Step 7: Displaying document information...");
    console.log(`  Document type: ${doc.mimeType ?? "(unknown)"}`);
    console.log(`  Start page: ${doc.startPageNumber}`);
    console.log(`  End page: ${doc.endPageNumber}`);
    console.log(`  Total pages: ${doc.endPageNumber - doc.startPageNumber + 1}`);
    console.log("");

    if (doc.pages && doc.pages.length > 0) {
      console.log("Step 8: Displaying page information...");
      console.log(`  Number of pages: ${doc.pages.length}`);
      for (const page of doc.pages) {
        const unit = doc.unit ?? "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      }
      console.log("");
    }

    if (doc.tables && doc.tables.length > 0) {
      console.log("Step 9: Displaying table information...");
      console.log(`  Number of tables: ${doc.tables.length}`);
      doc.tables.forEach((table, i) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
      console.log("");
    }
  } else {
    console.log("Step 7: Content Information:");
    console.log("  Not a document content type - document-specific information is not available\n");
  }
}

async function main() {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Analyze Binary");
  console.log("=============================================================\n");

  try {
    // 1) Load endpoint and choose credential
    console.log("Step 1: Loading configuration...");
    const endpoint = (process.env["AZURE_CONTENT_UNDERSTANDING_ENDPOINT"] || "").trim();
    if (!endpoint) {
      throw new Error(
        "AZURE_CONTENT_UNDERSTANDING_ENDPOINT is required. Set it in your environment or .env file.",
      );
    }
    console.log(`  Endpoint: ${endpoint}\n`);

    console.log("Step 2: Creating Content Understanding client...");
    const credential = getCredential();
    console.log(
      `  Authentication: ${credential instanceof DefaultAzureCredential ? "DefaultAzureCredential" : "API Key"}`,
    );
    const client = new ContentUnderstandingClient(endpoint, credential);
    console.log("  Client created successfully\n");

    // 3) Read PDF bytes from disk (try common locations)
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

    // 4) Submit analyze request
    console.log("Step 4: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    console.log("Step 5: Analyzing document...");
    const analyzerId = "prebuilt-documentAnalyzer";
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Analyzing...");

    // Use the analyzeBinary method from the SDK
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


    // Print result using object model
    printAnalysisResult(analyzeResult);

    // No need to manually close the credential - it will be cleaned up automatically

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
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
