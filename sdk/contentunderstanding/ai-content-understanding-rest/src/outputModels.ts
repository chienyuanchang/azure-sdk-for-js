// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { ErrorModel } from "@azure-rest/core-client";

/** Provides status details for analyzer creation operations. */
export interface ContentAnalyzerOperationStatusOutput {
  /** The unique ID of the operation. */
  id: string;
  /**
   * The status of the operation
   *
   * Possible values: "NotStarted", "Running", "Succeeded", "Failed", "Canceled"
   */
  status: OperationStateOutput;
  /** Error object that describes the error when status is "Failed". */
  error?: ErrorModel;
  /** The result of the operation. */
  result?: ContentAnalyzerOutput;
  /** Usage details of the analyzer creation operation. */
  usage?: UsageDetailsOutput;
}

/** Analyzer that extracts content and fields from multimodal documents. */
export interface ContentAnalyzerOutput {
  /** The unique identifier of the analyzer. */
  readonly analyzerId: string;
  /** A description of the analyzer. */
  description?: string;
  /** Tags associated with the analyzer. */
  tags?: Record<string, string>;
  /**
   * The status of the analyzer.
   *
   * Possible values: "creating", "ready", "deleting", "failed"
   */
  readonly status: ResourceStatusOutput;
  /** The date and time when the analyzer was created. */
  readonly createdAt: string;
  /** The date and time when the analyzer was last modified. */
  readonly lastModifiedAt: string;
  /** Warnings encountered while creating the analyzer. */
  readonly warnings?: Array<ErrorModel>;
  /** The analyzer to incrementally train from. */
  baseAnalyzerId?: string;
  /** Analyzer configuration settings. */
  config?: ContentAnalyzerConfigOutput;
  /** The schema of fields to extracted. */
  fieldSchema?: FieldSchemaOutput;
  /** Indicates whether the result may contain additional fields outside of the defined schema. */
  dynamicFieldSchema?: boolean;
  /** Additional knowledge sources used to enhance the analyzer. */
  knowledgeSources?: Array<KnowledgeSourceOutput>;
  /**
   * Mapping of model roles to specific model names.
   * Ex. { "chatCompletion": "gpt-4.1", "embedding": "text-embedding-3-large" }.
   */
  models?: Record<string, string>;
}

