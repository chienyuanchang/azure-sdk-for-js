// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Analyze an invoice from a URL using the prebuilt-invoice analyzer.
 *
 * This sample demonstrates:
 * 1. Authenticate with Azure AI Content Understanding
 * 2. Analyze an invoice from a remote URL using the prebuilt-invoice analyzer
 * 3. Save the complete analysis result to JSON file
 * 4. Show examples of extracting different field types (string, number, object, array)
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
import type {
  AnalyzeResultOutput,
  ContentFieldOutput,
  ObjectFieldOutput,
  ArrayFieldOutput,
  StringFieldOutput,
  NumberFieldOutput,
} from "@azure-rest/ai-content-understanding";
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

// Helper to safely extract field values by type
function getFieldValue<T>(
  fields: Record<string, ContentFieldOutput>,
  fieldName: string,
  expectedType: string,
): T | undefined {
  const field = fields[fieldName];
  if (!field || field.type !== expectedType) {
    return undefined;
  }

  switch (expectedType) {
    case "string":
      return (field as StringFieldOutput).valueString as T;
    case "number":
      return (field as NumberFieldOutput).valueNumber as T;
    case "integer":
      return (field as any).valueInteger as T;
    case "date":
      return (field as any).valueDate as T;
    case "boolean":
      return (field as any).valueBoolean as T;
    default:
      return undefined;
  }
}

// Print invoice analysis result
function printInvoiceResult(analyzeResult: AnalyzeResultOutput): void {
  console.log("Step 4: Displaying invoice analysis result...");
  console.log("=============================================================");

  // A PDF file has only one content element even if it contains multiple pages
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
  console.log("-".repeat(40));

  // Example 1: Simple string fields
  const customerName = getFieldValue<string>(content.fields, "CustomerName", "string");
  const invoiceDate = getFieldValue<string>(content.fields, "InvoiceDate", "string");

  console.log(`Customer Name: ${customerName ?? "(None)"}`);
  console.log(`Invoice Date: ${invoiceDate ?? "(None)"}`);

  // Example 1b: Currency field (TotalAmount is an object with Amount and CurrencyCode)
  const totalAmountField = content.fields["TotalAmount"];
  if (totalAmountField && totalAmountField.type === "object") {
    const totalAmountObj = totalAmountField as ObjectFieldOutput;
    if (totalAmountObj.valueObject) {
      const amount = getFieldValue<number>(totalAmountObj.valueObject, "Amount", "number");
      const currency = getFieldValue<string>(totalAmountObj.valueObject, "CurrencyCode", "string");
      console.log(`Invoice Total: ${currency ?? "$"}${amount?.toFixed(2) ?? "(None)"}`);
    }
  } else {
    console.log("Invoice Total: (Not found)");
  }

  // Example 2: Array field (LineItems)
  console.log();
  console.log("🛒 Invoice Line Items (Array):");
  const itemsField = content.fields["LineItems"];
  if (itemsField && itemsField.type === "array") {
    const arrayField = itemsField as ArrayFieldOutput;
    if (arrayField.valueArray && arrayField.valueArray.length > 0) {
      for (let i = 0; i < arrayField.valueArray.length; i++) {
        const item = arrayField.valueArray[i];
        if (item.type === "object") {
          const objectField = item as ObjectFieldOutput;
          if (objectField.valueObject) {
            console.log(`  Item ${i + 1}:`);

            // Extract common item fields
            const description = getFieldValue<string>(
              objectField.valueObject,
              "Description",
              "string",
            );
            const quantity = getFieldValue<number>(objectField.valueObject, "Quantity", "number");

            console.log(`    Description: ${description ?? "N/A"}`);
            console.log(`    Quantity: ${quantity?.toString() ?? "N/A"}`);

            // UnitPrice and Amount are currency objects with Amount and CurrencyCode sub-fields
            const unitPriceField = objectField.valueObject["UnitPrice"];
            if (unitPriceField && unitPriceField.type === "object") {
              const unitPriceObj = unitPriceField as ObjectFieldOutput;
              if (unitPriceObj.valueObject) {
                const unitAmount = getFieldValue<number>(
                  unitPriceObj.valueObject,
                  "Amount",
                  "number",
                );
                const unitCurrency = getFieldValue<string>(
                  unitPriceObj.valueObject,
                  "CurrencyCode",
                  "string",
                );
                console.log(
                  `    Unit Price: ${unitCurrency ?? "$"}${unitAmount?.toFixed(2) ?? "N/A"}`,
                );
              }
            }

            const amountField = objectField.valueObject["Amount"];
            if (amountField && amountField.type === "object") {
              const amountObj = amountField as ObjectFieldOutput;
              if (amountObj.valueObject) {
                const itemAmount = getFieldValue<number>(amountObj.valueObject, "Amount", "number");
                const itemCurrency = getFieldValue<string>(
                  amountObj.valueObject,
                  "CurrencyCode",
                  "string",
                );
                console.log(
                  `    Total Price: ${itemCurrency ?? "$"}${itemAmount?.toFixed(2) ?? "N/A"}`,
                );
              }
            }
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

// Save the analysis result to a JSON file
function saveResultToJson(result: AnalyzeResultOutput, filenamePrefix: string): void {
  const outputDir = "sample_output";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T").join("_").slice(0, -5);
  const filename = `${filenamePrefix}_${timestamp}.json`;
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`  💾 Analysis result saved to: ${outputPath}`);
}

// Main sample logic
async function main(): Promise<void> {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Prebuilt Invoice");
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

    // Step 3: Analyze invoice from URL
    console.log("Step 3: Analyzing invoice from URL...");
    const fileUrl =
      "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";
    const analyzerId = "prebuilt-invoice";
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

    console.log("  Analysis completed successfully\n");

    // Step 4: Print result
    printInvoiceResult(analyzeResult);

    // Step 5: Save result to JSON
    console.log();
    console.log("Step 5: Saving analysis result to JSON...");
    saveResultToJson(analyzeResult, "content_analyzers_analyze_url_prebuilt_invoice");
    console.log("✅ Invoice fields saved to JSON file for detailed inspection");
    console.log();

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
