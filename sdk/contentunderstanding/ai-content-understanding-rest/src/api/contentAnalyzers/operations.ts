// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { ContentUnderstandingContext as Client } from "../index.js";
import type {
  ContentAnalyzerOperationStatus,
  ContentAnalyzer,
  _PagedContentAnalyzer,
  AnalyzeResult,
  ContentAnalyzerAnalyzeOperationStatus,
  CopyAuthorization,
  ContentUnderstandingDefaults,
} from "../../models/models.js";
import {
  contentAnalyzerOperationStatusDeserializer,
  contentAnalyzerSerializer,
  contentAnalyzerDeserializer,
  _pagedContentAnalyzerDeserializer,
  analyzeInputArraySerializer,
  analyzeResultDeserializer,
  contentAnalyzerAnalyzeOperationStatusDeserializer,
  copyAuthorizationDeserializer,
  contentUnderstandingDefaultsDeserializer,
} from "../../models/models.js";
import type { PagedAsyncIterableIterator } from "../../static-helpers/pagingHelpers.js";
import { buildPagedAsyncIterator } from "../../static-helpers/pagingHelpers.js";
import { getLongRunningPoller } from "../../static-helpers/pollingHelpers.js";
import { expandUrlTemplate } from "../../static-helpers/urlTemplate.js";
import type {
  ContentAnalyzersUpdateDefaultsOptionalParams,
  ContentAnalyzersGetDefaultsOptionalParams,
  ContentAnalyzersGrantCopyAuthorizationOptionalParams,
  ContentAnalyzersCopyOptionalParams,
  ContentAnalyzersDeleteResultOptionalParams,
  ContentAnalyzersGetResultFileOptionalParams,
  ContentAnalyzersGetResultOptionalParams,
  ContentAnalyzersAnalyzeBinaryOptionalParams,
  ContentAnalyzersAnalyzeOptionalParams,
  ContentAnalyzersListOptionalParams,
  ContentAnalyzersDeleteOptionalParams,
  ContentAnalyzersGetOptionalParams,
  ContentAnalyzersUpdateOptionalParams,
  ContentAnalyzersCreateOrReplaceOptionalParams,
  ContentAnalyzersGetOperationStatusOptionalParams,
} from "./options.js";
import type { StreamableMethod, PathUncheckedResponse } from "@azure-rest/core-client";
import { createRestError, operationOptionsToRequestParameters } from "@azure-rest/core-client";
import type { PollerLike, OperationState } from "@azure/core-lro";

export function _updateDefaultsSend(
  context: Client,
  options: ContentAnalyzersUpdateDefaultsOptionalParams = {
    requestOptions: {},
  },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/defaults{?api%2Dversion}",
    {
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).patch({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/merge-patch+json",
    headers: {
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: { modelDeployments: {} },
  });
}

export async function _updateDefaultsDeserialize(
  result: PathUncheckedResponse,
): Promise<ContentUnderstandingDefaults> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentUnderstandingDefaultsDeserializer(result.body);
}

/** Return default settings for this Content Understanding resource. */
export async function updateDefaults(
  context: Client,
  options: ContentAnalyzersUpdateDefaultsOptionalParams = {
    requestOptions: {},
  },
): Promise<ContentUnderstandingDefaults> {
  const result = await _updateDefaultsSend(context, options);
  return _updateDefaultsDeserialize(result);
}

export function _getDefaultsSend(
  context: Client,
  options: ContentAnalyzersGetDefaultsOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/defaults{?api%2Dversion}",
    {
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _getDefaultsDeserialize(
  result: PathUncheckedResponse,
): Promise<ContentUnderstandingDefaults> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentUnderstandingDefaultsDeserializer(result.body);
}

/** Return default settings for this Content Understanding resource. */
export async function getDefaults(
  context: Client,
  options: ContentAnalyzersGetDefaultsOptionalParams = { requestOptions: {} },
): Promise<ContentUnderstandingDefaults> {
  const result = await _getDefaultsSend(context, options);
  return _getDefaultsDeserialize(result);
}

export function _grantCopyAuthorizationSend(
  context: Client,
  analyzerId: string,
  targetAzureResourceId: string,
  options: ContentAnalyzersGrantCopyAuthorizationOptionalParams = {
    requestOptions: {},
  },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}:grantCopyAuthorization{?api%2Dversion}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: {
      targetAzureResourceId: targetAzureResourceId,
      targetRegion: options?.targetRegion,
    },
  });
}