/** Configuration settings for an analyzer. */
export interface ContentAnalyzerConfigOutput {
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
  tableFormat?: TableFormatOutput;
  /**
   * Representation format of charts in analyze result markdown.
   *
   * Possible values: "chartJs", "markdown"
   */
  chartFormat?: ChartFormatOutput;
  /**
   * Representation format of annotations in analyze result markdown.
   *
   * Possible values: "none", "markdown"
   */
  annotationFormat?: AnnotationFormatOutput;
  /** Disable the default blurring of faces for privacy while processing the content. */
  disableFaceBlurring?: boolean;
  /** Return field grounding source and confidence. */
  estimateFieldSourceAndConfidence?: boolean;
  /** Map of categories to classify the input content(s) against. */
  contentCategories?: Record<string, ContentCategoryDefinitionOutput>;
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
export interface ContentCategoryDefinitionOutput {
  /** The description of the category. */
  description?: string;
  /** Optional analyzer used to process the content. */
  analyzerId?: string;
  /** Optional inline definition of analyzer used to process the content. */
  analyzer?: ContentAnalyzerOutput;
}

/** Schema of fields to be extracted from documents. */
export interface FieldSchemaOutput {
  /** The name of the field schema. */
  name?: string;
  /** A description of the field schema. */
  description?: string;
  /** The fields defined in the schema. */
  fields: Record<string, ContentFieldDefinitionOutput>;
  /** Additional definitions referenced by the fields in the schema. */
  definitions?: Record<string, ContentFieldDefinitionOutput>;
}

/** Definition of the field using a JSON Schema like syntax. */
export interface ContentFieldDefinitionOutput {
  /**
   * Generation method.
   *
   * Possible values: "generate", "extract", "classify"
   */
  method?: GenerationMethodOutput;
  /**
   * Semantic data type of the field value.
   *
   * Possible values: "string", "date", "time", "number", "integer", "boolean", "array", "object", "json"
   */
  type?: ContentFieldTypeOutput;
  /** Field description. */
  description?: string;
  /** Field type schema of each array element, if type is array. */
  items?: ContentFieldDefinitionOutput;
  /** Named sub-fields, if type is object. */
  properties?: Record<string, ContentFieldDefinitionOutput>;
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
export interface KnowledgeSourceOutputParent {
  kind: KnowledgeSourceKindOutput;
}

/** Labeled data knowledge source. */
export interface LabeledDataKnowledgeSourceOutput
  extends KnowledgeSourceOutputParent {
  /** A blob container containing labeled data. */
  kind: "labeledData";
  /** The URL of the blob container containing labeled data. */
  containerUrl: string;
  /** An optional prefix to filter blobs within the container. */
  prefix?: string;
  /** An optional path to a file listing specific blobs to include. */
  fileListPath: string;
}

/** Usage details. */
export interface UsageDetailsOutput {
  /**
   * The number of document pages processed.
   * For documents without explicit pages (ex. txt, html), every 3000 UTF-16 characters is counted as one page.
   */
  documentPages?: number;
  /** The hours of audio processed. */
  audioHours?: number;
  /** The hours of video processed. */
  videoHours?: number;
  /** The number of tokens consumed, grouped by model (ex. GTP 4.1) and type (ex. input, cached input, output). */
  tokens?: Record<string, number>;
}

/** Paged collection of ContentAnalyzer items */
export interface PagedContentAnalyzerOutput {
  /** The ContentAnalyzer items on this page */
  value: Array<ContentAnalyzerOutput>;
  /** The link to the next page of items */
  nextLink?: string;
}

/** Provides status details for long running operations. */
export interface ResourceOperationStatusContentAnalyzerAnalyzeResultErrorOutput {
  /** The unique ID of the operation. */
  id: string;
  /**
   * The status of the operation
   *
   * Possible values: "NotStarted", "Running", "Succeeded", "Failed", "Canceled"
   */
  status: OperationStateOutput;
  /** Error object that describes the error when status is "Failed". */
  error?: ErrorModel;
  /** The result of the operation. */
  result?: AnalyzeResultOutput;
}

/** Analyze operation result. */
export interface AnalyzeResultOutput {
  /** The unique identifier of the analyzer. */
  analyzerId?: string;
  /** The version of the API used to analyze the document. */
  apiVersion?: string;
  /** The date and time when the result was created. */
  createdAt?: string;
  /** Warnings encountered while analyzing the document. */
  warnings?: Array<ErrorModel>;
  /**
   * The string encoding used for content spans.
   *
   * Possible values: "codePoint", "utf16", "utf8"
   */
  stringEncoding?: StringEncodingOutput;
  /** The extracted content. */
  contents: Array<MediaContentOutput>;
}

/** Media content base class. */
export interface MediaContentOutputParent {
  /** Detected MIME type of the content.  Ex. application/pdf, image/jpeg, etc. */
  mimeType: string;
  /** The analyzer that generated this content. */
  analyzerId?: string;
  /** Classified content category. */
  category?: string;
  /** The path of the content in the input. */
  path?: string;
  /** Markdown representation of the content. */
  markdown?: string;
  /** Extracted fields from the content. */
  fields?: Record<string, ContentFieldOutput>;
  kind: MediaContentKindOutput;
}

/** Field extracted from the content. */
export interface ContentFieldOutputParent {
  /** Span(s) associated with the field value in the markdown content. */
  spans?: Array<ContentSpanOutput>;
  /** Confidence of predicting the field value. */
  confidence?: number;
  /** Encoded source that identifies the position of the field value in the content. */
  source?: string;
  type: ContentFieldTypeOutput;
}

/** Position of the element in markdown, specified as a character offset and length. */
export interface ContentSpanOutput {
  /** Starting position (0-indexed) of the element in markdown, specified in characters. */
  offset: number;
  /** Length of the element in markdown, specified in characters. */
  length: number;
}

/** String field extracted from the content. */
export interface StringFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "string";
  /** String field value. */
  valueString?: string;
}

/** Date field extracted from the content. */
export interface DateFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "date";
  /** Date field value, in ISO 8601 (YYYY-MM-DD) format. */
  valueDate?: string;
}

