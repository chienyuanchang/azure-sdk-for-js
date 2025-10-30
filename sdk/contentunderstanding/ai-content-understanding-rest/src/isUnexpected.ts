// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  GetOperationStatus200Response,
  GetOperationStatusDefaultResponse,
  CreateOrReplace200Response,
  CreateOrReplace201Response,
  CreateOrReplaceLogicalResponse,
  CreateOrReplaceDefaultResponse,
  Update200Response,
  UpdateDefaultResponse,
  Get200Response,
  GetDefaultResponse,
  Delete204Response,
  DeleteDefaultResponse,
  List200Response,
  ListDefaultResponse,
  Analyze202Response,
  AnalyzeLogicalResponse,
  AnalyzeDefaultResponse,
  AnalyzeBinary202Response,
  AnalyzeBinaryLogicalResponse,
  AnalyzeBinaryDefaultResponse,
  GetResult200Response,
  GetResultDefaultResponse,
  DeleteResult204Response,
  DeleteResultDefaultResponse,
  GetResultFile200Response,
  GetResultFileDefaultResponse,
  Copy202Response,
  CopyLogicalResponse,
  CopyDefaultResponse,
  GrantCopyAuthorization200Response,
  GrantCopyAuthorizationDefaultResponse,
  GetDefaults200Response,
  GetDefaultsDefaultResponse,
  UpdateDefaults200Response,
  UpdateDefaultsDefaultResponse,
} from "./responses.js";

const responseMap: Record<string, string[]> = {
  "GET /analyzers/{analyzerId}/operations/{operationId}": ["200"],
  "GET /analyzers/{analyzerId}": ["200"],
  "PUT /analyzers/{analyzerId}": ["200", "201"],
  "PATCH /analyzers/{analyzerId}": ["200"],
  "DELETE /analyzers/{analyzerId}": ["204"],
  "GET /analyzers": ["200"],
  "GET /analyzers/{analyzerId}:analyze": ["200", "202"],
  "POST /analyzers/{analyzerId}:analyze": ["202"],
  "GET /analyzers/{analyzerId}:analyzeBinary": ["200", "202"],
  "POST /analyzers/{analyzerId}:analyzeBinary": ["202"],
  "GET /analyzerResults/{operationId}": ["200"],
  "DELETE /analyzerResults/{operationId}": ["204"],
  "GET /analyzerResults/{operationId}/files/{path}": ["200"],
  "GET /analyzers/{analyzerId}:copy": ["200", "202"],
  "POST /analyzers/{analyzerId}:copy": ["202"],
  "POST /analyzers/{analyzerId}:grantCopyAuthorization": ["200"],
  "GET /defaults": ["200"],
  "PATCH /defaults": ["200"],
};

