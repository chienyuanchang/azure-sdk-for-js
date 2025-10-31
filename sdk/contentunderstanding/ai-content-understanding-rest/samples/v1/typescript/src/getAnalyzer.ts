// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * This sample demonstrates how to retrieve an analyzer using the Get API.
 *
 * Prerequisites:
 *   - Azure subscription
 *   - Azure Content Understanding resource
 *
 * Setup:
 *   Set the following environment variables or add them to .env file:
 *   - AZURE_CONTENT_UNDERSTANDING_ENDPOINT (required)
 *   - AZURE_CONTENT_UNDERSTANDING_KEY (optional - DefaultAzureCredential will be used if not set)
 *
 * To run:
 *   npm run build && node dist/getAnalyzer.js
 *
 * This sample demonstrates:
 * 1. Authenticate with Azure AI Content Understanding
 * 2. Create a custom analyzer (for retrieval demo)
 * 3. Retrieve the analyzer using the get API
 * 4. Display the analyzer properties
 * 5. Clean up by deleting the analyzer
 */

import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import ContentUnderstanding, {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-content-understanding";

// Minimal local interfaces for sample usage
interface ContentAnalyzerConfig {
  returnDetails?: boolean;
}

interface FieldSchema {
  name?: string;
  description?: string;
  fields: Record<
    string,
    {
      type: string;
      method: string;
      description?: string;
    }
  >;
}

interface ContentAnalyzer {
  baseAnalyzerId: string;
  description?: string;
  config?: ContentAnalyzerConfig;
  fieldSchema?: FieldSchema;
  models?: Record<string, string>;
}

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
  console.log("Azure Content Understanding Sample: Get Analyzer");
  console.log("=============================================================\n");

  let analyzerId: string | null = null;
  let analyzerCreated = false;

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

    // Step 4: Create a temporary analyzer for retrieval demo
    console.log("Step 4: Creating temporary analyzer for retrieval demo...");

    // Generate a unique analyzer ID using timestamp
    analyzerId = `sdk_sample_analyzer_to_retrieve_${Math.floor(Date.now() / 1000)}`;
    console.log(`  Analyzer ID: ${analyzerId}`);

    // Create a simple custom analyzer
    const tempAnalyzer: ContentAnalyzer = {
      baseAnalyzerId: "prebuilt-document",
      description: "Custom analyzer for retrieval demo",
      config: {
        returnDetails: true,
      },
      fieldSchema: {
        name: "retrieval_schema",
        description: "Schema for retrieval demo",
        fields: {
          demo_field: {
            type: "string",
            method: "extract",
            description: "Demo field for retrieval",
          },
        },
      },
      models: {
        completion: "gpt-4o-mini",
        embedding: "text-embedding-3-large",
      },
    };

    try {
      console.log("  Creating analyzer (this may take a few moments)...");
      const createResponse = await client.path("/analyzers/{analyzerId}", analyzerId).put({
        body: tempAnalyzer,
      });

      if (isUnexpected(createResponse)) {
        throw createResponse.body.error;
      }

      const createPoller = await getLongRunningPoller(client, createResponse);
      await createPoller.pollUntilDone();

      analyzerCreated = true;
      console.log(`  ✅ Analyzer '${analyzerId}' created successfully!\n`);
    } catch (error: any) {
      console.error(`  Failed to create analyzer: ${error.message}`);
      throw error;
    }

    // Step 5: Retrieve the analyzer
    console.log("Step 5: Retrieving the analyzer...");
    let retrievedAnalyzer: any;
    try {
      const getResponse = await client.path("/analyzers/{analyzerId}", analyzerId).get();

      if (isUnexpected(getResponse)) {
        throw getResponse.body.error;
      }

      retrievedAnalyzer = getResponse.body;
      console.log(`  ✅ Analyzer '${analyzerId}' retrieved successfully!\n`);
    } catch (error: any) {
      console.error(`  Failed to retrieve analyzer: ${error.message}`);
      throw error;
    }

    // Step 6: Display analyzer properties
    console.log("Step 6: Displaying analyzer properties...");
    console.log("=============================================================");
    console.log(`  Analyzer ID: ${retrievedAnalyzer.analyzerId}`);
    console.log(`  Description: ${retrievedAnalyzer.description ?? "(none)"}`);
    console.log(`  Status: ${retrievedAnalyzer.status}`);
    console.log(`  Base Analyzer: ${retrievedAnalyzer.baseAnalyzerId}`);

    if (retrievedAnalyzer.createdAt) {
      const createdDate = new Date(retrievedAnalyzer.createdAt);
      console.log(
        `  Created at: ${createdDate.toISOString().replace("T", " ").substring(0, 19)} UTC`,
      );
    }

    if (retrievedAnalyzer.lastModifiedAt) {
      const modifiedDate = new Date(retrievedAnalyzer.lastModifiedAt);
      console.log(
        `  Last modified: ${modifiedDate.toISOString().replace("T", " ").substring(0, 19)} UTC`,
      );
    }

    if (retrievedAnalyzer.fieldSchema) {
      console.log(`  Field Schema:`);
      console.log(`    Name: ${retrievedAnalyzer.fieldSchema.name ?? "(none)"}`);
      console.log(`    Description: ${retrievedAnalyzer.fieldSchema.description ?? "(none)"}`);

      if (retrievedAnalyzer.fieldSchema.fields) {
        const fieldCount = Object.keys(retrievedAnalyzer.fieldSchema.fields).length;
        console.log(`    Fields: ${fieldCount}`);

        if (fieldCount > 0) {
          for (const [fieldName, fieldDef] of Object.entries(
            retrievedAnalyzer.fieldSchema.fields,
          )) {
            const field = fieldDef as any;
            console.log(`      - ${fieldName}: ${field.type} (${field.method})`);
          }
        }
      }
    }

    if (retrievedAnalyzer.models && Object.keys(retrievedAnalyzer.models).length > 0) {
      console.log(`  Models:`);
      for (const [modelType, modelName] of Object.entries(retrievedAnalyzer.models)) {
        console.log(`    ${modelType}: ${modelName}`);
      }
    }

    if (retrievedAnalyzer.tags && Object.keys(retrievedAnalyzer.tags).length > 0) {
      const tagList = Object.entries(retrievedAnalyzer.tags)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      console.log(`  Tags: ${tagList}`);
    }

    console.log("=============================================================\n");

    // Step 7: Clean up (delete the analyzer)
    if (analyzerCreated && analyzerId) {
      console.log("Step 7: Cleaning up (deleting analyzer)...");
      try {
        const deleteResponse = await client.path("/analyzers/{analyzerId}", analyzerId).delete();
        if (isUnexpected(deleteResponse)) {
          throw deleteResponse.body.error;
        }
        console.log(`  ✅ Analyzer '${analyzerId}' deleted successfully!\n`);
      } catch (error: any) {
        console.error(`  Failed to delete analyzer: ${error.message}`);
        // Don't throw - cleanup failure shouldn't fail the sample
      }
    }

    // Try to close DAC if supported
    if (
      credential instanceof DefaultAzureCredential &&
      typeof (credential as any).close === "function"
    ) {
      await (credential as any).close();
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("This sample demonstrated:");
    console.log("  1. Creating a temporary custom analyzer");
    console.log("  2. Retrieving the analyzer using the Get API");
    console.log("  3. Displaying analyzer properties and configuration");
    console.log("  4. Cleaning up by deleting the analyzer\n");
    console.log("Related samples:");
    console.log("  - To create analyzers: see createOrReplaceAnalyzer sample");
    console.log("  - To list analyzers: see listAnalyzers sample (if available)");
    console.log("  - To delete analyzers: see deleteAnalyzer sample");
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