/** Time field extracted from the content. */
export interface TimeFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "time";
  /** Time field value, in ISO 8601 (hh:mm:ss) format. */
  valueTime?: string;
}

/** Number field extracted from the content. */
export interface NumberFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "number";
  /** Number field value. */
  valueNumber?: number;
}

/** Integer field extracted from the content. */
export interface IntegerFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "integer";
  /** Integer field value. */
  valueInteger?: number;
}

/** Boolean field extracted from the content. */
export interface BooleanFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "boolean";
  /** Boolean field value. */
  valueBoolean?: boolean;
}

/** Array field extracted from the content. */
export interface ArrayFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "array";
  /** Array field value. */
  valueArray?: Array<ContentFieldOutput>;
}

/** Object field extracted from the content. */
export interface ObjectFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "object";
  /** Object field value. */
  valueObject?: Record<string, ContentFieldOutput>;
}

/** JSON field extracted from the content. */
export interface JsonFieldOutput extends ContentFieldOutputParent {
  /** Semantic data type of the field value. */
  type: "json";
  /** JSON field value. */
  valueJson?: any;
}

/** Document content.  Ex. text/plain, application/pdf, image/jpeg. */
export interface DocumentContentOutput extends MediaContentOutputParent {
  /** Content kind. */
  kind: "document";
  /** Start page number (1-indexed) of the content. */
  startPageNumber: number;
  /** End page number (1-indexed) of the content. */
  endPageNumber: number;
  /**
   * Length unit used by the width, height, and source properties.
   * For images/tiff, the default unit is pixel.  For PDF, the default unit is inch.
   *
   * Possible values: "pixel", "inch"
   */
  unit?: LengthUnitOutput;
  /** List of pages in the document. */
  pages?: Array<DocumentPageOutput>;
  /** List of paragraphs in the document.  Only if enableOcr and returnDetails are true. */
  paragraphs?: Array<DocumentParagraphOutput>;
  /** List of sections in the document.  Only if enableLayout and returnDetails are true. */
  sections?: Array<DocumentSectionOutput>;
  /** List of tables in the document.  Only if enableLayout and returnDetails are true. */
  tables?: Array<DocumentTableOutput>;
  /** List of figures in the document.  Only if enableLayout and returnDetails are true. */
  figures?: Array<DocumentFigureOutput>;
  /** List of detected persons in the document.  Only if enableFace and returnDetails are true. */
  persons?: Array<DetectedPersonOutput>;
  /** List of annotations in the document.  Only if enableAnnotations and returnDetails are true. */
  annotations?: Array<DocumentAnnotationOutput>;
  /** List of hyperlinks in the document.  Only if returnDetails are true. */
  hyperlinks?: Array<DocumentHyperlinkOutput>;
  /** List of detected content segments.  Only if enableSegment is true. */
  segments?: Array<DocumentContentSegmentOutput>;
}

/** Content from a document page. */
export interface DocumentPageOutput {
  /** Page number (1-based). */
  pageNumber: number;
  /** Width of the page. */
  width?: number;
  /** Height of the page. */
  height?: number;
  /** Span(s) associated with the page in the markdown content. */
  spans?: Array<ContentSpanOutput>;
  /**
   * The general orientation of the content in clockwise direction,
   * measured in degrees between (-180, 180].
   * Only if enableOcr is true.
   */
  angle?: number;
  /** List of words in the page.  Only if enableOcr and returnDetails are true. */
  words?: Array<DocumentWordOutput>;
  /** List of lines in the page.  Only if enableOcr and returnDetails are true. */
  lines?: Array<DocumentLineOutput>;
  /** List of barcodes in the page.  Only if enableBarcode and returnDetails are true. */
  barcodes?: Array<DocumentBarcodeOutput>;
  /** List of mathematical formulas in the page.  Only if enableFormula and returnDetails are true. */
  formulas?: Array<DocumentFormulaOutput>;
}

