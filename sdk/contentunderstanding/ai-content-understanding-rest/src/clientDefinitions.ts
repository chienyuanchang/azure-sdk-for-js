// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  GetOperationStatusParameters,
  CreateOrReplaceParameters,
  UpdateParameters,
  GetParameters,
  DeleteParameters,
  ListParameters,
  AnalyzeParameters,
  AnalyzeBinaryParameters,
  GetResultParameters,
  DeleteResultParameters,
  GetResultFileParameters,
  GetResultFilePathPathParam,
  CopyParameters,
  GrantCopyAuthorizationParameters,
  GetDefaultsParameters,
  UpdateDefaultsParameters,
} from "./parameters.js";
import type {
  GetOperationStatus200Response,
  GetOperationStatusDefaultResponse,
  CreateOrReplace200Response,
  CreateOrReplace201Response,
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
  AnalyzeDefaultResponse,
  AnalyzeBinary202Response,
  AnalyzeBinaryDefaultResponse,
  GetResult200Response,
  GetResultDefaultResponse,
  DeleteResult204Response,
  DeleteResultDefaultResponse,
  GetResultFile200Response,
  GetResultFileDefaultResponse,
  Copy202Response,
  CopyDefaultResponse,
  GrantCopyAuthorization200Response,
  GrantCopyAuthorizationDefaultResponse,
  GetDefaults200Response,
  GetDefaultsDefaultResponse,
  UpdateDefaults200Response,
  UpdateDefaultsDefaultResponse,
} from "./responses.js";
import type { Client, StreamableMethod } from "@azure-rest/core-client";

export interface GetOperationStatus {
  /** Get the status of an analyzer creation operation. */
  get(
    options?: GetOperationStatusParameters,
  ): StreamableMethod<
    GetOperationStatus200Response | GetOperationStatusDefaultResponse
  >;
}

export interface CreateOrReplace {
  /** Create a new analyzer asynchronously. */
  put(
    options: CreateOrReplaceParameters,
  ): StreamableMethod<
    | CreateOrReplace200Response
    | CreateOrReplace201Response
    | CreateOrReplaceDefaultResponse
  >;
  /** Update analyzer properties. */
  patch(
    options: UpdateParameters,
  ): StreamableMethod<Update200Response | UpdateDefaultResponse>;
  /** Get analyzer properties. */
  get(
    options?: GetParameters,
  ): StreamableMethod<Get200Response | GetDefaultResponse>;
  /** Delete analyzer. */
  delete(
    options?: DeleteParameters,
  ): StreamableMethod<Delete204Response | DeleteDefaultResponse>;
}

export interface List {
  /** List analyzers. */
  get(
    options?: ListParameters,
  ): StreamableMethod<List200Response | ListDefaultResponse>;
}

export interface Analyze {
  /** Extract content and fields from input. */
  post(
    options: AnalyzeParameters,
  ): StreamableMethod<Analyze202Response | AnalyzeDefaultResponse>;
}

export interface AnalyzeBinary {
  /** Extract content and fields from input. */
  post(
    options: AnalyzeBinaryParameters,
  ): StreamableMethod<AnalyzeBinary202Response | AnalyzeBinaryDefaultResponse>;
}

export interface GetResult {
  /** Get the result of an analysis operation. */
  get(
    options?: GetResultParameters,
  ): StreamableMethod<GetResult200Response | GetResultDefaultResponse>;
  /** Mark the result of an analysis operation for deletion. */
  delete(
    options?: DeleteResultParameters,
  ): StreamableMethod<DeleteResult204Response | DeleteResultDefaultResponse>;
}

export interface GetResultFile {
  /** Get a file associated with the result of an analysis operation. */
  get(
    options?: GetResultFileParameters,
  ): StreamableMethod<GetResultFile200Response | GetResultFileDefaultResponse>;
}

export interface Copy {
  /** Create a copy of the source analyzer to the current location. */
  post(
    options: CopyParameters,
  ): StreamableMethod<Copy202Response | CopyDefaultResponse>;
}

export interface GrantCopyAuthorization {
  /** Get authorization for copying this analyzer to another location. */
  post(
    options: GrantCopyAuthorizationParameters,
  ): StreamableMethod<
    GrantCopyAuthorization200Response | GrantCopyAuthorizationDefaultResponse
  >;
}

export interface GetDefaults {
  /** Return default settings for this Content Understanding resource. */
  get(
    options?: GetDefaultsParameters,
  ): StreamableMethod<GetDefaults200Response | GetDefaultsDefaultResponse>;
  /** Return default settings for this Content Understanding resource. */
  patch(
    options: UpdateDefaultsParameters,
  ): StreamableMethod<
    UpdateDefaults200Response | UpdateDefaultsDefaultResponse
  >;
}

export interface Routes {
  /** Resource for '/analyzers/\{analyzerId\}/operations/\{operationId\}' has methods for the following verbs: get */
  (
    path: "/analyzers/{analyzerId}/operations/{operationId}",
    analyzerId: string,
    operationId: string,
  ): GetOperationStatus;
  /** Resource for '/analyzers/\{analyzerId\}' has methods for the following verbs: put, patch, get, delete */
  (path: "/analyzers/{analyzerId}", analyzerId: string): CreateOrReplace;
  /** Resource for '/analyzers' has methods for the following verbs: get */
  (path: "/analyzers"): List;
  /** Resource for '/analyzers/\{analyzerId\}:analyze' has methods for the following verbs: post */
  (path: "/analyzers/{analyzerId}:analyze", analyzerId: string): Analyze;
  /** Resource for '/analyzers/\{analyzerId\}:analyzeBinary' has methods for the following verbs: post */
  (
    path: "/analyzers/{analyzerId}:analyzeBinary",
    analyzerId: string,
  ): AnalyzeBinary;
  /** Resource for '/analyzerResults/\{operationId\}' has methods for the following verbs: get, delete */
  (path: "/analyzerResults/{operationId}", operationId: string): GetResult;
  /** Resource for '/analyzerResults/\{operationId\}/files/\{path\}' has methods for the following verbs: get */
  (
    path: "/analyzerResults/{operationId}/files/{path}",
    operationId: string,
    path: GetResultFilePathPathParam,
  ): GetResultFile;
  /** Resource for '/analyzers/\{analyzerId\}:copy' has methods for the following verbs: post */
  (path: "/analyzers/{analyzerId}:copy", analyzerId: string): Copy;
  /** Resource for '/analyzers/\{analyzerId\}:grantCopyAuthorization' has methods for the following verbs: post */
  (
    path: "/analyzers/{analyzerId}:grantCopyAuthorization",
    analyzerId: string,
  ): GrantCopyAuthorization;
  /** Resource for '/defaults' has methods for the following verbs: get, patch */
  (path: "/defaults"): GetDefaults;
}

export type ContentUnderstandingClient = Client & {
  path: Routes;
};
