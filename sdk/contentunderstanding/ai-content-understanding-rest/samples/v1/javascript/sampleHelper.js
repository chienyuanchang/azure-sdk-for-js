// --------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// --------------------------------------------------------------------------

/**
 * Helper functions for Azure AI Content Understanding samples.
 */

import fs from "fs";
import path from "path";

/**
 * Save JSON result to a file with timestamp
 * @param {any} result - The result object to save as JSON
 * @param {string} outputDir - Directory to save the file (default: "test_output")
 * @param {string} filenamePrefix - Prefix for the output filename (default: "analysis_result")
 * @returns {string} The path to the saved file
 */
export const saveJsonToFile = (
  result,
  outputDir = "test_output",
  filenamePrefix = "analysis_result",
) => {
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

/**
 * Extract the actual value from a ContentField
 * @param {Record<string, any>} fields - A dictionary of field names to ContentField objects
 * @param {string} fieldName - The name of the field to extract
 * @returns {any} The extracted value or null if not found
 */
export const getFieldValue = (fields, fieldName) => {
  if (!fields || !(fieldName in fields)) {
    return null;
  }

  const field = fields[fieldName];
  
  // Extract value based on field type
  if (field.type === "string") {
    return field.valueString;
  } else if (field.type === "number") {
    return field.valueNumber;
  } else if (field.type === "integer") {
    return field.valueInteger;
  } else if (field.type === "boolean") {
    return field.valueBoolean;
  } else if (field.type === "date") {
    return field.valueDate;
  } else if (field.type === "time") {
    return field.valueTime;
  } else if (field.type === "array") {
    return field.valueArray;
  } else if (field.type === "object") {
    return field.valueObject;
  }
  
  return null;
};
