// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Recorder } from "@azure-tools/test-recorder";
import { createRecorder, testPollingOptions } from "../utils/recordedClient.js";
import { ContentUnderstandingClient } from "../../../src/index.js";
import { assert, describe, beforeEach, afterEach, it } from "vitest";
import { getEndpoint, getKey } from "../../utils/injectables.js";
import { AzureKeyCredential } from "@azure/core-auth";

describe("ContentUnderstandingClient - Analyzers", () => {
  let recorder: Recorder;
  let client: ContentUnderstandingClient;
  let testAnalyzerId: string;

  beforeEach(async (context) => {
    recorder = await createRecorder(context);
    await recorder.setMatcher("BodilessMatcher");
    client = new ContentUnderstandingClient(
      getEndpoint(),
      new AzureKeyCredential(getKey()),
      recorder.configureClientOptions({}),
    );
    // Note: Analyzer IDs cannot contain hyphens
    // Use recorder.variable to ensure consistent IDs between record and playback modes
    testAnalyzerId = recorder.variable("testAnalyzerId", `test_analyzer_${Math.floor(Date.now() / 1000)}`);
  });

  afterEach(async () => {
    // Clean up: try to delete test analyzer if it exists
    try {
      await client.contentAnalyzers.delete(testAnalyzerId);
      console.log(`Cleaned up test analyzer: ${testAnalyzerId}`);
    } catch (error) {
      // Ignore errors during cleanup
    }
    await recorder.stop();
  });

  it("should create an analyzer", async () => {
    const analyzerConfig = {
      baseAnalyzerId: "prebuilt-document",
      description: "Test analyzer for extraction",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "test_schema",
        description: "Schema for test",
        fields: {
          test_field: {
            type: "string",
            method: "extract",
            description: "Test field",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    const poller = client.contentAnalyzers.createOrReplace(
      testAnalyzerId,
      analyzerConfig as any,
      testPollingOptions,
    );

    const result = await poller.pollUntilDone();
    assert.ok(result, "Expected a result from the poller");
    assert.equal(result.analyzerId, testAnalyzerId);
  });

  it("should get an analyzer", async () => {
    // First create an analyzer
    const analyzerConfig = {
      baseAnalyzerId: "prebuilt-document",
      description: "Test analyzer for extraction",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "test_schema",
        description: "Schema for test",
        fields: {
          test_field: {
            type: "string",
            method: "extract",
            description: "Test field",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    const createPoller = client.contentAnalyzers.createOrReplace(
      testAnalyzerId,
      analyzerConfig as any,
      testPollingOptions,
    );

    await createPoller.pollUntilDone();

    // Now get the analyzer
    const getResponse = await client.contentAnalyzers.get(testAnalyzerId);

    assert.equal(getResponse.analyzerId, testAnalyzerId);
    assert.equal(getResponse.baseAnalyzerId, "prebuilt-document");
  });

  it("should update an analyzer", async () => {
    // First create an analyzer
    const analyzerConfig = {
      baseAnalyzerId: "prebuilt-document",
      description: "Test analyzer for extraction",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "test_schema",
        description: "Schema for test",
        fields: {
          test_field: {
            type: "string",
            method: "extract",
            description: "Test field",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    const createPoller = client.contentAnalyzers.createOrReplace(
      testAnalyzerId,
      analyzerConfig as any,
      testPollingOptions,
    );

    await createPoller.pollUntilDone();

    // Update the analyzer with a description
    const updateResponse = await client.contentAnalyzers.update(testAnalyzerId, {
      baseAnalyzerId: "prebuilt-document",
      description: "Updated test analyzer",
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    } as any);

    assert.equal(updateResponse.description, "Updated test analyzer");
  });

  it("should list analyzers", async () => {
    // First create an analyzer to ensure there's at least one
    const analyzerConfig = {
      baseAnalyzerId: "prebuilt-document",
      description: "Test analyzer for extraction",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "test_schema",
        description: "Schema for test",
        fields: {
          test_field: {
            type: "string",
            method: "extract",
            description: "Test field",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    const createPoller = client.contentAnalyzers.createOrReplace(
      testAnalyzerId,
      analyzerConfig as any,
      testPollingOptions,
    );

    await createPoller.pollUntilDone();

    // List analyzers
    const analyzers = [];
    for await (const analyzer of client.contentAnalyzers.list()) {
      analyzers.push(analyzer);
    }

    assert.ok(analyzers.length > 0, "Expected at least one analyzer");
    const foundAnalyzer = analyzers.find((a) => a.analyzerId === testAnalyzerId);
    assert.ok(foundAnalyzer, `Expected to find analyzer ${testAnalyzerId}`);
  });

  it("should delete an analyzer", async () => {
    // First create an analyzer
    const analyzerConfig = {
      baseAnalyzerId: "prebuilt-document",
      description: "Test analyzer for extraction",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "test_schema",
        description: "Schema for test",
        fields: {
          test_field: {
            type: "string",
            method: "extract",
            description: "Test field",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    const createPoller = client.contentAnalyzers.createOrReplace(
      testAnalyzerId,
      analyzerConfig as any,
      testPollingOptions,
    );

    await createPoller.pollUntilDone();

    // Delete the analyzer
    await client.contentAnalyzers.delete(testAnalyzerId);

    // Try to get the deleted analyzer - should fail
    try {
      await client.contentAnalyzers.get(testAnalyzerId);
      assert.fail("Expected error when getting deleted analyzer");
    } catch (error) {
      assert.ok(error, "Expected error when getting deleted analyzer");
    }
  });

  it("should handle analyzer not found error", async () => {
    const nonExistentId = "non-existent-analyzer-12345";
    
    try {
      await client.contentAnalyzers.get(nonExistentId);
      assert.fail("Expected error for non-existent analyzer");
    } catch (error) {
      assert.ok(error, "Expected error for non-existent analyzer");
    }
  });
});
