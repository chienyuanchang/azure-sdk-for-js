// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Analyze an invoice from a URL using the prebuilt-invoice analyzer and extract structured fields.
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import { ContentUnderstandingClient } from "@azure-rest/ai-content-understanding";
import type { AnalyzeResult, ContentField } from "@azure-rest/ai-content-understanding";
import * as fs from "fs";
import * as path from "path";

// Helper to select credential based on environment
function getCredential(): DefaultAzureCredential | AzureKeyCredential {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

/**
 * Helper method to extract the value from a ContentField.
 */
function getFieldValue<T>(
  fields: Record<string, ContentField> | undefined,
  fieldName: string,
): T | undefined {
  if (!fields || !fields[fieldName]) {
    return undefined;
  }

  const field = fields[fieldName];

  switch (field.type) {
    case "string":
      if (typeof (field as any).valueString !== "undefined") {
        return (field as any).valueString as T;
      }
      break;
    case "number":
      if (typeof (field as any).valueNumber !== "undefined") {
        return (field as any).valueNumber as T;
      }
      break;
    case "integer":
      if (typeof (field as any).valueInteger !== "undefined") {
        return (field as any).valueInteger as T;
      }
      break;
    case "date":
      if ((field as any).valueDate) {
        return new Date((field as any).valueDate).toString() as T;
      }
      break;
    case "boolean":
      if (typeof (field as any).valueBoolean !== "undefined") {
        return (field as any).valueBoolean as T;
      }
      break;
  }

  return undefined;
}

// Print invoice analysis result
function printAnalysisResult(analyzeResult: AnalyzeResult): void {
  if (!analyzeResult?.contents || analyzeResult.contents.length === 0) {
    console.log("(No content returned from analysis)");
    return;
  }

  const content = analyzeResult.contents[0];

  if (!content.fields || Object.keys(content.fields).length === 0) {
    console.log("No fields found in the analysis result");
    return;
  }

  console.log();
  console.log("📋 Sample Field Extractions:");
  console.log("-".padEnd(40, "-"));

  // Example 1: Simple string fields
  const customerName = getFieldValue<string>(content.fields, "CustomerName");
  const invoiceDate = getFieldValue<string>(content.fields, "InvoiceDate");

  console.log(`Customer Name: ${customerName ?? "(None)"}`);
  console.log(`Invoice Date: ${invoiceDate ?? "(None)"}`);

  // Example 1b: Currency field (TotalAmount is an object with Amount and CurrencyCode)
  const totalAmountField = content.fields["TotalAmount"] as any;
  if (totalAmountField && totalAmountField.type === "object" && totalAmountField.valueObject) {
    const amount = getFieldValue<number>(totalAmountField.valueObject, "Amount");
    const currency = getFieldValue<string>(totalAmountField.valueObject, "CurrencyCode");
    console.log(
      `Invoice Total: ${currency ?? "$"}${amount !== undefined ? amount.toFixed(2) : "(None)"}`,
    );
  } else {
    console.log(`Invoice Total: (Not found)`);
  }

  // Example 2: Array field (LineItems)
  console.log();
  console.log("🛒 Invoice Line Items (Array):");
  const itemsField = content.fields["LineItems"] as any;
  if (itemsField && itemsField.type === "array" && itemsField.valueArray) {
    if (itemsField.valueArray.length > 0) {
      for (let i = 0; i < itemsField.valueArray.length; i++) {
        const item = itemsField.valueArray[i];
        if (item.type === "object" && item.valueObject) {
          console.log(`  Item ${i + 1}:`);

          // Extract common item fields
          const description = getFieldValue<string>(item.valueObject, "Description");
          const quantity = getFieldValue<number>(item.valueObject, "Quantity");

          console.log(`    Description: ${description ?? "N/A"}`);
          console.log(`    Quantity: ${quantity !== undefined ? quantity.toString() : "N/A"}`);

          // UnitPrice is a currency object with Amount and CurrencyCode sub-fields
          const unitPriceField = item.valueObject["UnitPrice"] as any;
          if (unitPriceField && unitPriceField.type === "object" && unitPriceField.valueObject) {
            const unitAmount = getFieldValue<number>(unitPriceField.valueObject, "Amount");
            const unitCurrency = getFieldValue<string>(
              unitPriceField.valueObject,
              "CurrencyCode",
            );
            console.log(
              `    Unit Price: ${unitCurrency ?? "$"}${unitAmount !== undefined ? unitAmount.toFixed(2) : "N/A"}`,
            );
          }

          // Amount is a currency object with Amount and CurrencyCode sub-fields
          const amountField = item.valueObject["Amount"] as any;
          if (amountField && amountField.type === "object" && amountField.valueObject) {
            const itemAmount = getFieldValue<number>(amountField.valueObject, "Amount");
            const itemCurrency = getFieldValue<string>(
              amountField.valueObject,
              "CurrencyCode",
            );
            console.log(
              `    Total Price: ${itemCurrency ?? "$"}${itemAmount !== undefined ? itemAmount.toFixed(2) : "N/A"}`,
            );
          }
        } else {
          console.log(`  Item ${i + 1}: No item object found`);
        }
      }
    } else {
      console.log("  No items found");
    }
  } else {
    console.log("  No items found");
  }

  console.log();
  console.log(`📄 Total fields extracted: ${Object.keys(content.fields).length}`);
}

/**
 * Save the analysis result to a JSON file.
 */
function saveResultToJson(result: AnalyzeResult, filenamePrefix: string): void {
  const outputDir = "sample_output";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
  const filename = `${filenamePrefix}_${timestamp}.json`;
  const outputPath = path.join(outputDir, filename);

  const json = JSON.stringify(result, null, 2);
  fs.writeFileSync(outputPath, json);

  console.log(`  💾 Analysis result saved to: ${outputPath}`);
}

// Main sample logic
async function main(): Promise<void> {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Prebuilt Invoice");
  console.log("=============================================================");
  console.log();

  try {
    // Step 1: Load endpoint and choose credential
    console.log("Step 1: Loading configuration...");
    const endpoint = (process.env["AZURE_CONTENT_UNDERSTANDING_ENDPOINT"] || "").trim();
    if (!endpoint) {
      throw new Error(
        "AZURE_CONTENT_UNDERSTANDING_ENDPOINT is required. Set it in your environment or .env file.",
      );
    }
    console.log(`  Endpoint: ${endpoint}`);
    console.log();

    // Step 2: Create the client with appropriate authentication
    console.log("Step 2: Creating Content Understanding client...");
    const credential = getCredential();
    console.log(
      `  Authentication: ${credential instanceof DefaultAzureCredential ? "DefaultAzureCredential" : "API Key"}`,
    );
    const client = new ContentUnderstandingClient(endpoint, credential);
    console.log();

    // Step 3: Analyze invoice
    const fileUrl =
      "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";

    console.log("Step 3: Analyzing invoice from URL...");
    console.log(`  URL: ${fileUrl}`);
    console.log(`  Analyzer: prebuilt-invoice`);
    console.log(`  Analyzing...`);

    const poller = client.contentAnalyzers.analyze("prebuilt-invoice", {
      inputs: [{ url: fileUrl }],
    });
    await poller.pollUntilDone();

    // Extract operation ID from the operation location to get the full result
    const operationLocation = (poller.operationState as any).config
      .operationLocation as string;
    const url = new URL(operationLocation);
    const operationId = url.pathname.split("/").pop()!.split("?")[0]!;

    // Get the complete result with all data
    const operationStatus = await client.contentAnalyzers.getResult(operationId);
    const analyzeResult = operationStatus.result!;

    console.log("  Analysis completed successfully");
    console.log();

    // Step 4: Display invoice analysis result
    console.log("Step 4: Displaying invoice analysis result...");
    console.log("=============================================================");

    printAnalysisResult(analyzeResult);

    console.log();
    console.log("Step 5: Saving analysis result to JSON...");
    saveResultToJson(analyzeResult, "content_analyzers_analyze_url_prebuilt_invoice");
    console.log("✅ Invoice fields saved to JSON file for detailed inspection");
    console.log();

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================");
  } catch (err: any) {
    console.error();
    if (err.status === 401) {
      console.error("✗ Authentication failed");
      console.error(`  Error: ${err.message}`);
      console.error("  Please check your credentials and ensure they are valid.");
    } else if (err.status) {
      console.error("✗ Service request failed");
      console.error(`  Status: ${err.status}`);
      console.error(`  Error Code: ${err.code ?? err.errorCode}`);
      console.error(`  Message: ${err.message}`);
    } else {
      console.error("✗ An unexpected error occurred");
      console.error(`  Error: ${err.message}`);
    }
    process.exit(1);
  }
}

// Entry point
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
