import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  secure: true,
});

/**
 * Uploads an in-memory buffer directly to Cloudinary using streaming.
 * Avoids writing files to local disk and supports documents (PDF) and images.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'auto' | 'image' | 'raw' = 'auto'
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload to Cloudinary failed with empty result'));
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
}

export default cloudinary;
