
// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: use the prebuilt-documentAnalyzer to extract content from a PDF.
 *
 * Prerequisites:
 *   pnpm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Place a sample PDF at samples/javascript/sample_files/sample_invoice.pdf
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional)
 *   These variables can be set in a .env file in the typescript directory for repeated use.
 *
 * Run:
 *   pnpm ts-node sampleAnalyzeBinary.ts
 */

import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { DefaultAzureCredential } from "@azure/identity";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";

// Polyfill __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Helper to select credential based on environment
const getCredential = async (): Promise<DefaultAzureCredential | { key: string }> => {
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  if (key) {
    // Lazy import to avoid requiring @azure/core-auth for AAD samples
    const { AzureKeyCredential } = await import("@azure/core-auth");
    return new AzureKeyCredential(key);
  }
  return new DefaultAzureCredential();
};

// Print markdown and document info, matching JS sample's clarity
const printAnalysisResult = (analyzeResult: any): void => {
  if (!analyzeResult?.contents?.length) {
    console.log("No contents found in result:", JSON.stringify(analyzeResult, null, 2));
    return;
  }
  const content = analyzeResult.contents[0];
  console.log("\n📄 Markdown Content:");
  console.log("=".repeat(50));
  console.log(content.markdown || "(no markdown)");
  console.log("=".repeat(50));

  if (content.kind === "document") {
    const doc = content;
    console.log(`\n📚 Document Information:`);
    console.log(`Start page: ${doc.startPageNumber}`);
    console.log(`End page: ${doc.endPageNumber}`);
    console.log(`Total pages: ${doc.endPageNumber - doc.startPageNumber + 1}`);

    if (doc.pages?.length) {
      console.log(`\n📄 Pages (${doc.pages.length}):`);
      doc.pages.forEach((page: any) => {
        const unit = doc.unit || "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      });
    }

    if (doc.tables?.length) {
      console.log(`\n📊 Tables (${doc.tables.length}):`);
      doc.tables.forEach((table: any, i: number) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
    }
  } else {
    console.log("\n📚 Document Information: Not available for this content type");
  }
};

// Main sample logic
const main = async (): Promise<void> => {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error("Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env).");
  }
  const credential = await getCredential();

  // 2. Read a PDF file from disk
  const samplePath = path.join(__dirname, "..", "..", "..", "..", "sample_files", "sample_invoice.pdf");
  if (!fs.existsSync(samplePath)) {
    console.error("Sample PDF not found:", samplePath);
    console.error("Put a PDF at samples/javascript/sample_files/sample_invoice.pdf and re-run the sample.");
    process.exit(1);
  }
  const pdfBytes = fs.readFileSync(samplePath);

  // 3. Analyze the document using prebuilt-documentAnalyzer
  const client = createClient(endpoint, credential);
  const analyzerId = "prebuilt-documentAnalyzer";
  console.log(`🔍 Analyzing ${samplePath} with prebuilt-documentAnalyzer...`);

  // Submit analysis request
  let initialResponse: any;
  try {
    initialResponse = await client
      .path(`/analyzers/${analyzerId}:analyze`, analyzerId)
      .post({
        contentType: "application/pdf",
        body: pdfBytes,
      });
  } catch (err) {
    console.error("Failed to submit analysis request:", err);
    process.exit(1);
  }

  // 4. Poll for result and print output using SDK poller helper
  if (["202", 202, "200", 200].includes(initialResponse.status)) {
    try {
      const poller = await getLongRunningPoller(client, initialResponse);
      const pollResult = await poller.pollUntilDone();
      const analyzeResult = pollResult.body?.result ?? pollResult.body;
      printAnalysisResult(analyzeResult);
    } catch (err) {
      console.error("Error during polling or result processing:", err);
    }
  } else {
    console.error("Unexpected initial response status:", initialResponse.status);
    console.error(initialResponse.body);
  }

  // Manually close DefaultAzureCredential if it was used
  if (credential instanceof DefaultAzureCredential && typeof (credential as any).close === "function") {
    await (credential as any).close();
  }
};

// Entry point check for ESM
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