export function isUnexpected(
  response: GetOperationStatus200Response | GetOperationStatusDefaultResponse,
): response is GetOperationStatusDefaultResponse;
export function isUnexpected(
  response:
    | CreateOrReplace200Response
    | CreateOrReplace201Response
    | CreateOrReplaceLogicalResponse
    | CreateOrReplaceDefaultResponse,
): response is CreateOrReplaceDefaultResponse;
export function isUnexpected(
  response: Update200Response | UpdateDefaultResponse,
): response is UpdateDefaultResponse;
export function isUnexpected(
  response: Get200Response | GetDefaultResponse,
): response is GetDefaultResponse;
export function isUnexpected(
  response: Delete204Response | DeleteDefaultResponse,
): response is DeleteDefaultResponse;
export function isUnexpected(
  response: List200Response | ListDefaultResponse,
): response is ListDefaultResponse;
export function isUnexpected(
  response:
    | Analyze202Response
    | AnalyzeLogicalResponse
    | AnalyzeDefaultResponse,
): response is AnalyzeDefaultResponse;
export function isUnexpected(
  response:
    | AnalyzeBinary202Response
    | AnalyzeBinaryLogicalResponse
    | AnalyzeBinaryDefaultResponse,
): response is AnalyzeBinaryDefaultResponse;
export function isUnexpected(
  response: GetResult200Response | GetResultDefaultResponse,
): response is GetResultDefaultResponse;
export function isUnexpected(
  response: DeleteResult204Response | DeleteResultDefaultResponse,
): response is DeleteResultDefaultResponse;
export function isUnexpected(
  response: GetResultFile200Response | GetResultFileDefaultResponse,
): response is GetResultFileDefaultResponse;
export function isUnexpected(
  response: Copy202Response | CopyLogicalResponse | CopyDefaultResponse,
): response is CopyDefaultResponse;
export function isUnexpected(
  response:
    | GrantCopyAuthorization200Response
    | GrantCopyAuthorizationDefaultResponse,
): response is GrantCopyAuthorizationDefaultResponse;
export function isUnexpected(
  response: GetDefaults200Response | GetDefaultsDefaultResponse,
): response is GetDefaultsDefaultResponse;
export function isUnexpected(
  response: UpdateDefaults200Response | UpdateDefaultsDefaultResponse,
): response is UpdateDefaultsDefaultResponse;
export function isUnexpected(
  response:
    | GetOperationStatus200Response
    | GetOperationStatusDefaultResponse
    | CreateOrReplace200Response
    | CreateOrReplace201Response
    | CreateOrReplaceLogicalResponse
    | CreateOrReplaceDefaultResponse
    | Update200Response
    | UpdateDefaultResponse
    | Get200Response
    | GetDefaultResponse
    | Delete204Response
    | DeleteDefaultResponse
    | List200Response
    | ListDefaultResponse
    | Analyze202Response
    | AnalyzeLogicalResponse
    | AnalyzeDefaultResponse
    | AnalyzeBinary202Response
    | AnalyzeBinaryLogicalResponse
    | AnalyzeBinaryDefaultResponse
    | GetResult200Response
    | GetResultDefaultResponse
    | DeleteResult204Response
    | DeleteResultDefaultResponse
    | GetResultFile200Response
    | GetResultFileDefaultResponse
    | Copy202Response
    | CopyLogicalResponse
    | CopyDefaultResponse
    | GrantCopyAuthorization200Response
    | GrantCopyAuthorizationDefaultResponse
    | GetDefaults200Response
    | GetDefaultsDefaultResponse
    | UpdateDefaults200Response
    | UpdateDefaultsDefaultResponse,
): response is
  | GetOperationStatusDefaultResponse
  | CreateOrReplaceDefaultResponse
  | UpdateDefaultResponse
  | GetDefaultResponse
  | DeleteDefaultResponse
  | ListDefaultResponse
  | AnalyzeDefaultResponse
  | AnalyzeBinaryDefaultResponse
  | GetResultDefaultResponse
  | DeleteResultDefaultResponse
  | GetResultFileDefaultResponse
  | CopyDefaultResponse
  | GrantCopyAuthorizationDefaultResponse
  | GetDefaultsDefaultResponse
  | UpdateDefaultsDefaultResponse {
  const lroOriginal = response.headers["x-ms-original-url"];
  const url = new URL(lroOriginal ?? response.request.url);
  const method = response.request.method;
  let pathDetails = responseMap[`${method} ${url.pathname}`];
  if (!pathDetails) {
    pathDetails = getParametrizedPathSuccess(method, url.pathname);
  }
  return !pathDetails.includes(response.status);
}

function getParametrizedPathSuccess(method: string, path: string): string[] {
  const pathParts = path.split("/");

  // Traverse list to match the longest candidate
  // matchedLen: the length of candidate path
  // matchedValue: the matched status code array
  let matchedLen = -1,
    matchedValue: string[] = [];

  // Iterate the responseMap to find a match
  for (const [key, value] of Object.entries(responseMap)) {
    // Extracting the path from the map key which is in format
    // GET /path/foo
    if (!key.startsWith(method)) {
      continue;
    }
    const candidatePath = getPathFromMapKey(key);
    // Get each part of the url path
    const candidateParts = candidatePath.split("/");

    // track if we have found a match to return the values found.
    let found = true;
    for (
      let i = candidateParts.length - 1, j = pathParts.length - 1;
      i >= 1 && j >= 1;
      i--, j--
    ) {
      if (
        candidateParts[i]?.startsWith("{") &&
        candidateParts[i]?.indexOf("}") !== -1
      ) {
        const start = candidateParts[i]!.indexOf("}") + 1,
          end = candidateParts[i]?.length;
        // If the current part of the candidate is a "template" part
        // Try to use the suffix of pattern to match the path
        // {guid} ==> $
        // {guid}:export ==> :export$
        const isMatched = new RegExp(
          `${candidateParts[i]?.slice(start, end)}`,
        ).test(pathParts[j] || "");

        if (!isMatched) {
          found = false;
          break;
        }
        continue;
      }

      // If the candidate part is not a template and
      // the parts don't match mark the candidate as not found
      // to move on with the next candidate path.
      if (candidateParts[i] !== pathParts[j]) {
        found = false;
        break;
      }
    }

    // We finished evaluating the current candidate parts
    // Update the matched value if and only if we found the longer pattern
    if (found && candidatePath.length > matchedLen) {
      matchedLen = candidatePath.length;
      matchedValue = value;
    }
  }

  return matchedValue;
}

function getPathFromMapKey(mapKey: string): string {
  const pathStart = mapKey.indexOf("/");
  return mapKey.slice(pathStart);
}
