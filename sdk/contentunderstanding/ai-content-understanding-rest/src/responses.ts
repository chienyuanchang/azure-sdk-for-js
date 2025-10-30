// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { RawHttpHeaders } from "@azure/core-rest-pipeline";
import type { HttpResponse, ErrorResponse } from "@azure-rest/core-client";
import type {
  ContentAnalyzerOperationStatusOutput,
  ContentAnalyzerOutput,
  PagedContentAnalyzerOutput,
  ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput,
  ContentAnalyzerAnalyzeOperationStatusOutput,
  ResourceOperationStatusContentAnalyzerContentAnalyzerErrorOutput,
  CopyAuthorizationOutput,
  ContentUnderstandingDefaultsOutput,
} from "./outputModels.js";

/** The request has succeeded. */
export interface GetOperationStatus200Response extends HttpResponse {
  status: "200";
  body: ContentAnalyzerOperationStatusOutput;
}

export interface GetOperationStatusDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GetOperationStatusDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GetOperationStatusDefaultHeaders;
}

export interface CreateOrReplace200Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
  /** The location for monitoring the operation state. */
  "operation-location": string;
}

/** The request has succeeded. */
export interface CreateOrReplace200Response extends HttpResponse {
  status: "200";
  body: ContentAnalyzerOutput;
  headers: RawHttpHeaders & CreateOrReplace200Headers;
}

export interface CreateOrReplace201Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
  /** The location for monitoring the operation state. */
  "operation-location": string;
}

/** The request has succeeded and a new resource has been created as a result. */
export interface CreateOrReplace201Response extends HttpResponse {
  status: "201";
  body: ContentAnalyzerOutput;
  headers: RawHttpHeaders & CreateOrReplace201Headers;
}

export interface CreateOrReplaceDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface CreateOrReplaceDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & CreateOrReplaceDefaultHeaders;
}

/** The final response for long-running createOrReplace operation */
export interface CreateOrReplaceLogicalResponse extends HttpResponse {
  status: "200";
  body: ContentAnalyzerOutput;
}

export interface Update200Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has succeeded. */
export interface Update200Response extends HttpResponse {
  status: "200";
  body: ContentAnalyzerOutput;
  headers: RawHttpHeaders & Update200Headers;
}

export interface UpdateDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface UpdateDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & UpdateDefaultHeaders;
}

export interface Get200Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has succeeded. */
export interface Get200Response extends HttpResponse {
  status: "200";
  body: ContentAnalyzerOutput;
  headers: RawHttpHeaders & Get200Headers;
}

export interface GetDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GetDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GetDefaultHeaders;
}

export interface Delete204Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** There is no content to send for this request, but the headers may be useful. */
export interface Delete204Response extends HttpResponse {
  status: "204";
  headers: RawHttpHeaders & Delete204Headers;
}

export interface DeleteDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface DeleteDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & DeleteDefaultHeaders;
}

export interface List200Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has succeeded. */
export interface List200Response extends HttpResponse {
  status: "200";
  body: PagedContentAnalyzerOutput;
  headers: RawHttpHeaders & List200Headers;
}

export interface ListDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface ListDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & ListDefaultHeaders;
}

export interface Analyze202Headers {
  /** The location for monitoring the operation state. */
  "operation-location": string;
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has been accepted for processing, but processing has not yet completed. */
export interface Analyze202Response extends HttpResponse {
  status: "202";
  body: ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput;
  headers: RawHttpHeaders & Analyze202Headers;
}

export interface AnalyzeDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface AnalyzeDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & AnalyzeDefaultHeaders;
}

/** The final response for long-running analyze operation */
export interface AnalyzeLogicalResponse extends HttpResponse {
  status: "200";
  body: ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput;
}

export interface AnalyzeBinary202Headers {
  /** The location for monitoring the operation state. */
  "operation-location": string;
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has been accepted for processing, but processing has not yet completed. */
export interface AnalyzeBinary202Response extends HttpResponse {
  status: "202";
  body: ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput;
  headers: RawHttpHeaders & AnalyzeBinary202Headers;
}

export interface AnalyzeBinaryDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface AnalyzeBinaryDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & AnalyzeBinaryDefaultHeaders;
}

/** The final response for long-running analyzeBinary operation */
export interface AnalyzeBinaryLogicalResponse extends HttpResponse {
  status: "200";
  body: ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput;
}

/** The request has succeeded. */
export interface GetResult200Response extends HttpResponse {
  status: "200";
  body: ContentAnalyzerAnalyzeOperationStatusOutput;
}

export interface GetResultDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GetResultDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GetResultDefaultHeaders;
}

export interface GetResultFile200Headers {
  /** Response content type. */
  "content-type": "application/octet-stream";
}

/** The request has succeeded. */
export interface GetResultFile200Response extends HttpResponse {
  status: "200";
  /** Value may contain any sequence of octets */
  body: Uint8Array;
  headers: RawHttpHeaders & GetResultFile200Headers;
}

export interface GetResultFileDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GetResultFileDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GetResultFileDefaultHeaders;
}

/** There is no content to send for this request, but the headers may be useful. */
export interface DeleteResult204Response extends HttpResponse {
  status: "204";
}

export interface DeleteResultDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface DeleteResultDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & DeleteResultDefaultHeaders;
}

export interface Copy202Headers {
  /** The location for monitoring the operation state. */
  "operation-location": string;
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has been accepted for processing, but processing has not yet completed. */
export interface Copy202Response extends HttpResponse {
  status: "202";
  body: ResourceOperationStatusContentAnalyzerContentAnalyzerErrorOutput;
  headers: RawHttpHeaders & Copy202Headers;
}

export interface CopyDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface CopyDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & CopyDefaultHeaders;
}

/** The final response for long-running copy operation */
export interface CopyLogicalResponse extends HttpResponse {
  status: "200";
  body: ResourceOperationStatusContentAnalyzerContentAnalyzerErrorOutput;
}

export interface GrantCopyAuthorization200Headers {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The request has succeeded. */
export interface GrantCopyAuthorization200Response extends HttpResponse {
  status: "200";
  body: CopyAuthorizationOutput;
  headers: RawHttpHeaders & GrantCopyAuthorization200Headers;
}

export interface GrantCopyAuthorizationDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GrantCopyAuthorizationDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GrantCopyAuthorizationDefaultHeaders;
}

/** The request has succeeded. */
export interface GetDefaults200Response extends HttpResponse {
  status: "200";
  body: ContentUnderstandingDefaultsOutput;
}

export interface GetDefaultsDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface GetDefaultsDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & GetDefaultsDefaultHeaders;
}

/** The request has succeeded. */
export interface UpdateDefaults200Response extends HttpResponse {
  status: "200";
  body: ContentUnderstandingDefaultsOutput;
}

export interface UpdateDefaultsDefaultHeaders {
  /** String error code indicating what went wrong. */
  "x-ms-error-code"?: string;
}

export interface UpdateDefaultsDefaultResponse extends HttpResponse {
  status: string;
  body: ErrorResponse;
  headers: RawHttpHeaders & UpdateDefaultsDefaultHeaders;
}