/**
 * Word in a document, consisting of a contiguous sequence of characters.
 * For non-space delimited languages, such as Chinese, Japanese, and Korean,
 * each character is represented as its own word.
 */
export interface DocumentWordOutput {
  /** Word text. */
  content: string;
  /** Encoded source that identifies the position of the word in the content. */
  source?: string;
  /** Span of the word in the markdown content. */
  span?: ContentSpanOutput;
  /** Confidence of predicting the word. */
  confidence?: number;
}

/** Line in a document, consisting of an contiguous sequence of words. */
export interface DocumentLineOutput {
  /** Line text. */
  content: string;
  /** Encoded source that identifies the position of the line in the content. */
  source?: string;
  /** Span of the line in the markdown content. */
  span?: ContentSpanOutput;
}

/** Barcode in a document. */
export interface DocumentBarcodeOutput {
  /**
   * Barcode kind.
   *
   * Possible values: "QRCode", "PDF417", "UPCA", "UPCE", "Code39", "Code128", "EAN8", "EAN13", "DataBar", "Code93", "Codabar", "DataBarExpanded", "ITF", "MicroQRCode", "Aztec", "DataMatrix", "MaxiCode"
   */
  kind: DocumentBarcodeKindOutput;
  /** Barcode value. */
  value: string;
  /** Encoded source that identifies the position of the barcode in the content. */
  source?: string;
  /** Span of the barcode in the markdown content. */
  span?: ContentSpanOutput;
  /** Confidence of predicting the barcode. */
  confidence?: number;
}

/** Mathematical formula in a document. */
export interface DocumentFormulaOutput {
  /**
   * Formula kind.
   *
   * Possible values: "inline", "display"
   */
  kind: DocumentFormulaKindOutput;
  /** LaTex expression describing the formula. */
  value: string;
  /** Encoded source that identifies the position of the formula in the content. */
  source?: string;
  /** Span of the formula in the markdown content. */
  span?: ContentSpanOutput;
  /** Confidence of predicting the formula. */
  confidence?: number;
}

/**
 * Paragraph in a document, generally consisting of an contiguous sequence of lines
 * with common alignment and spacing.
 */
export interface DocumentParagraphOutput {
  /**
   * Semantic role of the paragraph.
   *
   * Possible values: "pageHeader", "pageFooter", "pageNumber", "title", "sectionHeading", "footnote", "formulaBlock"
   */
  role?: SemanticRoleOutput;
  /** Paragraph text. */
  content: string;
  /** Encoded source that identifies the position of the paragraph in the content. */
  source?: string;
  /** Span of the paragraph in the markdown content. */
  span?: ContentSpanOutput;
}

/** Section in a document. */
export interface DocumentSectionOutput {
  /** Span of the section in the markdown content. */
  span?: ContentSpanOutput;
  /** Child elements of the section. */
  elements?: string[];
}

/** Table in a document, consisting table cells arranged in a rectangular layout. */
export interface DocumentTableOutput {
  /** Number of rows in the table. */
  rowCount: number;
  /** Number of columns in the table. */
  columnCount: number;
  /** Cells contained within the table. */
  cells: Array<DocumentTableCellOutput>;
  /** Encoded source that identifies the position of the table in the content. */
  source?: string;
  /** Span of the table in the markdown content. */
  span?: ContentSpanOutput;
  /** Table caption. */
  caption?: DocumentCaptionOutput;
  /** List of table footnotes. */
  footnotes?: Array<DocumentFootnoteOutput>;
  /**
   * Semantic role of the table.
   *
   * Possible values: "pageHeader", "pageFooter", "pageNumber", "title", "sectionHeading", "footnote", "formulaBlock"
   */
  role?: SemanticRoleOutput;
}

