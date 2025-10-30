// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { RawHttpHeadersInput } from "@azure/core-rest-pipeline";
import type { RequestParameters } from "@azure-rest/core-client";
import type {
  ContentAnalyzer,
  StringEncoding,
  AnalyzeRequest,
  ContentUnderstandingDefaultsMergePatchUpdate,
} from "./models.js";

export type GetOperationStatusParameters = RequestParameters;

export interface CreateOrReplaceHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface CreateOrReplaceBodyParam {
  /** The resource instance. */
  body: ContentAnalyzer;
}

export interface CreateOrReplaceQueryParamProperties {
  /** Allow the operation to replace an existing resource. */
  allowReplace?: boolean;
}

export interface CreateOrReplaceQueryParam {
  queryParameters?: CreateOrReplaceQueryParamProperties;
}

export interface CreateOrReplaceHeaderParam {
  headers?: RawHttpHeadersInput & CreateOrReplaceHeaders;
}

export type CreateOrReplaceParameters = CreateOrReplaceQueryParam &
  CreateOrReplaceHeaderParam &
  CreateOrReplaceBodyParam &
  RequestParameters;

export interface UpdateHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

/** The resource instance. */
export type ContentAnalyzerResourceMergeAndPatch = Partial<ContentAnalyzer>;

export interface UpdateBodyParam {
  /** The resource instance. */
  body: ContentAnalyzerResourceMergeAndPatch;
}

export interface UpdateHeaderParam {
  headers?: RawHttpHeadersInput & UpdateHeaders;
}

export interface UpdateMediaTypesParam {
  /** This request has a JSON Merge Patch body. */
  contentType: "application/merge-patch+json";
}

export type UpdateParameters = UpdateHeaderParam &
  UpdateMediaTypesParam &
  UpdateBodyParam &
  RequestParameters;

export interface GetHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface GetHeaderParam {
  headers?: RawHttpHeadersInput & GetHeaders;
}

export type GetParameters = GetHeaderParam & RequestParameters;

export interface DeleteHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface DeleteHeaderParam {
  headers?: RawHttpHeadersInput & DeleteHeaders;
}

export type DeleteParameters = DeleteHeaderParam & RequestParameters;

export interface ListHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface ListHeaderParam {
  headers?: RawHttpHeadersInput & ListHeaders;
}

export type ListParameters = ListHeaderParam & RequestParameters;

export interface AnalyzeHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface AnalyzeBodyParam {
  body: AnalyzeRequest;
}

export interface AnalyzeQueryParamProperties {
  /**
   * The encoding format for content spans in the response.
   *
   * Possible values: "codePoint", "utf16", "utf8"
   */
  stringEncoding?: StringEncoding;
}

export interface AnalyzeQueryParam {
  queryParameters?: AnalyzeQueryParamProperties;
}

export interface AnalyzeHeaderParam {
  headers?: RawHttpHeadersInput & AnalyzeHeaders;
}

export type AnalyzeParameters = AnalyzeQueryParam &
  AnalyzeHeaderParam &
  AnalyzeBodyParam &
  RequestParameters;

export interface AnalyzeBinaryHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface AnalyzeBinaryBodyParam {
  /** The binary content of the document to analyze. */
  body: string;
}

export interface AnalyzeBinaryQueryParamProperties {
  /**
   * The encoding format for content spans in the response.
   *
   * Possible values: "codePoint", "utf16", "utf8"
   */
  stringEncoding?: StringEncoding;
  /** Range of the input to analyze (ex. `1-3,5,9-`).  Document content uses 1-based page numbers, while audio visual content uses integer milliseconds. */
  range?: string;
}

export interface AnalyzeBinaryQueryParam {
  queryParameters?: AnalyzeBinaryQueryParamProperties;
}

export interface AnalyzeBinaryHeaderParam {
  headers?: RawHttpHeadersInput & AnalyzeBinaryHeaders;
}

export interface AnalyzeBinaryMediaTypesParam {
  /** Request content type. */
  contentType: string;
}

export type AnalyzeBinaryParameters = AnalyzeBinaryQueryParam &
  AnalyzeBinaryHeaderParam &
  AnalyzeBinaryMediaTypesParam &
  AnalyzeBinaryBodyParam &
  RequestParameters;
export type GetResultParameters = RequestParameters;

/** This is the wrapper object for the parameter `path` with allowReserved set to true. */
export interface GetResultFilePathPathParam {
  /** A sequence of textual characters. */
  value: string;
  /** Whether to allow reserved characters */
  allowReserved: true;
}

export type GetResultFileParameters = RequestParameters;
export type DeleteResultParameters = RequestParameters;

export interface CopyHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface CopyBodyParam {
  body: {
    sourceAzureResourceId?: string;
    sourceRegion?: string;
    sourceAnalyzerId: string;
  };
}

export interface CopyQueryParamProperties {
  /** Allow the operation to replace an existing resource. */
  allowReplace?: boolean;
}

export interface CopyQueryParam {
  queryParameters?: CopyQueryParamProperties;
}

export interface CopyHeaderParam {
  headers?: RawHttpHeadersInput & CopyHeaders;
}

export type CopyParameters = CopyQueryParam &
  CopyHeaderParam &
  CopyBodyParam &
  RequestParameters;

export interface GrantCopyAuthorizationHeaders {
  /** An opaque, globally-unique, client-generated string identifier for the request. */
  "x-ms-client-request-id"?: string;
}

export interface GrantCopyAuthorizationBodyParam {
  body: { targetAzureResourceId: string; targetRegion?: string };
}

export interface GrantCopyAuthorizationHeaderParam {
  headers?: RawHttpHeadersInput & GrantCopyAuthorizationHeaders;
}

export type GrantCopyAuthorizationParameters =
  GrantCopyAuthorizationHeaderParam &
    GrantCopyAuthorizationBodyParam &
    RequestParameters;
export type GetDefaultsParameters = RequestParameters;

export interface UpdateDefaultsBodyParam {
  body: ContentUnderstandingDefaultsMergePatchUpdate;
}

export type UpdateDefaultsParameters = UpdateDefaultsBodyParam &
  RequestParameters;
