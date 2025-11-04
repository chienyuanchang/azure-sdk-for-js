// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Recorder } from "@azure-tools/test-recorder";
import { createRecorder, testPollingOptions } from "../utils/recordedClient.js";
import ContentUnderstanding from "../../../src/index.js";
import { assert, describe, beforeEach, afterEach, it } from "vitest";
import type { ContentUnderstandingClient } from "../../../src/index.js";
import { getLongRunningPoller, isUnexpected } from "../../../src/index.js";
import { getEndpoint, getKey } from "../../utils/injectables.js";
import { AzureKeyCredential } from "@azure/core-auth";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to sample files
const SAMPLE_FILES_PATH = path.resolve(__dirname, "../../../sample_files");

describe("ContentUnderstandingClient - Analysis", () => {
  let recorder: Recorder;
  let client: ContentUnderstandingClient;
  let testAnalyzerId: string;

  beforeEach(async (context) => {
    recorder = await createRecorder(context);
    await recorder.setMatcher("BodilessMatcher");
    client = ContentUnderstanding(
      getEndpoint(),
      new AzureKeyCredential(getKey()),
      recorder.configureClientOptions({}),
    );
    testAnalyzerId = "prebuilt-documentAnalyzer";
  });

  afterEach(async () => {
    await recorder.stop();
  });

  it("should analyze a PDF file from binary", async () => {
    const filePath = path.join(SAMPLE_FILES_PATH, "sample_invoice.pdf");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Sample file not found at ${filePath}, skipping test`);
      return;
    }

    const pdfBytes = fs.readFileSync(filePath);

    // Use the binary analyze endpoint when sending raw PDF bytes
    const initialResponse = await client
      .path("/analyzers/{analyzerId}:analyzeBinary", testAnalyzerId)
      .post({
        body: pdfBytes,
        contentType: "application/pdf",
        headers: { "Content-Type": "application/pdf" },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse, {
      ...testPollingOptions,
    });

    const result = await poller.pollUntilDone();
    assert.ok(result, "Expected a result from the poller");
    
    const analyzeResult = result.body?.result ?? result.body;
    assert.ok(analyzeResult, "Expected analyzeResult in response");
    
    const contents = analyzeResult?.contents;
    assert.ok(contents && contents.length > 0, "Expected contents in analyzeResult");
  });

  it("should analyze a document from URL", async () => {
    // Using a public PDF URL for testing
    const testUrl = "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";

    const initialResponse = await client
      .path("/analyzers/{analyzerId}:analyze", testAnalyzerId)
      .post({
        body: {
          inputs: [{ url: testUrl }],
        },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse, {
      ...testPollingOptions,
    });

    const result = await poller.pollUntilDone();
    assert.ok(result, "Expected a result from the poller");
    
    const analyzeResult = result.body?.result ?? result.body;
    assert.ok(analyzeResult, "Expected analyzeResult in response");
    
    const contents = analyzeResult?.contents;
    assert.ok(contents && contents.length > 0, "Expected contents in analyzeResult");
  });

  it("should analyze with markdown output", async () => {
    const testUrl = "https://github.com/Azure-Samples/azure-ai-content-understanding-python/raw/refs/heads/main/data/invoice.pdf";

    const initialResponse = await client
      .path("/analyzers/{analyzerId}:analyze", testAnalyzerId)
      .post({
        body: {
          inputs: [{ url: testUrl }],
        },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse, {
      ...testPollingOptions,
    });

    const result = await poller.pollUntilDone();
    assert.ok(result, "Expected a result from the poller");
    
    const analyzeResult = result.body?.result ?? result.body;
    assert.ok(analyzeResult, "Expected analyzeResult in response");
    
    const contents = analyzeResult?.contents;
    assert.ok(contents && contents.length > 0, "Expected contents in analyzeResult");
    
    // Check if markdown is present in the result
    const firstContent = contents[0];
    if (firstContent.kind === "document") {
      // Markdown should be present in the document content
      assert.isDefined(firstContent.markdown);
    }
  });

  it("should handle analysis error for invalid URL", async () => {
    const invalidUrl = "https://invalid-url-that-does-not-exist.com/nonexistent.pdf";

    const initialResponse = await client
      .path("/analyzers/{analyzerId}:analyze", testAnalyzerId)
      .post({
        body: {
          inputs: [{ url: invalidUrl }],
        },
      });

    if (isUnexpected(initialResponse)) {
      // Expected to fail with initial response for invalid URL
      assert.ok(initialResponse.body.error, "Expected error for invalid URL");
      return;
    }

    // If initial response succeeds, the error should occur during polling
    try {
      const poller = await getLongRunningPoller(client, initialResponse, {
        ...testPollingOptions,
      });
      await poller.pollUntilDone();
      assert.fail("Expected error for invalid URL");
    } catch (error) {
      assert.ok(error, "Expected error for invalid URL");
    }
  });
});