/** Table cell in a document table. */
export interface DocumentTableCellOutput {
  /**
   * Table cell kind.
   *
   * Possible values: "content", "rowHeader", "columnHeader", "stubHead", "description"
   */
  kind?: DocumentTableCellKindOutput;
  /** Row index of the cell. */
  rowIndex: number;
  /** Column index of the cell. */
  columnIndex: number;
  /** Number of rows spanned by this cell. */
  rowSpan?: number;
  /** Number of columns spanned by this cell. */
  columnSpan?: number;
  /** Content of the table cell. */
  content: string;
  /** Encoded source that identifies the position of the table cell in the content. */
  source?: string;
  /** Span of the table cell in the markdown content. */
  span?: ContentSpanOutput;
  /** Child elements of the table cell. */
  elements?: string[];
}

/** Caption of a table or figure. */
export interface DocumentCaptionOutput {
  /** Content of the caption. */
  content: string;
  /** Encoded source that identifies the position of the caption in the content. */
  source?: string;
  /** Span of the caption in the markdown content. */
  span?: ContentSpanOutput;
  /** Child elements of the caption. */
  elements?: string[];
}

/** Footnote of a table or figure. */
export interface DocumentFootnoteOutput {
  /** Content of the footnote. */
  content: string;
  /** Encoded source that identifies the position of the footnote in the content. */
  source?: string;
  /** Span of the footnote in the markdown content. */
  span?: ContentSpanOutput;
  /** Child elements of the footnote. */
  elements?: string[];
}

/** Figure in a document. */
export interface DocumentFigureOutputParent {
  /** Figure identifier. */
  id: string;
  /** Encoded source that identifies the position of the figure in the content. */
  source?: string;
  /** Span of the figure in the markdown content. */
  span?: ContentSpanOutput;
  /** Child elements of the figure, excluding any caption or footnotes. */
  elements?: string[];
  /** Figure caption. */
  caption?: DocumentCaptionOutput;
  /** List of figure footnotes. */
  footnotes?: Array<DocumentFootnoteOutput>;
  /** Description of the figure. */
  description?: string;
  /**
   * Semantic role of the figure.
   *
   * Possible values: "pageHeader", "pageFooter", "pageNumber", "title", "sectionHeading", "footnote", "formulaBlock"
   */
  role?: SemanticRoleOutput;
  kind: DocumentFigureKindOutput;
}

/** Figure containing a chart, such as a bar chart, line chart, or pie chart. */
export interface DocumentChartFigureOutput extends DocumentFigureOutputParent {
  /** Figure kind. */
  kind: "chart";
  /** Chart content represented using [Chart.js config](https://www.chartjs.org/docs/latest/configuration/). */
  content: any;
}

/** Figure containing a diagram, such as a flowchart or network diagram. */
export interface DocumentMermaidFigureOutput
  extends DocumentFigureOutputParent {
  /** Figure kind. */
  kind: "mermaid";
  /** Diagram content represented using [Mermaid syntax](https://mermaid.js.org/intro/). */
  content: string;
}

/** Detected person. */
export interface DetectedPersonOutput {
  /** Person identifier in the optional person directory if found.  Otherwise, each unknown person is assigned a unique `Person-{Number}`. */
  personId?: string;
  /** Confidence of the person identification, if a person directory is provided. */
  confidence?: number;
  /** Encoded source that identifies the position of the person in the input content. */
  source?: string;
}

/** Annotation in a document, such as a strikethrough or a comment. */
export interface DocumentAnnotationOutput {
  /** Annotation identifier. */
  id: string;
  /**
   * Annotation kind.
   *
   * Possible values: "highlight", "strikethrough", "underline", "italic", "bold", "circle", "note"
   */
  kind: DocumentAnnotationKindOutput;
  /** Spans of the content associated with the annotation. */
  spans?: Array<ContentSpanOutput>;
  /** Position of the annotation. */
  source?: string;
  /** Comments associated with the annotation. */
  comments?: Array<DocumentAnnotationCommentOutput>;
  /** Annotation author. */
  author?: string;
  /** Date and time when the annotation was created. */
  createdAt?: string;
  /** Date and time when the annotation was last modified. */
  lastModifiedAt?: string;
  /** Tags associated with the annotation. */
  tags?: string[];
}

