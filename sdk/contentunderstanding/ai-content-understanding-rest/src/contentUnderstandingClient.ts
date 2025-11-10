// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type {
  ContentUnderstandingContext,
  ContentUnderstandingClientOptionalParams,
} from "./api/index.js";
import { createContentUnderstanding } from "./api/index.js";
import type { ContentAnalyzersOperations } from "./classic/contentAnalyzers/index.js";
import { _getContentAnalyzersOperations } from "./classic/contentAnalyzers/index.js";
import type { KeyCredential, TokenCredential } from "@azure/core-auth";
import type { Pipeline } from "@azure/core-rest-pipeline";

export { ContentUnderstandingClientOptionalParams } from "./api/contentUnderstandingContext.js";

export class ContentUnderstandingClient {
  private _client: ContentUnderstandingContext;
  /** The pipeline used by this client to make requests */
  public readonly pipeline: Pipeline;

  /** The Content Understanding service extracts content and fields from multimodal input. */
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
    this.contentAnalyzers = _getContentAnalyzersOperations(this._client);
  }

  /** The operation groups for contentAnalyzers */
  public readonly contentAnalyzers: ContentAnalyzersOperations;
}
