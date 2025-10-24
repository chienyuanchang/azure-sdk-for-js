
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
 *   node content_analyzers_analyze_binary.js
 */

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DefaultAzureCredential } from "@azure/identity";
import createClient from "@azure-rest/ai-content-understanding";

// Helper to pause for polling
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to select credential based on environment
async function getCredential() {
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  if (key) {
    // Lazy import to avoid requiring @azure/core-auth for AAD samples
    const { AzureKeyCredential } = await import("@azure/core-auth");
    return new AzureKeyCredential(key);
  } else {
    return new DefaultAzureCredential();
  }
}

// Print markdown and document info, matching Python sample's clarity
function printAnalysisResult(analyzeResult) {
  if (!analyzeResult?.contents || analyzeResult.contents.length === 0) {
    console.log("No contents found in result:", JSON.stringify(analyzeResult, null, 2));
    return;
  }
  const content = analyzeResult.contents[0];
  console.log("\n📄 Markdown Content:");
  console.log("=".repeat(50));
  console.log(content.markdown || "(no markdown)");
  console.log("=".repeat(50));

  // Check if this is document content to access document-specific properties
  if (content.kind === "document") {
    const doc = content;
    console.log(`\n📚 Document Information:`);
    console.log(`Start page: ${doc.startPageNumber}`);
    console.log(`End page: ${doc.endPageNumber}`);
    console.log(`Total pages: ${doc.endPageNumber - doc.startPageNumber + 1}`);

    if (doc.pages) {
      console.log(`\n📄 Pages (${doc.pages.length}):`);
      doc.pages.forEach((page) => {
        const unit = doc.unit || "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      });
    }

    if (doc.tables) {
      console.log(`\n📊 Tables (${doc.tables.length}):`);
      doc.tables.forEach((table, i) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
    }
  } else {
    console.log("\n📚 Document Information: Not available for this content type");
  }
}

// Main sample logic
async function main() {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      "Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env)."
    );
  }
  const credential = await getCredential();

  // 2. Read a PDF file from disk
  const samplePath = path.join(__dirname, "..", "sample_files", "sample_invoice.pdf");
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
  const initialResponse = await client
    .path(`/analyzers/${analyzerId}:analyze`, analyzerId)
    .post({
      contentType: "application/pdf",
      body: pdfBytes,
    });

  // 4. Poll for result and print output
  if (initialResponse.status === "202" || initialResponse.status === 202) {
    const opLocation =
      initialResponse.headers["operation-location"] || initialResponse.headers["Operation-Location"];
    if (!opLocation) {
      console.error("operation-location header missing on 202 response");
      process.exit(1);
    }
    console.log("Operation accepted. Polling until complete...");
    while (true) {
      await sleep(1000);
      const pollResp = await client.pathUnchecked(opLocation).get();
      if (pollResp.status === "200" || pollResp.status === 200) {
        const body = pollResp.body;
        // Check for LRO status in body
        const status = body?.status || body?.result?.status;
        if (status && status.toLowerCase() === "running") {
          console.log(`Polling... operation status: ${status}`);
          continue;
        }
        const analyzeResult = body?.result ?? body;
        printAnalysisResult(analyzeResult);
        break;
      } else {
        console.log(`Polling... status: ${pollResp.status}`);
      }
    }
  } else if (initialResponse.status === "200" || initialResponse.status === 200) {
    const analyzeResult = initialResponse.body?.result ?? initialResponse.body;
    printAnalysisResult(analyzeResult);
  } else {
    console.error("Unexpected initial response status:", initialResponse.status);
    console.error(initialResponse.body);
  }

  // Manually close DefaultAzureCredential if it was used
  if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
    await credential.close();
  }
}

if (import.meta.main || require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