/** Comment associated with a document annotation. */
export interface DocumentAnnotationCommentOutput {
  /** Comment message in Markdown. */
  message: string;
  /** Author of the comment. */
  author?: string;
  /** Date and time when the comment was created. */
  createdAt?: string;
  /** Date and time when the comment was last modified. */
  lastModifiedAt?: string;
  /** Tags associated with the comment. */
  tags?: string[];
}

/** Hyperlink in a document, such as a link to a web page or an email address. */
export interface DocumentHyperlinkOutput {
  /** Hyperlinked content. */
  content: string;
  /** URL of the hyperlink. */
  url: string;
  /** Span of the hyperlink in the markdown content. */
  span?: ContentSpanOutput;
  /** Position of the hyperlink. */
  source?: string;
}

/** Detected document content segment. */
export interface DocumentContentSegmentOutput {
  /** Segment identifier. */
  segmentId: string;
  /** Classified content category. */
  category: string;
  /** Span of the segment in the markdown content. */
  span: ContentSpanOutput;
  /** Start page number (1-indexed) of the segment. */
  startPageNumber: number;
  /** End page number (1-indexed) of the segment. */
  endPageNumber: number;
}

/** Audio visual content.  Ex. audio/wav, video/mp4. */
export interface AudioVisualContentOutput extends MediaContentOutputParent {
  /** Content kind. */
  kind: "audioVisual";
  /** Start time of the content in milliseconds. */
  startTimeMs: number;
  /** End time of the content in milliseconds. */
  endTimeMs: number;
  /** Width of each video frame in pixels, if applicable. */
  width?: number;
  /** Height of each video frame in pixels, if applicable. */
  height?: number;
  /** List of camera shot changes in the video, represented by its timestamp in milliseconds.  Only if returnDetails is true. */
  cameraShotTimesMs?: number[];
  /** List of key frames in the video.  Only if returnDetails is true. */
  keyFrames?: Array<KeyFrameOutput>;
  /** List of transcript phrases.  Only if returnDetails is true. */
  transcriptPhrases?: Array<TranscriptPhraseOutput>;
  /** List of detected content segments.  Only if enableSegment is true. */
  segments?: Array<AudioVisualContentSegmentOutput>;
}

/** Key frame in the video. */
export interface KeyFrameOutput {
  /** Timestamp of the key frame in milliseconds. */
  frameTimeMs: number;
}

/** Transcript phrase. */
export interface TranscriptPhraseOutput {
  /** Speaker index or name. */
  speaker?: string;
  /** Start time of the phrase in milliseconds. */
  startTimeMs: number;
  /** End time of the phrase in milliseconds. */
  endTimeMs: number;
  /** Detected locale of the phrase.  Ex. en-US. */
  locale?: string;
  /** Transcript text. */
  text: string;
  /** Confidence of predicting the phrase. */
  confidence?: number;
  /** Span of the phrase in the markdown content. */
  span?: ContentSpanOutput;
  /** List of words in the phrase. */
  words: Array<TranscriptWordOutput>;
}

/** Transcript word. */
export interface TranscriptWordOutput {
  /** Start time of the word in milliseconds. */
  startTimeMs: number;
  /** End time of the word in milliseconds. */
  endTimeMs: number;
  /** Transcript text. */
  text: string;
  /** Span of the word in the markdown content. */
  span?: ContentSpanOutput;
}

/** Detected audio/visual content segment. */
export interface AudioVisualContentSegmentOutput {
  /** Segment identifier. */
  segmentId: string;
  /** Classified content category. */
  category: string;
  /** Span of the segment in the markdown content. */
  span: ContentSpanOutput;
  /** Start time of the segment in milliseconds. */
  startTimeMs: number;
  /** End time of the segment in milliseconds. */
  endTimeMs: number;
}

