// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * @summary Analyze a PDF file from disk using the prebuilt-documentAnalyzer.
 *
 * Analyze a PDF file from disk using the prebuilt-documentAnalyzer.
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import { ContentUnderstandingClient } from "@azure-rest/ai-content-understanding";
import type { AnalyzeResult, DocumentContent } from "@azure-rest/ai-content-understanding";

// Helper to select credential based on environment
function getCredential(): DefaultAzureCredential | AzureKeyCredential {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

// Print markdown and document info (mirrors C# sample output)
function printAnalysisResult(analyzeResult: AnalyzeResult): void {
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
    const doc = content as DocumentContent;
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
      doc.tables.forEach((table, i: number) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
      console.log("");
    }
  } else {
    console.log("Step 7: Content Information:");
    console.log("  Not a document content type - document-specific information is not available\n");
  }
}

// Main sample logic
async function main(): Promise<void> {
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

    // 3) Read PDF bytes from disk using an explicit __dirname-resolved path (requested format).
    // Compute a safe base directory: prefer __dirname when available, otherwise
    // fall back to the executing script's directory (process.argv[1]) or the
    // repo-relative samples-dev folder. This mirrors the approach used in the
    // other samples so the sample runs reliably across runtimes.
    console.log("Step 3: Reading sample file...");
    const baseDir = ((): string => {
      if (typeof __dirname !== "undefined") return __dirname;
      if (typeof process !== "undefined" && process.argv && process.argv[1]) {
        return path.dirname(process.argv[1]);
      }
      return path.resolve(process.cwd(), "samples-dev");
    })();
    const doc_path = path.resolve(baseDir, "./example-data", "sample_invoice.pdf");

    if (!fs.existsSync(doc_path)) {
      console.error("Error: Sample file not found. Expected file:");
      console.error(`  - ${doc_path}`);
      console.error("\nPlease ensure sample_invoice.pdf exists in the sample's example-data directory.");
      process.exit(1);
    }

    const pdfBytes = fs.readFileSync(doc_path);
    console.log(`  File: ${doc_path}`);
    console.log(`  Size: ${pdfBytes.length.toLocaleString()} bytes\n`);

    // 4) Submit analyze request
    console.log("Step 4: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    console.log("Step 5: Analyzing document...");
    const analyzerId = "prebuilt-documentAnalyzer";
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Analyzing...");

    // Use the analyzeBinary method from the SDK
    const poller = client.analyzeBinary(analyzerId, "application/pdf", pdfBytes);
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
    const operationStatus = await client.getResult(operationId);
    const analyzeResult: AnalyzeResult = operationStatus.result!;

    // 6) Print result
    printAnalysisResult(analyzeResult);

    // No need to manually close the credential - it will be cleaned up automatically

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
  } catch (err: any) {
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
