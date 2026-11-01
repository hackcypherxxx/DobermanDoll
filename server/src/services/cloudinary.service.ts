import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary.js";

export const cloudinaryService = {
  async uploadImage(buffer: Buffer, folder: string = "reborn-dolls"): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(new Error(error?.message || "Failed to upload image to Cloudinary"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      // Convert the memory buffer to a readable stream and pipe it to Cloudinary
      Readable.from(buffer).pipe(uploadStream);
    });
  },

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }
};
