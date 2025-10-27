// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Helper functions for Azure AI Content Understanding samples.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Save JSON result to a file with timestamp
 * @param result - The result object to save as JSON
 * @param outputDir - Directory to save the file (default: "test_output")
 * @param filenamePrefix - Prefix for the output filename (default: "analysis_result")
 * @returns The path to the saved file
 */
export const saveJsonToFile = (
  result: any,
  outputDir: string = "test_output",
  filenamePrefix: string = "analysis_result",
): string => {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("T")
    .join("_")
    .split("Z")[0];
  const filename = `${filenamePrefix}_${timestamp}.json`;
  const filePath = path.join(outputDir, filename);

  // Write JSON to file
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`💾 Analysis result saved to: ${filePath}`);

  return filePath;
};
