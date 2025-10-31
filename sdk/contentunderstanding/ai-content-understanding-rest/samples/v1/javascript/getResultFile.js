// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Get result files (like keyframe images) from a video analysis operation.
 *
 * This sample demonstrates:
 * 1. Analyzing a video file to generate keyframes
 * 2. Extracting operation ID from the analysis response
 * 3. Getting result files (keyframe images) using the operation ID
 * 4. Saving the keyframe images to local files
 *
 * Environment variables:
 *   AZURE_CONTENT_UNDERSTANDING_ENDPOINT   (required)
 *   AZURE_CONTENT_UNDERSTANDING_KEY        (optional; DefaultAzureCredential used if not set)
 */

const { DefaultAzureCredential } = require("@azure/identity");
const { AzureKeyCredential } = require("@azure/core-auth");
const ContentUnderstanding = require("@azure-rest/ai-content-understanding").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-content-understanding");
const fs = require("fs");
const path = require("path");
require("dotenv/config");

// Helper to select credential based on environment
function getCredential() {
  const key = process.env["AZURE_CONTENT_UNDERSTANDING_KEY"];
  if (key && key.trim().length > 0) {
    return new AzureKeyCredential(key.trim());
  }
  return new DefaultAzureCredential();
}

async function main() {
  console.log("=============================================================");
  console.log("Azure Content Understanding Sample: Get Result File");
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

    // Step 2: Create the client
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

    // Step 4: Use prebuilt video analyzer
    console.log("Step 4: Using prebuilt video analyzer...");
    const analyzerId = "prebuilt-videoAnalyzer";
    console.log(`  Analyzer ID: ${analyzerId}`);
    console.log("  (Using prebuilt analyzer - no creation needed)\n");

    // Step 5: Analyze a video file
    console.log("Step 5: Analyzing video file...");
    const videoUrl =
      "https://github.com/Azure-Samples/azure-ai-content-understanding-assets/raw/refs/heads/main/videos/sdk_samples/FlightSimulator.mp4";
    console.log(`  URL: ${videoUrl}`);
    console.log("  Starting video analysis (this may take several moments)...");

    // Submit analyze request with URL input
    const initialResponse = await client.path("/analyzers/{analyzerId}:analyze", analyzerId).post({
      body: {
        inputs: [{ url: videoUrl }],
      },
    });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    // Extract operation ID from Operation-Location header
    const operationLocation = initialResponse.headers["operation-location"];
    let operationId;
    if (operationLocation) {
      const segments = operationLocation.split("/");
      operationId = segments[segments.length - 1];
      console.log(`  Analysis started, Operation ID: ${operationId}`);
    } else {
      throw new Error("Could not extract operation ID from Operation-Location header");
    }

    console.log("  Polling for completion (this may take several minutes for video)...");

    const poller = await getLongRunningPoller(client, initialResponse);
    const pollResult = await poller.pollUntilDone();
    const analyzeResult = pollResult?.body?.result ?? pollResult?.body;

    console.log("  ✅ Video analysis completed!");
    console.log(`  Contents count: ${analyzeResult.contents?.length ?? 0}`);

    // Save raw JSON response
    const outputDir = "sample_output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const jsonFileName = `video_analysis_raw_${timestamp}.json`;
    const jsonFilePath = path.join(outputDir, jsonFileName);
    fs.writeFileSync(jsonFilePath, JSON.stringify(analyzeResult, null, 2));
    console.log(`  💾 Raw JSON response saved to: ${jsonFilePath}\n`);

    // Step 6: Find keyframes in the analysis result
    console.log("Step 6: Finding keyframes in analysis result...");

    const keyframeTimeMs = [];

    if (analyzeResult.contents && analyzeResult.contents.length > 0) {
      for (const content of analyzeResult.contents) {
        if (content.kind === "audioVisual") {
          console.log(`  Video content found:`);
          console.log(`    Start time: ${content.startTimeMs}ms`);
          console.log(`    End time: ${content.endTimeMs}ms`);
          console.log(`    KeyFrames count: ${content.keyFrames?.length ?? 0}`);

          if (content.keyFrames && content.keyFrames.length > 0) {
            console.log(`  Found ${content.keyFrames.length} keyframes in video content`);
            keyframeTimeMs.push(...content.keyFrames.map((kf) => kf.frameTimeMs));
          }
          break;
        }
      }
    }

    if (keyframeTimeMs.length === 0) {
      console.log();
      console.log("  ⚠️  No keyframes found in the analysis result");
      console.log("  NOTE: The prebuilt-videoAnalyzer may not generate keyframes by default.");
      console.log(
        "        To generate keyframes, a custom video analyzer with specific configuration",
      );
      console.log("        may be required (see createOrReplaceAnalyzer sample).\n");
      console.log("  This sample successfully demonstrated:");
      console.log("    ✓ Video analysis workflow");
      console.log("    ✓ Extracting operation ID from Operation-Location header");
      console.log("    ✓ GetResultFile API usage (would work if keyframes were present)\n");
    } else {
      console.log(`  🖼️  Found ${keyframeTimeMs.length} keyframe timestamps\n`);

      // Step 7: Download keyframe images
      console.log("Step 7: Downloading keyframe images...");

      // Download a few keyframe images as examples (first, middle, last)
      const framesToDownload = [];
      if (keyframeTimeMs.length >= 3) {
        framesToDownload.push(keyframeTimeMs[0]); // First
        framesToDownload.push(keyframeTimeMs[Math.floor(keyframeTimeMs.length / 2)]); // Middle
        framesToDownload.push(keyframeTimeMs[keyframeTimeMs.length - 1]); // Last
      } else {
        framesToDownload.push(...keyframeTimeMs);
      }

      console.log(`  Downloading ${framesToDownload.length} keyframe images as examples`);

      for (const frameTimeMs of framesToDownload) {
        // API format: path is "keyframes/{frameTimeMs}"
        const framePath = `keyframes/${frameTimeMs}`;
        console.log(`  📥 Getting result file: ${framePath}`);

        try {
          const fileResponse = await client
            .path("/analyzerResults/{operationId}/files/{path}", operationId, {
              value: framePath,
              allowReserved: true,
            })
            .get();

          if (isUnexpected(fileResponse)) {
            throw fileResponse.body.error;
          }

          const imageBytes = fileResponse.body;
          console.log(`    ✅ Retrieved (${imageBytes.length.toLocaleString()} bytes)`);

          // Save the image file
          const fileName = `keyframe_${frameTimeMs}.jpg`;
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, Buffer.from(imageBytes));
          console.log(`    💾 Saved to: ${filePath}`);
        } catch (err) {
          console.error(`    Failed to get result file: ${err.message}`);
        }
      }
      console.log();
    }

    // Step 8: Clean up
    console.log("Step 8: Cleanup...");
    console.log("  (Using prebuilt analyzer - no cleanup needed)\n");

    // Try to close DAC if supported
    if (credential instanceof DefaultAzureCredential && typeof credential.close === "function") {
      await credential.close();
    }

    console.log("=============================================================");
    console.log("✓ Sample completed successfully");
    console.log("=============================================================\n");
    console.log("This sample demonstrated:");
    console.log("  1. Analyzing a video to generate keyframes");
    console.log("  2. Extracting operation ID from Operation-Location header");
    console.log("  3. Downloading keyframe images using GetResultFile API");
    console.log("  4. Saving keyframe images to local files\n");
  } catch (err) {
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