/** Provides status details for analyze operations. */
export interface ContentAnalyzerAnalyzeOperationStatusOutput {
  /** The unique ID of the operation. */
  id: string;
  /**
   * The status of the operation
   *
   * Possible values: "NotStarted", "Running", "Succeeded", "Failed", "Canceled"
   */
  status: OperationStateOutput;
  /** Error object that describes the error when status is "Failed". */
  error?: ErrorModel;
  /** The result of the operation. */
  result?: AnalyzeResultOutput;
  /** Usage details of the analyze operation. */
  usage?: UsageDetailsOutput;
}

/** Provides status details for long running operations. */
export interface ResourceOperationStatusContentAnalyzerContentAnalyzerErrorOutput {
  /** The unique ID of the operation. */
  id: string;
  /**
   * The status of the operation
   *
   * Possible values: "NotStarted", "Running", "Succeeded", "Failed", "Canceled"
   */
  status: OperationStateOutput;
  /** Error object that describes the error when status is "Failed". */
  error?: ErrorModel;
  /** The result of the operation. */
  result?: ContentAnalyzerOutput;
}

/** Copy authorization details for cross-resource copy. */
export interface CopyAuthorizationOutput {
  /** Full path of the source analyzer. */
  source: string;
  /** Azure resource ID of the target location to copy to. */
  targetAzureResourceId: string;
  /** Date/time when the copy authorization expires. */
  expiresAt: string;
}

/** default settings for this Content Understanding resource. */
export interface ContentUnderstandingDefaultsOutput {
  /**
   * Mapping of model names to deployments.
   * Ex. { "gpt-4.1": "myGpt41Deployment", "text-embedding-3-large": "myTextEmbedding3LargeDeployment" }.
   */
  modelDeployments: Record<string, string>;
}

/** Knowledge source. */
export type KnowledgeSourceOutput =
  | KnowledgeSourceOutputParent
  | LabeledDataKnowledgeSourceOutput;
/** Media content base class. */
export type MediaContentOutput =
  | MediaContentOutputParent
  | DocumentContentOutput
  | AudioVisualContentOutput;
/** Field extracted from the content. */
export type ContentFieldOutput =
  | ContentFieldOutputParent
  | StringFieldOutput
  | DateFieldOutput
  | TimeFieldOutput
  | NumberFieldOutput
  | IntegerFieldOutput
  | BooleanFieldOutput
  | ArrayFieldOutput
  | ObjectFieldOutput
  | JsonFieldOutput;
/** Figure in a document. */
export type DocumentFigureOutput =
  | DocumentFigureOutputParent
  | DocumentChartFigureOutput
  | DocumentMermaidFigureOutput;
/** Alias for OperationStateOutput */
export type OperationStateOutput = string;
/** Alias for ResourceStatusOutput */
export type ResourceStatusOutput = string;
/** Alias for TableFormatOutput */
export type TableFormatOutput = string;
/** Alias for ChartFormatOutput */
export type ChartFormatOutput = string;
/** Alias for AnnotationFormatOutput */
export type AnnotationFormatOutput = string;
/** Alias for GenerationMethodOutput */
export type GenerationMethodOutput = string;
/** Alias for ContentFieldTypeOutput */
export type ContentFieldTypeOutput = string;
/** Alias for KnowledgeSourceKindOutput */
export type KnowledgeSourceKindOutput = string;
/** Alias for StringEncodingOutput */
export type StringEncodingOutput = string;
/** Alias for MediaContentKindOutput */
export type MediaContentKindOutput = string;
/** Alias for LengthUnitOutput */
export type LengthUnitOutput = string;
/** Alias for DocumentBarcodeKindOutput */
export type DocumentBarcodeKindOutput = string;
/** Alias for DocumentFormulaKindOutput */
export type DocumentFormulaKindOutput = string;
/** Alias for SemanticRoleOutput */
export type SemanticRoleOutput = string;
/** Alias for DocumentTableCellKindOutput */
export type DocumentTableCellKindOutput = string;
/** Alias for DocumentFigureKindOutput */
export type DocumentFigureKindOutput = string;
/** Alias for DocumentAnnotationKindOutput */
export type DocumentAnnotationKindOutput = string;