export async function _grantCopyAuthorizationDeserialize(
  result: PathUncheckedResponse,
): Promise<CopyAuthorization> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return copyAuthorizationDeserializer(result.body);
}

/** Get authorization for copying this analyzer to another location. */
export async function grantCopyAuthorization(
  context: Client,
  analyzerId: string,
  targetAzureResourceId: string,
  options: ContentAnalyzersGrantCopyAuthorizationOptionalParams = {
    requestOptions: {},
  },
): Promise<CopyAuthorization> {
  const result = await _grantCopyAuthorizationSend(
    context,
    analyzerId,
    targetAzureResourceId,
    options,
  );
  return _grantCopyAuthorizationDeserialize(result);
}

export function _copySend(
  context: Client,
  analyzerId: string,
  sourceAnalyzerId: string,
  options: ContentAnalyzersCopyOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}:copy{?api%2Dversion,allowReplace}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
      allowReplace: options?.allowReplace,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: {
      sourceAzureResourceId: options?.sourceAzureResourceId,
      sourceRegion: options?.sourceRegion,
      sourceAnalyzerId: sourceAnalyzerId,
    },
  });
}

export async function _copyDeserialize(result: PathUncheckedResponse): Promise<ContentAnalyzer> {
  const expectedStatuses = ["202", "200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  if (result?.body !== undefined) {
    return contentAnalyzerDeserializer(result.body);
  }
  throw createRestError(`Expected a result in the response at position "result.body"`, result);
}

/** Create a copy of the source analyzer to the current location. */
export function copy(
  context: Client,
  analyzerId: string,
  sourceAnalyzerId: string,
  options: ContentAnalyzersCopyOptionalParams = { requestOptions: {} },
): PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer> {
  return getLongRunningPoller(context, _copyDeserialize, ["202", "200"], {
    updateIntervalInMs: options?.updateIntervalInMs,
    abortSignal: options?.abortSignal,
    getInitialResponse: () => _copySend(context, analyzerId, sourceAnalyzerId, options),
    resourceLocationConfig: "operation-location",
  }) as PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer>;
}

export function _deleteResultSend(
  context: Client,
  operationId: string,
  options: ContentAnalyzersDeleteResultOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzerResults/{operationId}{?api%2Dversion}",
    {
      operationId: operationId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).delete({ ...operationOptionsToRequestParameters(options) });
}

export async function _deleteResultDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return;
}

/** Mark the result of an analysis operation for deletion. */
export async function deleteResult(
  context: Client,
  operationId: string,
  options: ContentAnalyzersDeleteResultOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _deleteResultSend(context, operationId, options);
  return _deleteResultDeserialize(result);
}

export function _getResultFileSend(
  context: Client,
  operationId: string,
  path: string,
  options: ContentAnalyzersGetResultFileOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const expandedPath = expandUrlTemplate(
    "/analyzerResults/{operationId}/files/{+path}{?api%2Dversion}",
    {
      operationId: operationId,
      path: path,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(expandedPath).get({
    ...operationOptionsToRequestParameters(options),
    headers: { accept: "*/*", ...options.requestOptions?.headers },
  });
}

export async function _getResultFileDeserialize(
  result: PathUncheckedResponse,
): Promise<Uint8Array> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return result.body;
}

/** Get a file associated with the result of an analysis operation. */
export async function getResultFile(
  context: Client,
  operationId: string,
  path: string,
  options: ContentAnalyzersGetResultFileOptionalParams = { requestOptions: {} },
): Promise<Uint8Array> {
  const result = await _getResultFileSend(context, operationId, path, options);
  return _getResultFileDeserialize(result);
}

export function _getResultSend(
  context: Client,
  operationId: string,
  options: ContentAnalyzersGetResultOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzerResults/{operationId}{?api%2Dversion}",
    {
      operationId: operationId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _getResultDeserialize(
  result: PathUncheckedResponse,
): Promise<ContentAnalyzerAnalyzeOperationStatus> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentAnalyzerAnalyzeOperationStatusDeserializer(result.body);
}

/** Get the result of an analysis operation. */
export async function getResult(
  context: Client,
  operationId: string,
  options: ContentAnalyzersGetResultOptionalParams = { requestOptions: {} },
): Promise<ContentAnalyzerAnalyzeOperationStatus> {
  const result = await _getResultSend(context, operationId, options);
  return _getResultDeserialize(result);
}

export function _analyzeBinarySend(
  context: Client,
  analyzerId: string,
  contentType: string,
  input: Uint8Array,
  options: ContentAnalyzersAnalyzeBinaryOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}:analyzeBinary{?api%2Dversion,stringEncoding,processingLocation,range}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
      stringEncoding: options?.stringEncoding,
      processingLocation: options?.processingLocation,
      range: options?.range,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: contentType,
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: input,
  });
}

