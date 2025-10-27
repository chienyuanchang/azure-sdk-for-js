// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: use the prebuilt-documentAnalyzer to extract content from a PDF and save raw JSON response.
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
 *   node contentAnalyzersAnalyzeBinaryRawJson.js
 */

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DefaultAzureCredential } from "@azure/identity";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";
import { saveJsonToFile } from "./sampleHelper.js";

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

// ---------------------------------------------------------------------------
// Sample: Extract content from PDF using analyze binary API and save raw JSON
// ---------------------------------------------------------------------------
// This sample demonstrates:
// 1. Authenticate with Azure AI Content Understanding
// 2. Read a PDF file from disk
// 3. Analyze the document using prebuilt-documentAnalyzer
// 4. Save the raw JSON response to a file
//
// IMPORTANT NOTES:
// - The SDK returns analysis results with an object model, which is easier to navigate and retrieve
//   the desired results compared to parsing raw JSON
// - This sample is ONLY for demonstration purposes to show how to access raw JSON responses
// - For production use, prefer the object model approach shown in:
//   - contentAnalyzersAnalyzeBinary.js

const main = async () => {
  // 1. Authenticate with Azure AI Content Understanding
  const endpoint = process.env.AZURE_CONTENT_UNDERSTANDING_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      "Please set AZURE_CONTENT_UNDERSTANDING_ENDPOINT in your environment (or in .env).",
    );
  }
  const credential = await getCredential();

  // 2. Read a PDF file from disk
  const samplePath = path.join(__dirname, "..", "..", "..", "sample_files", "sample_invoice.pdf");
  if (!fs.existsSync(samplePath)) {
    console.error("Sample PDF not found:", samplePath);
    console.error("Put a PDF at sample_files/sample_invoice.pdf and re-run the sample.");
    process.exit(1);
  }
  const pdfBytes = fs.readFileSync(samplePath);

  // 3. Analyze the document using prebuilt-documentAnalyzer
  const client = createClient(endpoint, credential);
  const analyzerId = "prebuilt-documentAnalyzer";
  console.log(`🔍 Analyzing sample_files/sample_invoice.pdf with prebuilt-documentAnalyzer...`);

  // Submit analysis request
  let initialResponse;
  try {
    initialResponse = await client.path(`/analyzers/${analyzerId}:analyze`, analyzerId).post({
      contentType: "application/pdf",
      body: pdfBytes,
    });
  } catch (err) {
    console.error("Failed to submit analysis request:", err);
    process.exit(1);
  }

  // 4. Poll for result and save raw JSON response
  if (["202", 202, "200", 200].includes(initialResponse.status)) {
    try {
      const poller = await getLongRunningPoller(client, initialResponse);
      const pollResult = await poller.pollUntilDone();

      // Save the raw JSON response
      // pollResult.body contains the raw response object
      saveJsonToFile(pollResult.body, "test_output", "content_analyzers_analyze_binary");

      // Note: For easier data access, see object model samples:
      //    contentAnalyzersAnalyzeBinary.js

      console.log("✅ Analysis completed and raw JSON response saved!");
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
if ((typeof require !== "undefined" && require.main === module) || import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
