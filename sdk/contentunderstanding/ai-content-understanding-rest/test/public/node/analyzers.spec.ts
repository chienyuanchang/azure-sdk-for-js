// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Recorder } from "@azure-tools/test-recorder";
import { createRecorder, testPollingOptions } from "../utils/recordedClient.js";
import ContentUnderstanding from "../../../src/index.js";
import { assert, describe, beforeEach, afterEach, it } from "vitest";
import type { ContentUnderstandingClient } from "../../../src/index.js";
import { getLongRunningPoller, isUnexpected, paginate } from "../../../src/index.js";
import { getEndpoint, getKey } from "../../utils/injectables.js";
import { AzureKeyCredential } from "@azure/core-auth";

describe("ContentUnderstandingClient - Analyzers", () => {
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
    // Note: Analyzer IDs cannot contain hyphens
    // Use recorder.variable to ensure consistent IDs between record and playback modes
    testAnalyzerId = recorder.variable("testAnalyzerId", `test_analyzer_${Math.floor(Date.now() / 1000)}`);
  });

  afterEach(async () => {
    // Clean up: try to delete test analyzer if it exists
    try {
      const deleteResponse = await client
        .path("/analyzers/{analyzerId}", testAnalyzerId)
        .delete();
      if (!isUnexpected(deleteResponse)) {
        console.log(`Cleaned up test analyzer: ${testAnalyzerId}`);
      }
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

    const createResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).put({
      body: analyzerConfig,
    });

    if (isUnexpected(createResponse)) {
      throw createResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, createResponse, {
      ...testPollingOptions,
    });

    const result = await poller.pollUntilDone();
    assert.ok(result, "Expected a result from the poller");
    if (isUnexpected(result)) {
      throw result.body.error;
    }
    assert.equal(result.body.analyzerId, testAnalyzerId);
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

    const createResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).put({
      body: analyzerConfig,
    });

    if (isUnexpected(createResponse)) {
      throw createResponse.body.error;
    }

    const createPoller = await getLongRunningPoller(client, createResponse, {
      ...testPollingOptions,
    });

    await createPoller.pollUntilDone();

    // Now get the analyzer
    const getResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).get();

    if (isUnexpected(getResponse)) {
      throw getResponse.body.error;
    }

    assert.equal(getResponse.body.analyzerId, testAnalyzerId);
    assert.equal(getResponse.body.baseAnalyzerId, "prebuilt-document");
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

    const createResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).put({
      body: analyzerConfig,
    });

    if (isUnexpected(createResponse)) {
      throw createResponse.body.error;
    }

    const createPoller = await getLongRunningPoller(client, createResponse, {
      ...testPollingOptions,
    });

    await createPoller.pollUntilDone();

    // Update the analyzer with a description
    const updateResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).patch({
      contentType: "application/merge-patch+json",
      body: {
        baseAnalyzerId: "prebuilt-document",
        description: "Updated test analyzer",
        models: {
          completion: "gpt-4o-mini",
          embedding: "text-embedding-3-large",
        },
      },
    });

    if (isUnexpected(updateResponse)) {
      throw updateResponse.body.error;
    }

    assert.equal(updateResponse.body.description, "Updated test analyzer");
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

    const createResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).put({
      body: analyzerConfig,
    });

    if (isUnexpected(createResponse)) {
      throw createResponse.body.error;
    }

    const createPoller = await getLongRunningPoller(client, createResponse, {
      ...testPollingOptions,
    });

    await createPoller.pollUntilDone();

    // List analyzers
    const listResponse = await client.path("/analyzers").get();

    if (isUnexpected(listResponse)) {
      throw listResponse.body.error;
    }

    const analyzers = [];
    for await (const analyzer of paginate(client, listResponse)) {
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

    const createResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).put({
      body: analyzerConfig,
    });

    if (isUnexpected(createResponse)) {
      throw createResponse.body.error;
    }

    const createPoller = await getLongRunningPoller(client, createResponse, {
      ...testPollingOptions,
    });

    await createPoller.pollUntilDone();

    // Delete the analyzer
    const deleteResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).delete();

    if (isUnexpected(deleteResponse)) {
      throw deleteResponse.body.error;
    }

    // Try to get the deleted analyzer - should fail
    const getResponse = await client.path("/analyzers/{analyzerId}", testAnalyzerId).get();

    assert.ok(isUnexpected(getResponse), "Expected error when getting deleted analyzer");
  });

  it("should handle analyzer not found error", async () => {
    const nonExistentId = "non-existent-analyzer-12345";
    const getResponse = await client.path("/analyzers/{analyzerId}", nonExistentId).get();

    assert.ok(isUnexpected(getResponse), "Expected error for non-existent analyzer");
  });
});
