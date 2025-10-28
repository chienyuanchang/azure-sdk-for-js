// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: use the prebuilt-documentAnalyzer to extract content from a URL.
 *
 * Prerequisites:
 *   npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional - DefaultAzureCredential() will be used if not set)
 *   These variables can be set in a .env file in the samples directory for repeated use. Please see sample.env for an example.
 *
 * Run:
 *   node contentAnalyzersAnalyzeUrl.js
 */

import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";

// Load environment variables from .env file
dotenv.config();

// ---------------------------------------------------------------------------
// Sample: Extract content from URL using begin_analyze API
// ---------------------------------------------------------------------------
// This sample demonstrates:
// 1. Authenticate with Azure AI Content Understanding
// 2. Analyze a document from a remote URL using begin_analyze with prebuilt-documentAnalyzer
// 3. Print the markdown content from the analysis result

/**
 * Print analysis result with markdown and document info
 * @param {any} result - The AnalyzeResult from the API
 */
const printAnalysisResult = (result) => {
  if (!result?.contents?.length) {
    console.log("No contents found in result:", JSON.stringify(result, null, 2));
    return;
  }

  // AnalyzeResult contains the full analysis result and can be used to access various properties
  // We are using markdown content as an example of what can be extracted
  console.log("\n📄 Markdown Content:");
  console.log("=".repeat(50));
  // A PDF file has only one content element even if it contains multiple pages
  const content = result.contents[0];
  console.log(content.markdown || "(no markdown)");
  console.log("=".repeat(50));

  // Check if this is document content to access document-specific properties
  if (content.kind === "document") {
    const doc = content;
    console.log(`\n📚 Document Information:`);
    console.log(`Start page: ${doc.startPageNumber}`);
    console.log(`End page: ${doc.endPageNumber}`);
    console.log(`Total pages: ${doc.endPageNumber - doc.startPageNumber + 1}`);

    // Check for pages
    if (doc.pages?.length) {
      console.log(`\n📄 Pages (${doc.pages.length}):`);
      doc.pages.forEach((page) => {
        const unit = doc.unit || "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      });
    }

    // The following code shows how to access DocumentContent properties
    // Check if there are tables in the document
    if (doc.tables?.length) {
      console.log(`\n📊 Tables (${doc.tables.length}):`);
      let tableCounter = 1;
      // Iterate through tables, each table is of type DocumentTable
      doc.tables.forEach((table) => {
        // Get basic table dimensions
        const rowCount = table.rowCount;
        const colCount = table.columnCount;
        console.log(`  Table ${tableCounter}: ${rowCount} rows x ${colCount} columns`);
        tableCounter += 1;
        // You can use the table object model to get detailed information
        // such as cell content, borders, spans, etc. (not shown to keep code concise)
      });
    }
  } else {
    console.log("\n📚 Document Information: Not available for this content type");
  }

  // Uncomment the following line to save the response to a file for object model inspection
  // Note: This saves the object model, not the raw JSON response
  // To get the full raw JSON response, see the sample: contentAnalyzersAnalyzeBinaryRawJson.js
  // import { saveJsonToFile } from "./sampleHelper.js";
  // saveJsonToFile(result, "test_output", "content_analyzers_analyze_url");
};

/**
 * Main function to run the sample
 */
const main = async () => {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      "Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env).",
    );
  }

  // Return AzureKeyCredential if AZURE_CONTENT_UNDERSTANDING_KEY is set, otherwise DefaultAzureCredential
  const key = process.env.AZURE_CONTENT_UNDERSTANDING_KEY;
  const credential = key ? new AzureKeyCredential(key) : new DefaultAzureCredential();

  const client = createClient(endpoint, credential);

  try {
    // 2. Analyze a document from a remote URL using begin_analyze with prebuilt-documentAnalyzer
    const fileUrl =
      "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
    console.log(`🔍 Analyzing remote document from ${fileUrl} with prebuilt-documentAnalyzer...`);

    const analyzerId = "prebuilt-documentAnalyzer";
    const initialResponse = await client.path(`/analyzers/{analyzerId}:analyze`, analyzerId).post({
      body: {
        url: fileUrl,
      },
    });

    // Poll for the result
    if (!["202", 202, "200", 200].includes(initialResponse.status)) {
      console.error("Unexpected initial response status:", initialResponse.status);
      console.error(initialResponse.body);
      return;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const pollResult = await poller.pollUntilDone();
    const result = pollResult.body?.result ?? pollResult.body;

    // 3. Print the markdown content from the analysis result
    printAnalysisResult(result);
  } finally {
    // Manually close DefaultAzureCredential if it was used
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }
  }
};

// Entry point
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
