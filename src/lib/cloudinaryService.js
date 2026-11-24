/**
 * Cloudinary Media Upload Service
 * Enables client-side unsigned uploads for photos and video reels.
 * Returns secure CDN URLs and automatically generates video posters.
 */

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

/**
 * Derives a video poster/thumbnail URL from a Cloudinary video URL
 * using Cloudinary's dynamic on-the-fly video snapshot parameter (`so_1`).
 */
export const getCloudinaryVideoPoster = (videoUrl) => {
  if (!videoUrl) return "";
  if (!videoUrl.includes("cloudinary.com")) return "";
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_1/")
    .replace(/\.[a-z0-9]+($|\?)/i, ".jpg$1");
};

/**
 * Upload a file (Image Blob, Video File, or DataURL) to Cloudinary via unsigned upload
 */
export const uploadToCloudinary = async (fileOrBlob, options = {}) => {
  if (!isCloudinaryConfigured) {
    return null;
  }

  const { folder = "versebuilder", onProgress = null } = options;

  const isVideo =
    fileOrBlob.type?.startsWith("video/") ||
    (typeof fileOrBlob === "string" && fileOrBlob.startsWith("data:video/"));
  const resourceType = isVideo ? "video" : "image";

  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  if (onProgress) onProgress(60, "Uploading to Cloudinary CDN...");

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to upload media to Cloudinary.");
  }

  let thumbnailUrl = data.secure_url;
  if (isVideo) {
    thumbnailUrl = getCloudinaryVideoPoster(data.secure_url) || data.secure_url;
  }

  return {
    url: data.secure_url,
    thumbnailUrl,
    publicId: data.public_id,
    bytes: data.bytes,
    format: data.format,
    width: data.width,
    height: data.height,
  };
};
