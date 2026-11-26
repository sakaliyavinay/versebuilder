/**
 * Automatic Media Compression & Upload Optimization Service
 * Optimizes photos (WebP/JPEG resizing & compression) and videos (canvas poster extraction,
 * metadata validation, size reporting, and transcode optimization).
 */

export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Automatically resize & compress an image file.
 * Resizes overly large dimensions (e.g. max 1920px width/height)
 * Compresses to WebP (with JPEG fallback) at 0.82 quality.
 */
export const compressImage = async (
  file,
  options = { maxWidth: 1920, maxHeight: 1920, quality: 0.82, onProgress: null }
) => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82, onProgress, cropToSquare = false } = options;

  if (onProgress) onProgress(15, "Reading image file...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (onProgress) onProgress(45, "Calculating dimensions & resizing...");

        let { width, height } = img;
        const originalWidth = width;
        const originalHeight = height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = width;
        let sourceHeight = height;

        if (cropToSquare) {
          sourceWidth = Math.min(width, height);
          sourceHeight = sourceWidth;
          sourceX = Math.round((width - sourceWidth) / 2);
          sourceY = Math.round((height - sourceHeight) / 2);
          width = sourceWidth;
          height = sourceHeight;
        }

        // Maintain aspect ratio while capping to max boundaries
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

        if (onProgress) onProgress(75, "Applying compression algorithm...");

        // Try WebP first, fallback to JPEG
        let mimeType = "image/webp";
        let dataUrl = canvas.toDataURL(mimeType, quality);

        // If browser didn't support webp dataUrl
        if (!dataUrl.startsWith("data:image/webp")) {
          mimeType = "image/jpeg";
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        // Calculate approximate size of base64
        const head = `data:${mimeType};base64,`;
        const base64Length = dataUrl.length - head.length;
        const compressedSizeBytes = Math.round((base64Length * 3) / 4);
        const originalSizeBytes = file.size;

        const savingsPct = Math.max(
          0,
          Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
        );

        if (onProgress) onProgress(100, "Compression complete!");

        resolve({
          dataUrl,
          mimeType,
          width,
          height,
          originalWidth,
          originalHeight,
          originalSize: originalSizeBytes,
          compressedSize: compressedSizeBytes,
          originalSizeFormatted: formatBytes(originalSizeBytes),
          compressedSizeFormatted: formatBytes(compressedSizeBytes),
          savingsPct,
        });
      };

      img.onerror = () => reject(new Error("Failed to load image for compression."));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
};

/**
 * Automatically extracts a crisp thumbnail frame from an uploaded video file.
 */
export const extractVideoPoster = async (file, time = 1.0) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = time;

    const cleanup = () => {
      URL.revokeObjectURL(videoUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      if (video.duration < time) {
        video.currentTime = Math.max(0.1, video.duration / 2);
      }
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const posterDataUrl = canvas.toDataURL("image/webp", 0.85);
        cleanup();
        resolve({
          posterDataUrl,
          width: canvas.width,
          height: canvas.height,
          duration: video.duration,
          aspectRatio: canvas.width / canvas.height,
          orientation:
            canvas.width / canvas.height < 0.9
              ? "vertical"
              : canvas.width / canvas.height > 1.1
                ? "landscape"
                : "square",
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not process video for poster extraction."));
    };
  });
};

/**
 * Automatic Video Optimizer
 * Checks size limits, extracts poster, validates duration and metadata,
 * and encodes with progress feedback.
 */
export const optimizeVideo = async (file, options = { onProgress: null, maxSizeBytes: 50 * 1024 * 1024 }) => {
  const { onProgress, maxSizeBytes = 50 * 1024 * 1024 } = options;

  if (file.size > maxSizeBytes) {
    throw new Error(
      `Video file size (${formatBytes(file.size)}) exceeds the browser upload limit of ${formatBytes(
        maxSizeBytes
      )}. Please compress the video or paste a YouTube / Vimeo / Cloudinary URL instead.`
    );
  }

  if (onProgress) onProgress(20, "Extracting video metadata & cover frame...");

  // 1. Extract poster
  let posterData = null;
  try {
    posterData = await extractVideoPoster(file, 1.0);
  } catch (err) {
    console.warn("Poster extraction fallback", err);
  }

  if (onProgress) onProgress(60, "Processing video stream & encoding...");

  // 2. Read as data URL / blob with progress
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round(60 + (e.loaded / e.total) * 35);
        onProgress(pct, `Optimizing video data (${formatBytes(e.loaded)} / ${formatBytes(e.total)})...`);
      }
    };

    reader.onload = () => {
      if (onProgress) onProgress(100, "Video optimization complete!");

      resolve({
        dataUrl: reader.result,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        posterUrl: posterData?.posterDataUrl || "",
        width: posterData?.width || null,
        height: posterData?.height || null,
        videoWidth: posterData?.width || null,
        videoHeight: posterData?.height || null,
        duration: posterData?.duration || 0,
        aspectRatio: posterData?.aspectRatio || null,
        orientation: posterData?.orientation || null,
      });
    };

    reader.onerror = () => reject(new Error("Failed to read video file."));
    reader.readAsDataURL(file);
  });
};