export async function _analyzeBinaryDeserialize(
  result: PathUncheckedResponse,
): Promise<AnalyzeResult> {
  const expectedStatuses = ["202", "200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }
  // Only check result.body for analyzeBinary
  if (result?.body !== undefined) {
    return analyzeResultDeserializer(result.body);
  }
  throw createRestError(`Expected a result in the response at position "result.body"`, result);
}

/** Extract content and fields from input. */
export function analyzeBinary(
  context: Client,
  analyzerId: string,
  contentType: string,
  input: Uint8Array,
  options: ContentAnalyzersAnalyzeBinaryOptionalParams = { requestOptions: {} },
): PollerLike<OperationState<AnalyzeResult>, AnalyzeResult> {
  return getLongRunningPoller(context, _analyzeBinaryDeserialize, ["202", "200"], {
    updateIntervalInMs: options?.updateIntervalInMs,
    abortSignal: options?.abortSignal,
    getInitialResponse: () => _analyzeBinarySend(context, analyzerId, contentType, input, options),
    resourceLocationConfig: "operation-location",
  }) as PollerLike<OperationState<AnalyzeResult>, AnalyzeResult>;
}

export function _analyzeSend(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersAnalyzeOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}:analyze{?api%2Dversion,stringEncoding,processingLocation}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
      stringEncoding: options?.stringEncoding,
      processingLocation: options?.processingLocation,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).post({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: {
      inputs: !options?.inputs ? options?.inputs : analyzeInputArraySerializer(options?.inputs),
      modelDeployments: options?.modelDeployments,
    },
  });
}

export async function _analyzeDeserialize(result: PathUncheckedResponse): Promise<AnalyzeResult> {
  const expectedStatuses = ["202", "200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }
  // Only check result.body for analyze
  if (result?.body !== undefined) {
    return analyzeResultDeserializer(result.body);
  }
  throw createRestError(`Expected a result in the response at position "result.body"`, result);
}

/** Extract content and fields from input. */
export function analyze(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersAnalyzeOptionalParams = { requestOptions: {} },
): PollerLike<OperationState<AnalyzeResult>, AnalyzeResult> {
  return getLongRunningPoller(context, _analyzeDeserialize, ["202", "200"], {
    updateIntervalInMs: options?.updateIntervalInMs,
    abortSignal: options?.abortSignal,
    getInitialResponse: () => _analyzeSend(context, analyzerId, options),
    resourceLocationConfig: "operation-location",
  }) as PollerLike<OperationState<AnalyzeResult>, AnalyzeResult>;
}

export function _listSend(
  context: Client,
  options: ContentAnalyzersListOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers{?api%2Dversion}",
    {
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _listDeserialize(
  result: PathUncheckedResponse,
): Promise<_PagedContentAnalyzer> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return _pagedContentAnalyzerDeserializer(result.body);
}

/** List analyzers. */
export function list(
  context: Client,
  options: ContentAnalyzersListOptionalParams = { requestOptions: {} },
): PagedAsyncIterableIterator<ContentAnalyzer> {
  return buildPagedAsyncIterator(
    context,
    () => _listSend(context, options),
    _listDeserialize,
    ["200"],
    { itemName: "value", nextLinkName: "nextLink" },
  );
}

export function _$deleteSend(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersDeleteOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}{?api%2Dversion}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).delete({
    ...operationOptionsToRequestParameters(options),
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      ...options.requestOptions?.headers,
    },
  });
}

export async function _$deleteDeserialize(result: PathUncheckedResponse): Promise<void> {
  const expectedStatuses = ["204"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return;
}

/** Delete analyzer. */
/**
 *  @fixme delete is a reserved word that cannot be used as an operation name.
 *         Please add @clientName("clientName") or @clientName("<JS-Specific-Name>", "javascript")
 *         to the operation to override the generated name.
 */
export async function $delete(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersDeleteOptionalParams = { requestOptions: {} },
): Promise<void> {
  const result = await _$deleteSend(context, analyzerId, options);
  return _$deleteDeserialize(result);
}

export function _getSend(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersGetOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}{?api%2Dversion}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _getDeserialize(result: PathUncheckedResponse): Promise<ContentAnalyzer> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentAnalyzerDeserializer(result.body);
}

