// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Analyze a document from a URL using the prebuilt-documentAnalyzer.
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import ContentUnderstanding, {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-content-understanding";

// Helper to select credential based on environment
function getCredential(): DefaultAzureCredential | AzureKeyCredential {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

// Print markdown and document info (mirrors C# sample output)
function printAnalysisResult(analyzeResult: any): void {
  if (!analyzeResult?.contents || analyzeResult.contents.length === 0) {
    console.log("(No content returned from analysis)");
    return;
  }

  const content = analyzeResult.contents[0];

  console.log("Step 5: Displaying markdown content...");
  console.log("=============================================================");
  console.log(content.markdown ?? "(No markdown content available)");
  console.log("=============================================================\n");

  if (content?.kind === "document") {
    const doc = content;
    console.log("Step 6: Displaying document information...");
    console.log(`  Document type: ${doc.mimeType ?? "(unknown)"}`);
    console.log(`  Start page: ${doc.startPageNumber}`);
    console.log(`  End page: ${doc.endPageNumber}`);
    console.log(`  Total pages: ${doc.endPageNumber - doc.startPageNumber + 1}`);
    console.log("");

    if (doc.pages && doc.pages.length > 0) {
      console.log("Step 7: Displaying page information...");
      console.log(`  Number of pages: ${doc.pages.length}`);
      for (const page of doc.pages) {
        const unit = doc.unit ?? "units";
        console.log(`  Page ${page.pageNumber}: ${page.width} x ${page.height} ${unit}`);
      }
      console.log("");
    }

    if (doc.tables && doc.tables.length > 0) {
      console.log("Step 8: Displaying table information...");
      console.log(`  Number of tables: ${doc.tables.length}`);
      doc.tables.forEach((table: any, i: number) => {
        console.log(`  Table ${i + 1}: ${table.rowCount} rows x ${table.columnCount} columns`);
      });
      console.log("");
    }
  } else {
    console.log("Step 6: Content Information:");
    console.log("  Not a document content type - document-specific information is not available\n");
  }
}

// Main sample logic
async function main(): Promise<void> {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Analyze URL");
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
    const client = ContentUnderstanding(endpoint, credential);
    console.log("  Client created successfully\n");

    // Step 3: Get the ContentAnalyzers client
    console.log("Step 3: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    // Step 4: Analyze document from URL
    console.log("Step 4: Analyzing document from URL...");
    const fileUrl =
      "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
    const analyzerId = "prebuilt-documentAnalyzer";
    console.log(`  URL: ${fileUrl}`);
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Analyzing...");

    // Submit analyze request with URL input
    const initialResponse = await client.path("/analyzers/{analyzerId}:analyze", analyzerId).post({
      body: {
        inputs: [{ url: fileUrl }],
      },
    });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const pollResult = await poller.pollUntilDone();
    const analyzeResult = (pollResult as any).body?.result ?? (pollResult as any).body;

    console.log("  Analysis completed successfully");
    console.log(
      `  Result: AnalyzerId=${analyzeResult.analyzerId}, Contents count=${analyzeResult.contents?.length ?? 0}`,
    );
    console.log("");

    // Step 5-8: Print result
    printAnalysisResult(analyzeResult);

    // Try to close DAC if supported
    if (
      credential instanceof DefaultAzureCredential &&
      typeof (credential as any).close === "function"
    ) {
      await (credential as any).close();
    }

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
