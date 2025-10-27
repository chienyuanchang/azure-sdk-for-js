
// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: use the prebuilt-documentAnalyzer to extract content from a PDF.
 *
 * Prerequisites:
 *   npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Place a sample PDF at samples/javascript/sample_files/sample_invoice.pdf
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional)
 *   These variables can be set in a .env file in the samples directory for repeated use.
 *
 * Run:
 *   node contentAnalyzersAnalyzeBinary.js
 */


import dotenv from "dotenv";
dotenv.config();


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DefaultAzureCredential } from "@azure/identity";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";


// Helper to pause for polling (not used, can be removed if unnecessary)
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Helper to select credential based on environment
const getCredential = async () => {
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  if (key) {
    // Lazy import to avoid requiring @azure/core-auth for AAD samples
    const { AzureKeyCredential } = await import("@azure/core-auth");
    return new AzureKeyCredential(key);
  }
  return new DefaultAzureCredential();
};


// Print markdown and document info, matching Python sample's clarity
const printAnalysisResult = (analyzeResult) => {
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
      doc.pages.forEach((page) => {
        const unit = doc.unit || "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      });
    }

    if (doc.tables?.length) {
      console.log(`\n📊 Tables (${doc.tables.length}):`);
      doc.tables.forEach((table, i) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
    }
  } else {
    console.log("\n📚 Document Information: Not available for this content type");
  }
};


// Main sample logic
const main = async () => {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error("Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env).");
  }
  const credential = await getCredential();

  // 2. Read a PDF file from disk
  const samplePath = path.join(__dirname, "..", "..", "..", "sample_files", "sample_invoice.pdf");
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
  let initialResponse;
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
  if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
    await credential.close();
  }
};


// Entry point check for both ESM and CommonJS
if (typeof require !== "undefined" && require.main === module || import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
