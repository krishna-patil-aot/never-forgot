export type DocumentFormatType = 'image' | 'pdf' | 'document';

export interface IDocumentPreviewData {
  url: string;
  name: string;
  type: DocumentFormatType;
  size?: number;
}