/** Get analyzer properties. */
export async function get(
  context: Client,
  analyzerId: string,
  options: ContentAnalyzersGetOptionalParams = { requestOptions: {} },
): Promise<ContentAnalyzer> {
  const result = await _getSend(context, analyzerId, options);
  return _getDeserialize(result);
}

export function _updateSend(
  context: Client,
  analyzerId: string,
  resource: ContentAnalyzer,
  options: ContentAnalyzersUpdateOptionalParams = { requestOptions: {} },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}{?api%2Dversion}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).patch({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/merge-patch+json",
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: contentAnalyzerSerializer(resource),
  });
}

export async function _updateDeserialize(result: PathUncheckedResponse): Promise<ContentAnalyzer> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentAnalyzerDeserializer(result.body);
}

/** Update analyzer properties. */
export async function update(
  context: Client,
  analyzerId: string,
  resource: ContentAnalyzer,
  options: ContentAnalyzersUpdateOptionalParams = { requestOptions: {} },
): Promise<ContentAnalyzer> {
  const result = await _updateSend(context, analyzerId, resource, options);
  return _updateDeserialize(result);
}

export function _createOrReplaceSend(
  context: Client,
  analyzerId: string,
  resource: ContentAnalyzer,
  options: ContentAnalyzersCreateOrReplaceOptionalParams = {
    requestOptions: {},
  },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}{?api%2Dversion,allowReplace}",
    {
      analyzerId: analyzerId,
      "api%2Dversion": context.apiVersion,
      allowReplace: options?.allowReplace,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).put({
    ...operationOptionsToRequestParameters(options),
    contentType: "application/json",
    headers: {
      ...(options?.clientRequestId !== undefined
        ? { "x-ms-client-request-id": options?.clientRequestId }
        : {}),
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: contentAnalyzerSerializer(resource),
  });
}

export async function _createOrReplaceDeserialize(
  result: PathUncheckedResponse,
): Promise<ContentAnalyzer> {
  const expectedStatuses = ["201", "200", "202"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }
  // Only check result.body for analyzer creation
  if (result?.body !== undefined) {
    return contentAnalyzerDeserializer(result.body);
  }
  throw createRestError(`Expected a result in the response at position "result.body"`, result);
}

/** Create a new analyzer asynchronously. */
export function createOrReplace(
  context: Client,
  analyzerId: string,
  resource: ContentAnalyzer,
  options: ContentAnalyzersCreateOrReplaceOptionalParams = {
    requestOptions: {},
  },
): PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer> {
  return getLongRunningPoller(context, _createOrReplaceDeserialize, ["201", "200", "202"], {
    updateIntervalInMs: options?.updateIntervalInMs,
    abortSignal: options?.abortSignal,
    getInitialResponse: () => _createOrReplaceSend(context, analyzerId, resource, options),
    resourceLocationConfig: "original-uri",
  }) as PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer>;
}

export function _getOperationStatusSend(
  context: Client,
  analyzerId: string,
  operationId: string,
  options: ContentAnalyzersGetOperationStatusOptionalParams = {
    requestOptions: {},
  },
): StreamableMethod {
  const path = expandUrlTemplate(
    "/analyzers/{analyzerId}/operations/{operationId}{?api%2Dversion}",
    {
      analyzerId: analyzerId,
      operationId: operationId,
      "api%2Dversion": context.apiVersion,
    },
    {
      allowReserved: options?.requestOptions?.skipUrlEncoding,
    },
  );
  return context.path(path).get({
    ...operationOptionsToRequestParameters(options),
    headers: {
      accept: "application/json",
      ...options.requestOptions?.headers,
    },
  });
}

export async function _getOperationStatusDeserialize(
  result: PathUncheckedResponse,
): Promise<ContentAnalyzerOperationStatus> {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    throw createRestError(result);
  }

  return contentAnalyzerOperationStatusDeserializer(result.body);
}

/** Get the status of an analyzer creation operation. */
export async function getOperationStatus(
  context: Client,
  analyzerId: string,
  operationId: string,
  options: ContentAnalyzersGetOperationStatusOptionalParams = {
    requestOptions: {},
  },
): Promise<ContentAnalyzerOperationStatus> {
  const result = await _getOperationStatusSend(context, analyzerId, operationId, options);
  return _getOperationStatusDeserialize(result);
}
