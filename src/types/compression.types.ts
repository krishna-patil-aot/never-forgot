export interface ICompressionResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  format: string;
}

export interface ICompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}
