// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * @summary Analyze a PDF file from disk using the prebuilt-documentSearch and save the raw JSON response.
 *
 * Analyze a PDF file from disk using the prebuilt-documentSearch and save the raw JSON response.
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

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import { ContentUnderstandingClient } from "@azure-rest/ai-content-understanding";

// Helper to select credential based on environment
function getCredential(): DefaultAzureCredential | AzureKeyCredential {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

// Main sample logic
async function main(): Promise<void> {
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
    // Compute a safe base directory and resolve the sample path. Prefer __dirname
    // when available (CommonJS). If it's not available (ESM/TS direct exec),
    // fall back to the executing script's directory or repo-relative samples-dev.
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

    // Step 4: Get the ContentAnalyzers client
    console.log("Step 4: Getting ContentAnalyzers client...");
    console.log("  Client is ready\n");

    // Step 5: Analyze document using the poller
    console.log("Step 5: Analyzing document...");
    const analyzerId = "prebuilt-documentSearch";
    console.log(`  Analyzer: ${analyzerId}`);
    console.log("  Using protocol method to access raw JSON response");
    console.log("  Analyzing...");

    const poller = client.analyzeBinary(analyzerId, "application/pdf", pdfBytes);
    await poller.pollUntilDone();
    console.log("  Analysis completed successfully\n");

    // Step 6: Process raw JSON response
    console.log("Step 6: Processing raw JSON response...");

    // Get the operation ID from the poller to retrieve the full result
    // The poller's operationState contains internal configuration we can use
    const operationLocation = (poller as any).operationState?.config?.operationLocation;
    if (!operationLocation) {
      throw new Error("Could not retrieve operation location from poller");
    }

    const operationIdMatch = operationLocation.match(/analyzerResults\/([^?]+)/);
    if (!operationIdMatch) {
      throw new Error("Could not extract operation ID from operation location");
    }
    const operationId = operationIdMatch[1];

    // Variable to capture raw JSON from onResponse callback
    let rawJson: string | undefined;

    // Get the full operation status which includes the complete result
    await client.getResult(operationId, {
      onResponse: (response) => {
        rawJson = response.bodyAsText;
      },
    });

    // Use the raw JSON captured from onResponse
    if (!rawJson) {
      throw new Error("Failed to capture raw JSON from response");
    }

    // Parse the raw JSON to get the operation status and result
    const operationStatusParsed = JSON.parse(rawJson);
    const result = operationStatusParsed.result;

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), "sample_output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save to file
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")
      .join("_")
      .slice(0, 19);
    const outputFileName = `analyze_result_${timestamp}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, rawJson);

    console.log(`  Raw JSON response saved to: ${outputPath}`);
    console.log(`  File size: ${rawJson.length.toLocaleString()} characters\n`);    // Step 7: Display key information from the response
    console.log("Step 7: Displaying key information from response...");
    if (result.analyzerId) {
      console.log(`  Analyzer ID: ${result.analyzerId}`);
    }

    if (result.contents && result.contents.length > 0) {
      console.log(`  Contents count: ${result.contents.length}`);

      const firstContent = result.contents[0];
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
  } catch (err: any) {
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
