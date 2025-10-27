// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import createContentUnderstandingClient from "../../../../src/index";
import { DefaultAzureCredential, AzureKeyCredential } from "@azure/identity";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../sample.env") });

async function main() {
  const endpoint = process.env["AZURE_CONTENT_UNDERSTANDING_ENDPOINT"];
  if (!endpoint) {
    throw new Error("Missing AZURE_CONTENT_UNDERSTANDING_ENDPOINT in environment");
  }
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  const credential = key ? new AzureKeyCredential(key) : new DefaultAzureCredential();

  const client = createContentUnderstandingClient(endpoint, credential);

  // Read PDF file
  const pdfPath = path.resolve(__dirname, "../../../../sample_files/sample_invoice.pdf");
  const pdfBytes = fs.readFileSync(pdfPath);

  console.log(`Analyzing ${pdfPath} with prebuilt-documentAnalyzer...`);

  // Start analyze binary operation
  const initialResponse = await client
    .path("/contentAnalyzers/prebuilt-documentAnalyzer:analyzeBinary")
    .post({
      contentType: "application/pdf",
      body: pdfBytes,
    });

  if (initialResponse.status !== 202) {
    console.error("Failed to start analysis", initialResponse.body);
    return;
  }

  // Get operation-location for polling
  const operationLocation = initialResponse.headers["operation-location"] || initialResponse.headers["Operation-Location"];
  if (!operationLocation) {
    throw new Error("No operation-location header found in response");
  }

  // Poll for result
  let resultResponse;
  let pollCount = 0;
  while (true) {
    await new Promise((r) => setTimeout(r, 2000));
    resultResponse = await client
      .path("/analyzerResults/{operationId}", getOperationIdFromUrl(operationLocation))
      .get();
    pollCount++;
    if (resultResponse.status === 200 && resultResponse.body.status === "succeeded") {
      break;
    }
    if (resultResponse.body.status === "failed") {
      throw new Error("Analysis failed: " + JSON.stringify(resultResponse.body.error));
    }
    if (pollCount > 30) {
      throw new Error("Polling timed out");
    }
  }

  // Print markdown content
  const contents = resultResponse.body.result?.contents;
  if (contents && contents.length > 0) {
    console.log("\nMarkdown Content:\n" + "=".repeat(50));
    console.log(contents[0].markdown);
    console.log("=".repeat(50));
  } else {
    console.log("No content found in analysis result.");
  }
}

function getOperationIdFromUrl(url: string): string {
  // Extract operationId from .../analyzerResults/{operationId}
  const match = url.match(/\/analyzerResults\/([^/?]+)/);
  if (!match) throw new Error("Invalid operation-location URL: " + url);
  return match[1];
}

main().catch((err) => {
  console.error("Error running sampleAnalyzeBinary:", err);
  process.exit(1);
});
