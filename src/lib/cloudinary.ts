export interface ICloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(
  file: File | Blob,
  fileName?: string
): Promise<ICloudinaryUploadResult | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    if (fileName) {
      const sanitizedName = fileName
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      formData.append('public_id', `${Date.now()}_${sanitizedName}`);
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg =
        (errorData as { error?: { message?: string } })?.error?.message ||
        `Cloudinary responded with ${res.status}`;
      console.warn('Cloudinary upload warning:', msg);
      return null;
    }

    const data = (await res.json()) as {
      secure_url: string;
      public_id: string;
      format?: string;
      bytes?: number;
    };

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
    };
  } catch (err) {
    console.warn('Cloudinary upload network error:', err);
    return null;
  }
}
