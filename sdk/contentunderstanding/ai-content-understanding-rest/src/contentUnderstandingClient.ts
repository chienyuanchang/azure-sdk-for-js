// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  ContentUnderstandingContext,
  ContentUnderstandingClientOptionalParams,
} from "./api/index.js";
import { createContentUnderstanding } from "./api/index.js";
import {
  updateDefaults,
  update,
  list,
  grantCopyAuthorization,
  getResultFile,
  getResult,
  getOperationStatus,
  getDefaults,
  get,
  deleteResult,
  $delete,
  createOrReplace,
  copy,
  analyzeBinary,
  analyze,
} from "./api/operations.js";
import type {
  UpdateDefaultsOptionalParams,
  UpdateOptionalParams,
  ListOptionalParams,
  GrantCopyAuthorizationOptionalParams,
  GetResultFileOptionalParams,
  GetResultOptionalParams,
  GetOperationStatusOptionalParams,
  GetDefaultsOptionalParams,
  GetOptionalParams,
  DeleteResultOptionalParams,
  DeleteOptionalParams,
  CreateOrReplaceOptionalParams,
  CopyOptionalParams,
  AnalyzeBinaryOptionalParams,
  AnalyzeOptionalParams,
} from "./api/options.js";
import type {
  AnalyzeResult,
  ContentAnalyzerAnalyzeOperationStatus,
  ContentAnalyzer,
  ContentAnalyzerOperationStatus,
  ContentUnderstandingDefaults,
  CopyAuthorization,
} from "./models/models.js";
import type { PagedAsyncIterableIterator } from "./static-helpers/pagingHelpers.js";
import type { KeyCredential, TokenCredential } from "@azure/core-auth";
import type { PollerLike, OperationState } from "@azure/core-lro";
import type { Pipeline } from "@azure/core-rest-pipeline";

export { ContentUnderstandingClientOptionalParams } from "./api/contentUnderstandingContext.js";

export class ContentUnderstandingClient {
  private _client: ContentUnderstandingContext;
  /** The pipeline used by this client to make requests */
  public readonly pipeline: Pipeline;

  constructor(
    endpointParam: string,
    credential: KeyCredential | TokenCredential,
    options: ContentUnderstandingClientOptionalParams = {},
  ) {
    const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
    const userAgentPrefix = prefixFromOptions
      ? `${prefixFromOptions} azsdk-js-client`
      : `azsdk-js-client`;
    this._client = createContentUnderstanding(endpointParam, credential, {
      ...options,
      userAgentOptions: { userAgentPrefix },
    });
    this.pipeline = this._client.pipeline;
  }

  /** Return default settings for this Content Understanding resource. */
  updateDefaults(
    options: UpdateDefaultsOptionalParams = { requestOptions: {} },
  ): Promise<ContentUnderstandingDefaults> {
    return updateDefaults(this._client, options);
  }

  /** Update analyzer properties. */
  update(
    analyzerId: string,
    resource: ContentAnalyzer,
    options: UpdateOptionalParams = { requestOptions: {} },
  ): Promise<ContentAnalyzer> {
    return update(this._client, analyzerId, resource, options);
  }

  /** List analyzers. */
  list(
    options: ListOptionalParams = { requestOptions: {} },
  ): PagedAsyncIterableIterator<ContentAnalyzer> {
    return list(this._client, options);
  }

  /** Get authorization for copying this analyzer to another location. */
  grantCopyAuthorization(
    analyzerId: string,
    targetAzureResourceId: string,
    options: GrantCopyAuthorizationOptionalParams = { requestOptions: {} },
  ): Promise<CopyAuthorization> {
    return grantCopyAuthorization(this._client, analyzerId, targetAzureResourceId, options);
  }

  /** Get a file associated with the result of an analysis operation. */
  getResultFile(
    operationId: string,
    path: string,
    options: GetResultFileOptionalParams = { requestOptions: {} },
  ): Promise<Uint8Array> {
    return getResultFile(this._client, operationId, path, options);
  }

  /** Get the result of an analysis operation. */
  getResult(
    operationId: string,
    options: GetResultOptionalParams = { requestOptions: {} },
  ): Promise<ContentAnalyzerAnalyzeOperationStatus> {
    return getResult(this._client, operationId, options);
  }

  /** Get the status of an analyzer creation operation. */
  getOperationStatus(
    analyzerId: string,
    operationId: string,
    options: GetOperationStatusOptionalParams = { requestOptions: {} },
  ): Promise<ContentAnalyzerOperationStatus> {
    return getOperationStatus(this._client, analyzerId, operationId, options);
  }

  /** Return default settings for this Content Understanding resource. */
  getDefaults(
    options: GetDefaultsOptionalParams = { requestOptions: {} },
  ): Promise<ContentUnderstandingDefaults> {
    return getDefaults(this._client, options);
  }

  /** Get analyzer properties. */
  get(
    analyzerId: string,
    options: GetOptionalParams = { requestOptions: {} },
  ): Promise<ContentAnalyzer> {
    return get(this._client, analyzerId, options);
  }

  /** Mark the result of an analysis operation for deletion. */
  deleteResult(
    operationId: string,
    options: DeleteResultOptionalParams = { requestOptions: {} },
  ): Promise<void> {
    return deleteResult(this._client, operationId, options);
  }

  /** Delete analyzer. */
  /**
   *  @fixme delete is a reserved word that cannot be used as an operation name.
   *         Please add @clientName("clientName") or @clientName("<JS-Specific-Name>", "javascript")
   *         to the operation to override the generated name.
   */
  delete(
    analyzerId: string,
    options: DeleteOptionalParams = { requestOptions: {} },
  ): Promise<void> {
    return $delete(this._client, analyzerId, options);
  }

  /** Create a new analyzer asynchronously. */
  createOrReplace(
    analyzerId: string,
    resource: ContentAnalyzer,
    options: CreateOrReplaceOptionalParams = { requestOptions: {} },
  ): PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer> {
    return createOrReplace(this._client, analyzerId, resource, options);
  }

  /** Create a copy of the source analyzer to the current location. */
  copy(
    analyzerId: string,
    sourceAnalyzerId: string,
    options: CopyOptionalParams = { requestOptions: {} },
  ): PollerLike<OperationState<ContentAnalyzer>, ContentAnalyzer> {
    return copy(this._client, analyzerId, sourceAnalyzerId, options);
  }

  /** Extract content and fields from input. */
  analyzeBinary(
    analyzerId: string,
    contentType: string,
    input: Uint8Array,
    options: AnalyzeBinaryOptionalParams = { requestOptions: {} },
  ): PollerLike<OperationState<AnalyzeResult>, AnalyzeResult> {
    return analyzeBinary(this._client, analyzerId, contentType, input, options);
  }

  /** Extract content and fields from input. */
  analyze(
    analyzerId: string,
    options: AnalyzeOptionalParams = { requestOptions: {} },
  ): PollerLike<OperationState<AnalyzeResult>, AnalyzeResult> {
    return analyze(this._client, analyzerId, options);
  }
}
