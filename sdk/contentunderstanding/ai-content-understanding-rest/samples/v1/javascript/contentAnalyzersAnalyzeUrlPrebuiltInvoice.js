// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Async sample: use the prebuilt-invoice analyzer to extract invoice fields from a URL.
 *
 * Prerequisites:
 *   npm install @azure-rest/ai-content-understanding @azure/identity @azure/core-auth dotenv
 *   Set environment variable AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   Optionally set AZURE_CONTENT_UNDERSTANDING_KEY (otherwise DefaultAzureCredential will be used)
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional - DefaultAzureCredential() will be used if not set)
 *   These variables can be set in a .env file in the javascript directory for repeated use. Please see sample.env for an example.
 *
 * Run:
 *   node contentAnalyzersAnalyzeUrlPrebuiltInvoice.js
 */

import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import createClient, { getLongRunningPoller } from "@azure-rest/ai-content-understanding";
import { saveJsonToFile, getFieldValue } from "./sampleHelper.js";

// Load environment variables from .env file
dotenv.config();

// ---------------------------------------------------------------------------
// Sample: Extract invoice fields from URL using begin_analyze API with prebuilt-invoice
// ---------------------------------------------------------------------------
// This sample demonstrates:
// 1. Authenticate with Azure AI Content Understanding
// 2. Analyze an invoice from a remote URL using begin_analyze with prebuilt-invoice analyzer
// 3. Save the complete analysis result to JSON file
// 4. Show examples of extracting different field types (string, number, object, array)

/**
 * Analyze an invoice and display the extracted fields.
 * @param {any} client - The Content Understanding client
 */
const analyzeInvoice = async (client) => {
  const fileUrl =
    "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
  console.log(`🔍 Analyzing invoice from ${fileUrl} with prebuilt-invoice analyzer...`);

  // Submit the analysis request with URL
  const analyzerId = "prebuilt-invoice";
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

  // AnalyzeResult contains the full analysis result and can be used to access various properties
  console.log("\n📄 Invoice Analysis Result:");
  console.log("=".repeat(50));

  // A PDF file has only one content element even if it contains multiple pages
  const content = result.contents[0];

  if (!content.fields) {
    console.log("No fields found in the analysis result");
    return;
  }

  console.log("\n📋 Sample Field Extractions:");
  console.log("-".repeat(40));

  // Example 1: Simple string fields
  const customerName = getFieldValue(content.fields, "CustomerName");
  const invoiceTotal = getFieldValue(content.fields, "InvoiceTotal");
  const invoiceDate = getFieldValue(content.fields, "InvoiceDate");

  console.log(`Customer Name: ${customerName ?? "(None)"}`);
  console.log(`Invoice Total: $${invoiceTotal ?? "(None)"}`);
  console.log(`Invoice Date: ${invoiceDate ?? "(None)"}`);

  // Example 2: Array field (Items)
  const items = getFieldValue(content.fields, "Items");
  console.log(`\n🛒 Invoice Items (Array):`);
  if (items) {
    items.forEach((item, i) => {
      // item is an ObjectField, extract its valueObject
      const itemObj = item.valueObject;
      if (itemObj) {
        console.log(`  Item ${i + 1}:`);

        // Extract common item fields using helper function
        const description = getFieldValue(itemObj, "Description");
        const quantity = getFieldValue(itemObj, "Quantity");
        const unitPrice = getFieldValue(itemObj, "UnitPrice");
        const totalPrice = getFieldValue(itemObj, "TotalPrice");

        console.log(`    Description: ${description ?? "N/A"}`);
        console.log(`    Quantity: ${quantity ?? "N/A"}`);
        console.log(`    Unit Price: $${unitPrice ?? "N/A"}`);
        console.log(`    Total Price: $${totalPrice ?? "N/A"}`);
      } else {
        console.log(`  Item ${i + 1}: No item object found`);
      }
    });
  } else {
    console.log("  No items found");
  }

  console.log(`\n📄 Total fields extracted: ${Object.keys(content.fields).length}`);

  // Save the full result to JSON for detailed inspection
  saveJsonToFile(
    result,
    "test_output",
    "content_analyzers_analyze_url_prebuilt_invoice",
  );
  console.log("✅ Invoice fields saved to JSON file for detailed inspection");
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
    await analyzeInvoice(client);
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
