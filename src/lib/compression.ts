import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import { ICompressionOptions, ICompressionResult } from '@/types/compression.types';

function readFileAsDataUrl(fileOrBlob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Compresses an image using browser-image-compression (Web Worker + OffscreenCanvas)
 * Slashes file size (typically by 70% to 95%) while preserving invoice clarity
 */
export async function compressImage(
  file: File,
  options?: ICompressionOptions
): Promise<ICompressionResult> {
  const originalSize = file.size;

  try {
    const compressionSettings = {
      maxSizeMB: options?.maxSizeMB ?? 0.35,
      maxWidthOrHeight: options?.maxWidthOrHeight ?? 1600,
      useWebWorker: true,
      initialQuality: options?.quality ?? 0.82,
      fileType: 'image/webp',
    };

    const compressedBlob = await imageCompression(file, compressionSettings);

    // If compressed size is somehow larger than original, keep the original
    const effectiveBlob = compressedBlob.size < originalSize ? compressedBlob : file;
    const effectiveFile = new File([effectiveBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
      type: effectiveBlob.type || 'image/webp',
      lastModified: Date.now(),
    });

    const dataUrl = await readFileAsDataUrl(effectiveFile);
    const compressedSize = effectiveFile.size;
    const savedPercentage = Math.max(
      0,
      Math.round(((originalSize - compressedSize) / originalSize) * 100)
    );

    return {
      file: effectiveFile,
      dataUrl,
      originalSize,
      compressedSize,
      savedPercentage,
      format: effectiveFile.type,
    };
  } catch (error) {
    console.warn('[Compression] Image compression fallback to original:', error);
    const dataUrl = await readFileAsDataUrl(file);
    return {
      file,
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      format: file.type,
    };
  }
}

/**
 * Optimizes a PDF document using pdf-lib by stripping unused metadata & enabling object streams
 */
export async function compressPdf(file: File): Promise<ICompressionResult> {
  const originalSize = file.size;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Strip bulky metadata
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    const compressedBlob = new Blob([compressedBytes.buffer as ArrayBuffer], {
      type: 'application/pdf',
    });

    const effectiveBlob = compressedBlob.size < originalSize ? compressedBlob : file;
    const effectiveFile = new File([effectiveBlob], file.name, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });

    const dataUrl = await readFileAsDataUrl(effectiveFile);
    const compressedSize = effectiveFile.size;
    const savedPercentage = Math.max(
      0,
      Math.round(((originalSize - compressedSize) / originalSize) * 100)
    );

    return {
      file: effectiveFile,
      dataUrl,
      originalSize,
      compressedSize,
      savedPercentage,
      format: 'application/pdf',
    };
  } catch (error) {
    console.warn('[Compression] PDF optimization fallback to original:', error);
    const dataUrl = await readFileAsDataUrl(file);
    return {
      file,
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      format: file.type || 'application/pdf',
    };
  }
}

/**
 * Universal document compressor for bills, invoices, receipts, and loan documents
 */
export async function compressDocument(
  file: File,
  options?: ICompressionOptions
): Promise<ICompressionResult> {
  const isPdf =
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return compressPdf(file);
  }

  return compressImage(file, options);
}

/**
 * Format bytes to readable string (e.g., 2.4 MB, 180 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
