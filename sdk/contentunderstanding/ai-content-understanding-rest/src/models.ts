// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** Analyzer that extracts content and fields from multimodal documents. */
export interface ContentAnalyzer {
  /** A description of the analyzer. */
  description?: string;
  /** Tags associated with the analyzer. */
  tags?: Record<string, string>;
  /** The analyzer to incrementally train from. */
  baseAnalyzerId?: string;
  /** Analyzer configuration settings. */
  config?: ContentAnalyzerConfig;
  /** The schema of fields to extracted. */
  fieldSchema?: FieldSchema;
  /** Indicates whether the result may contain additional fields outside of the defined schema. */
  dynamicFieldSchema?: boolean;
  /** Additional knowledge sources used to enhance the analyzer. */
  knowledgeSources?: Array<KnowledgeSource>;
  /**
   * Mapping of model roles to specific model names.
   * Ex. { "chatCompletion": "gpt-4.1", "embedding": "text-embedding-3-large" }.
   */
  models?: Record<string, string>;
}

/** Configuration settings for an analyzer. */
export interface ContentAnalyzerConfig {
  /** Return all content details. */
  returnDetails?: boolean;
  /** List of locale hints for speech transcription. */
  locales?: string[];
  /** Enable optical character recognition (OCR). */
  enableOcr?: boolean;
  /** Enable layout analysis. */
  enableLayout?: boolean;
  /** Enable generation of figure description. */
  enableFigureDescription?: boolean;
  /** Enable analysis of figures, such as charts and diagrams. */
  enableFigureAnalysis?: boolean;
  /** Enable mathematical formula detection. */
  enableFormula?: boolean;
  /** Enable annotation detection. */
  enableAnnotation?: boolean;
  /**
   * Representation format of tables in analyze result markdown.
   *
   * Possible values: "html", "markdown"
   */
  tableFormat?: TableFormat;
  /**
   * Representation format of charts in analyze result markdown.
   *
   * Possible values: "chartJs", "markdown"
   */
  chartFormat?: ChartFormat;
  /**
   * Representation format of annotations in analyze result markdown.
   *
   * Possible values: "none", "markdown"
   */
  annotationFormat?: AnnotationFormat;
  /** Disable the default blurring of faces for privacy while processing the content. */
  disableFaceBlurring?: boolean;
  /** Return field grounding source and confidence. */
  estimateFieldSourceAndConfidence?: boolean;
  /** Map of categories to classify the input content(s) against. */
  contentCategories?: Record<string, ContentCategoryDefinition>;
  /** Enable segmentation of the input by contentCategories. */
  enableSegment?: boolean;
  /** Force segmentation of document content by page. */
  segmentPerPage?: boolean;
  /**
   * Omit the content for this analyzer from analyze result.
   * Only return content(s) from additional analyzers specified in contentCategories, if any.
   */
  omitContent?: boolean;
}

/** Content category definition. */
export interface ContentCategoryDefinition {
  /** The description of the category. */
  description?: string;
  /** Optional analyzer used to process the content. */
  analyzerId?: string;
  /** Optional inline definition of analyzer used to process the content. */
  analyzer?: ContentAnalyzer;
}

/** Schema of fields to be extracted from documents. */
export interface FieldSchema {
  /** The name of the field schema. */
  name?: string;
  /** A description of the field schema. */
  description?: string;
  /** The fields defined in the schema. */
  fields: Record<string, ContentFieldDefinition>;
  /** Additional definitions referenced by the fields in the schema. */
  definitions?: Record<string, ContentFieldDefinition>;
}

/** Definition of the field using a JSON Schema like syntax. */
export interface ContentFieldDefinition {
  /**
   * Generation method.
   *
   * Possible values: "generate", "extract", "classify"
   */
  method?: GenerationMethod;
  /**
   * Semantic data type of the field value.
   *
   * Possible values: "string", "date", "time", "number", "integer", "boolean", "array", "object", "json"
   */
  type?: ContentFieldType;
  /** Field description. */
  description?: string;
  /** Field type schema of each array element, if type is array. */
  items?: ContentFieldDefinition;
  /** Named sub-fields, if type is object. */
  properties?: Record<string, ContentFieldDefinition>;
  /** Examples of field values. */
  examples?: string[];
  /** Enumeration of possible field values. */
  enum?: string[];
  /** Descriptions for each enumeration value. */
  enumDescriptions?: Record<string, string>;
  /** Reference to another field definition. */
  $ref?: string;
  /** Return grounding source and confidence. */
  estimateSourceAndConfidence?: boolean;
}

/** Knowledge source. */
export interface KnowledgeSourceParent {
  kind: KnowledgeSourceKind;
}

/** Labeled data knowledge source. */
export interface LabeledDataKnowledgeSource extends KnowledgeSourceParent {
  /** A blob container containing labeled data. */
  kind: "labeledData";
  /** The URL of the blob container containing labeled data. */
  containerUrl: string;
  /** An optional prefix to filter blobs within the container. */
  prefix?: string;
  /** An optional path to a file listing specific blobs to include. */
  fileListPath: string;
}

/** Analyze operation request. */
export interface AnalyzeRequest {
  /** Inputs to analyze.  Currently, only pro mode supports multiple inputs. */
  inputs?: Array<AnalyzeInput>;
  /**
   * Override default mapping of model names to deployments.
   * Ex. { "gpt-4.1": "myGpt41Deployment", "text-embedding-3-large": "myTextEmbedding3LargeDeployment" }.
   */
  modelDeployments?: Record<string, string>;
}

/** Additional input to analyze. */
export interface AnalyzeInput {
  /** The URL of the input to analyze.  Only one of url or data should be specified. */
  url?: string;
  /** Base64-encoded binary content of the input to analyze.  Only one of url or data should be specified. */
  data?: string;
  /** Name of the input. */
  name?: string;
  /** The MIME type of the input content.  Ex. application/pdf, image/jpeg, etc. */
  mimeType?: string;
  /** Range of the input to analyze (ex. `1-3,5,9-`).  Document content uses 1-based page numbers, while audio visual content uses integer milliseconds. */
  range?: string;
}

/** default settings for this Content Understanding resource. */
export interface ContentUnderstandingDefaultsMergePatchUpdate {
  /**
   * Mapping of model names to deployments.
   * Ex. { "gpt-4.1": "myGpt41Deployment", "text-embedding-3-large": "myTextEmbedding3LargeDeployment" }.
   */
  modelDeployments?: RecordMergePatchUpdateString;
}

export interface RecordMergePatchUpdateString extends Record<string, string> {}

/** Knowledge source. */
export type KnowledgeSource =
  | KnowledgeSourceParent
  | LabeledDataKnowledgeSource;
/** Alias for ResourceStatus */
export type ResourceStatus = string;
/** Alias for TableFormat */
export type TableFormat = string;
/** Alias for ChartFormat */
export type ChartFormat = string;
/** Alias for AnnotationFormat */
export type AnnotationFormat = string;
/** Alias for GenerationMethod */
export type GenerationMethod = string;
/** Alias for ContentFieldType */
export type ContentFieldType = string;
/** Alias for KnowledgeSourceKind */
export type KnowledgeSourceKind = string;
/** Alias for StringEncoding */
export type StringEncoding = string;
