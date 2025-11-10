// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { ContentUnderstandingContext } from "../../api/contentUnderstandingContext.js";
import {
  updateDefaults,
  getDefaults,
  grantCopyAuthorization,
  copy,
  deleteResult,
  getResultFile,
  getResult,
  analyzeBinary,
  analyze,
  list,
  $delete,
  get,
  update,
  createOrReplace,
  getOperationStatus,
} from "../../api/contentAnalyzers/operations.js";
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
} from "../../api/contentAnalyzers/options.js";
import type {
  ContentAnalyzerOperationStatus,
  ContentAnalyzer,
  AnalyzeResult,
  ContentAnalyzerAnalyzeOperationStatus,
  CopyAuthorization,
  ContentUnderstandingDefaults,
} from "../../models/models.js";
import type { PagedAsyncIterableIterator } from "../../static-helpers/pagingHelpers.js";
import type { PollerLike, OperationState } from "@azure/core-lro";

/** Interface representing a ContentAnalyzers operations. */
export interface ContentAnalyzersOperations {
  /** Return default settings for this Content Understanding resource. */
  updateDefaults: (
    options?: ContentAnalyzersUpdateDefaultsOptionalParams,
  ) => Promise<ContentUnderstandingDefaults>;
  /** Return default settings for this Content Understanding resource. */
  getDefaults: (
    options?: ContentAnalyzersGetDefaultsOptionalParams,
  ) => Promise<ContentUnderstandingDefaults>;
  /** Get authorization for copying this analyzer to another location. */
  grantCopyAuthorization: (
    analyzerId: string,
    targetAzureResourceId: string,
    options?: ContentAnalyzersGrantCopyAuthorizationOptionalParams,
  ) => Promise<CopyAuthorization>;
  /** Create a copy of the source analyzer to the current location. */
  copy: (
    analyzerId: string,
    sourceAnalyzerId: string,
    options?: ContentAnalyzersCopyOptionalParams,
  ) => PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer>;
  /** Mark the result of an analysis operation for deletion. */
  deleteResult: (
    operationId: string,
    options?: ContentAnalyzersDeleteResultOptionalParams,
  ) => Promise<void>;
  /** Get a file associated with the result of an analysis operation. */
  getResultFile: (
    operationId: string,
    path: string,
    options?: ContentAnalyzersGetResultFileOptionalParams,
  ) => Promise<Uint8Array>;
  /** Get the result of an analysis operation. */
  getResult: (
    operationId: string,
    options?: ContentAnalyzersGetResultOptionalParams,
  ) => Promise<ContentAnalyzerAnalyzeOperationStatus>;
  /** Extract content and fields from input. */
  analyzeBinary: (
    analyzerId: string,
    contentType: string,
    input: Uint8Array,
    options?: ContentAnalyzersAnalyzeBinaryOptionalParams,
  ) => PollerLike<OperationState<AnalyzeResult>, AnalyzeResult>;
  /** Extract content and fields from input. */
  analyze: (
    analyzerId: string,
    options?: ContentAnalyzersAnalyzeOptionalParams,
  ) => PollerLike<OperationState<AnalyzeResult>, AnalyzeResult>;
  /** List analyzers. */
  list: (
    options?: ContentAnalyzersListOptionalParams,
  ) => PagedAsyncIterableIterator<ContentAnalyzer>;
  /** Delete analyzer. */
  /**
   *  @fixme delete is a reserved word that cannot be used as an operation name.
   *         Please add @clientName("clientName") or @clientName("<JS-Specific-Name>", "javascript")
   *         to the operation to override the generated name.
   */
  delete: (analyzerId: string, options?: ContentAnalyzersDeleteOptionalParams) => Promise<void>;
  /** Get analyzer properties. */
  get: (
    analyzerId: string,
    options?: ContentAnalyzersGetOptionalParams,
  ) => Promise<ContentAnalyzer>;
  /** Update analyzer properties. */
  update: (
    analyzerId: string,
    resource: ContentAnalyzer,
    options?: ContentAnalyzersUpdateOptionalParams,
  ) => Promise<ContentAnalyzer>;
  /** Create a new analyzer asynchronously. */
  createOrReplace: (
    analyzerId: string,
    resource: ContentAnalyzer,
    options?: ContentAnalyzersCreateOrReplaceOptionalParams,
  ) => PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer>;
  /** Get the status of an analyzer creation operation. */
  getOperationStatus: (
    analyzerId: string,
    operationId: string,
    options?: ContentAnalyzersGetOperationStatusOptionalParams,
  ) => Promise<ContentAnalyzerOperationStatus>;
}

function _getContentAnalyzers(context: ContentUnderstandingContext) {
  return {
    updateDefaults: (options?: ContentAnalyzersUpdateDefaultsOptionalParams) =>
      updateDefaults(context, options),
    getDefaults: (options?: ContentAnalyzersGetDefaultsOptionalParams) =>
      getDefaults(context, options),
    grantCopyAuthorization: (
      analyzerId: string,
      targetAzureResourceId: string,
      options?: ContentAnalyzersGrantCopyAuthorizationOptionalParams,
    ) => grantCopyAuthorization(context, analyzerId, targetAzureResourceId, options),
    copy: (
      analyzerId: string,
      sourceAnalyzerId: string,
      options?: ContentAnalyzersCopyOptionalParams,
    ) => copy(context, analyzerId, sourceAnalyzerId, options),
    deleteResult: (operationId: string, options?: ContentAnalyzersDeleteResultOptionalParams) =>
      deleteResult(context, operationId, options),
    getResultFile: (
      operationId: string,
      path: string,
      options?: ContentAnalyzersGetResultFileOptionalParams,
    ) => getResultFile(context, operationId, path, options),
    getResult: (operationId: string, options?: ContentAnalyzersGetResultOptionalParams) =>
      getResult(context, operationId, options),
    analyzeBinary: (
      analyzerId: string,
      contentType: string,
      input: Uint8Array,
      options?: ContentAnalyzersAnalyzeBinaryOptionalParams,
    ) => analyzeBinary(context, analyzerId, contentType, input, options),
    analyze: (analyzerId: string, options?: ContentAnalyzersAnalyzeOptionalParams) =>
      analyze(context, analyzerId, options),
    list: (options?: ContentAnalyzersListOptionalParams) => list(context, options),
    delete: (analyzerId: string, options?: ContentAnalyzersDeleteOptionalParams) =>
      $delete(context, analyzerId, options),
    get: (analyzerId: string, options?: ContentAnalyzersGetOptionalParams) =>
      get(context, analyzerId, options),
    update: (
      analyzerId: string,
      resource: ContentAnalyzer,
      options?: ContentAnalyzersUpdateOptionalParams,
    ) => update(context, analyzerId, resource, options),
    createOrReplace: (
      analyzerId: string,
      resource: ContentAnalyzer,
      options?: ContentAnalyzersCreateOrReplaceOptionalParams,
    ) => createOrReplace(context, analyzerId, resource, options),
    getOperationStatus: (
      analyzerId: string,
      operationId: string,
      options?: ContentAnalyzersGetOperationStatusOptionalParams,
    ) => getOperationStatus(context, analyzerId, operationId, options),
  };
}

export function _getContentAnalyzersOperations(
  context: ContentUnderstandingContext,
): ContentAnalyzersOperations {
  return {
    ..._getContentAnalyzers(context),
  };
}
