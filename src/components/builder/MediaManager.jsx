import { useState } from "react";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Star,
  ExternalLink,
  Film,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { compressImage, optimizeVideo, formatBytes } from "../../lib/mediaCompressor";
import { getVideoOrientation } from "../common/AdaptiveVideoPlayer";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../lib/cloudinaryService";

export const MediaManager = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  if (!activePortfolio) return null;

  const { media = [] } = activePortfolio;

  // New item draft form state
  const [mediaType, setMediaType] = useState("video");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  // Compression & upload state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [compressionMetrics, setCompressionMetrics] = useState(null); // { originalSize, compressedSize, savingsPct, type }
  const [processingError, setProcessingError] = useState("");

  // Automatic Photo / Image File Upload Handler with Auto-Compression
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingProgress(10);
    setProcessingStatus("Initializing image compressor...");
    setCompressionMetrics(null);
    setProcessingError("");

    try {
      const result = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.82,
        onProgress: (pct, msg) => {
          setProcessingProgress(pct);
          setProcessingStatus(msg);
        },
      });

      let finalUrl = result.dataUrl;
      let finalThumbUrl = result.dataUrl;

      // Upload compressed image directly to Cloudinary if configured
      if (isCloudinaryConfigured) {
        setProcessingStatus("Uploading compressed image to Cloudinary CDN...");
        const cloudRes = await uploadToCloudinary(result.dataUrl || file, {
          folder: "versebuilder/photos",
          onProgress: (pct, msg) => {
            setProcessingProgress(pct);
            setProcessingStatus(msg);
          },
        });
        if (cloudRes?.url) {
          finalUrl = cloudRes.url;
          finalThumbUrl = cloudRes.thumbnailUrl || cloudRes.url;
        }
      }

      setUrl(finalUrl);
      setThumbnailUrl(finalThumbUrl);
      setMediaType("photo");
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      setCompressionMetrics({
        type: "photo",
        originalSize: result.originalSizeFormatted,
        compressedSize: result.compressedSizeFormatted,
        savingsPct: result.savingsPct,
        dimensions: `${result.width} × ${result.height}`,
      });
    } catch (err) {
      setProcessingError(err.message || "Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Automatic Video File Upload Handler with Poster Extraction & Size Validation
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingProgress(15);
    setProcessingStatus("Extracting video metadata & cover poster...");
    setCompressionMetrics(null);
    setProcessingError("");

    try {
      const result = await optimizeVideo(file, {
        maxSizeBytes: 50 * 1024 * 1024, // 50MB
        onProgress: (pct, msg) => {
          setProcessingProgress(pct);
          setProcessingStatus(msg);
        },
      });

      let finalUrl = result.dataUrl;
      let finalThumbUrl = result.posterUrl || "";

      // Upload directly to Cloudinary if configured
      if (isCloudinaryConfigured) {
        setProcessingStatus("Uploading video reel to Cloudinary CDN...");
        const cloudRes = await uploadToCloudinary(file, {
          folder: "versebuilder/videos",
          onProgress: (pct, msg) => {
            setProcessingProgress(pct);
            setProcessingStatus(msg);
          },
        });
        if (cloudRes?.url) {
          finalUrl = cloudRes.url;
          finalThumbUrl = cloudRes.thumbnailUrl || finalThumbUrl;
        }
      }

      setUrl(finalUrl);
      if (finalThumbUrl) {
        setThumbnailUrl(finalThumbUrl);
      }
      setMediaType("video");
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      setCompressionMetrics({
        type: "video",
        originalSize: result.sizeFormatted,
        compressedSize: result.sizeFormatted,
        savingsPct: 0,
        dimensions: result.width && result.height ? `${result.width} × ${result.height}` : "",
        duration: Math.round(result.duration) + "s",
        hasPoster: Boolean(result.posterUrl),
      });
    } catch (err) {
      setProcessingError(err.message || "Failed to process video file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom thumbnail photo upload handler
  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImage(file, { maxWidth: 1280, quality: 0.85 });
      setThumbnailUrl(res.dataUrl);
    } catch (err) {
      alert("Failed to compress thumbnail: " + err.message);
    }
  };

  const handleAddMedia = () => {
    if (!title.trim()) {
      alert("Please provide a title for this media item.");
      return;
    }
    if (!url.trim()) {
      alert("Please upload a file or paste a media URL.");
      return;
    }

    const newItem = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category: category.trim() || (mediaType === "video" ? "Video Reel" : "Photo"),
      type: mediaType,
      url: url.trim(),
      thumbnailUrl:
        thumbnailUrl.trim() || (mediaType === "photo" ? url.trim() : ""),
      caption: caption.trim(),
      featured: featured,
      ...(mediaType === "video" && compressionMetrics?.dimensions
        ? (() => {
            const [width, height] = compressionMetrics.dimensions.split(" × ").map(Number);
            return width && height ? { width, height, videoWidth: width, videoHeight: height, aspectRatio: width / height, orientation: getVideoOrientation(width, height) } : {};
          })()
        : {}),
    };

    updateActivePortfolio({
      media: [newItem, ...media],
    });

    // Reset draft form
    setTitle("");
    setCategory("");
    setCaption("");
    setUrl("");
    setThumbnailUrl("");
    setFeatured(false);
    setCompressionMetrics(null);
  };

  const handleUpdateItem = (id, field, value) => {
    const updated = media.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    updateActivePortfolio({ media: updated });
  };

  const handleVideoMetadata = (id, metadata) => {
    const updated = media.map((item) =>
      item.id === id
        ? { ...item, ...metadata }
        : item
    );
    updateActivePortfolio({ media: updated });
  };

  const handleDeleteItem = (id) => {
    updateActivePortfolio({
      media: media.filter((m) => m.id !== id),
    });
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= media.length) return;

    const newMedia = [...media];
    const [moved] = newMedia.splice(index, 1);
    newMedia.splice(targetIndex, 0, moved);

    updateActivePortfolio({ media: newMedia });
  };

  return (
    <div className="editor-tab-pane">
      <div className="editor-section-header">
        <h2>Photos & Videos Showcase</h2>
        <p>
          Upload video reels, thumbnails, design projects, and high-resolution photography with
          <strong> automatic WebP compression</strong> and <strong>video cover extraction</strong>.
        </p>
      </div>

      {/* Add Media Card */}
      <div className="editor-card add-media-card">
        <h3 className="editor-card-title">
          <Zap size={16} className="text-accent" /> Add New Photo or Video (Auto-Optimized)
        </h3>

        {/* Media Type Toggle */}
        <div className="media-type-toggle">
          <button
            type="button"
            className={`type-toggle-btn ${mediaType === "video" ? "active" : ""}`}
            onClick={() => {
              setMediaType("video");
              setCompressionMetrics(null);
            }}
          >
            <Video size={16} />
            <span>Video Reel</span>
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${mediaType === "photo" ? "active" : ""}`}
            onClick={() => {
              setMediaType("photo");
              setCompressionMetrics(null);
            }}
          >
            <ImageIcon size={16} />
            <span>Photo / Artwork</span>
          </button>
        </div>

        {/* Upload & Compression Area */}
        <div className="media-upload-area">
          <div className="upload-dropzone">
            <label className="dropzone-label">
              <Upload size={24} />
              <span className="dropzone-title">
                Upload {mediaType === "video" ? "Video File (MP4, WEBM)" : "Photo (PNG, JPG, WEBP)"}
              </span>
              <span className="dropzone-sub">
                {mediaType === "video"
                  ? "Auto-generates cover poster & validates duration"
                  : "Auto-resizes & compresses to WebP at 82% quality"}
              </span>
              <input
                type="file"
                accept={mediaType === "video" ? "video/*" : "image/*"}
                onChange={mediaType === "video" ? handleVideoUpload : handlePhotoUpload}
                className="hidden-file-input"
                disabled={isProcessing}
              />
            </label>
          </div>

          <div className="upload-or-col">
            <span>OR</span>
          </div>

          <div className="url-input-col">
            <label className="editor-label">Media Direct URL or Embed</label>
            <input
              type="text"
              placeholder={
                mediaType === "video"
                  ? "https://... video.mp4, YouTube, or Vimeo URL"
                  : "https://... image.png, jpg, or webp URL"
              }
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (mediaType === "photo" && !thumbnailUrl) {
                  setThumbnailUrl(e.target.value);
                }
              }}
              className="editor-input"
            />

            {mediaType === "video" && (
              <div className="video-thumb-field">
                <label className="editor-label">Video Cover Poster</label>
                <div className="video-thumb-inputs">
                  <input
                    type="text"
                    placeholder="Poster URL (auto-generated if uploading file)"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="editor-input"
                  />
                  <label className="editor-btn-secondary editor-btn-sm thumb-upload-btn">
                    <Upload size={14} /> Custom Poster
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbUpload}
                      className="hidden-file-input"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing Progress Bar */}
        {isProcessing && (
          <div className="media-processing-bar-box">
            <div className="processing-text-row">
              <span className="proc-label">
                <Loader2 size={14} className="animate-spin" /> {processingStatus}
              </span>
              <span className="proc-pct">{processingProgress}%</span>
            </div>
            <div className="proc-track">
              <div className="proc-fill" style={{ width: `${processingProgress}%` }} />
            </div>
          </div>
        )}

        {/* Compression Savings Report Pill */}
        {compressionMetrics && (
          <div className="compression-savings-pill">
            <CheckCircle2 size={16} className="text-green" />
            <div>
              <strong>
                {compressionMetrics.type === "photo" ? "Image Auto-Compressed:" : "Video Optimized:"}
              </strong>{" "}
              {compressionMetrics.type === "photo" ? (
                <>
                  <span className="orig-size">{compressionMetrics.originalSize}</span> ➔{" "}
                  <span className="comp-size">{compressionMetrics.compressedSize}</span> (
                  <span className="save-tag">Saved {compressionMetrics.savingsPct}%</span>) •{" "}
                  {compressionMetrics.dimensions}
                </>
              ) : (
                <>
                  Size: {compressionMetrics.originalSize} • Dimensions: {compressionMetrics.dimensions}
                  {compressionMetrics.hasPoster && " • Cover poster auto-extracted!"}
                </>
              )}
            </div>
          </div>
        )}

        {processingError && (
          <div className="media-error-alert">
            <AlertCircle size={16} />
            <span>{processingError}</span>
          </div>
        )}

        {/* Metadata Fields */}
        <div className="media-meta-grid">
          <div className="editor-form-group">
            <label className="editor-label">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. Commercial Showreel / Brand Video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="editor-input"
            />
          </div>

          <div className="editor-form-group">
            <label className="editor-label">Category / Tag</label>
            <input
              type="text"
              placeholder="e.g. Gaming Edit, 3D CGI, Thumbnail"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="editor-input"
            />
          </div>

          <div className="editor-form-group full-width">
            <label className="editor-label">Caption / Description</label>
            <input
              type="text"
              placeholder="Brief context about pacing, hook rate, or client results..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div className="add-media-footer">
          <label className="featured-checkbox-label">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Highlight as Featured Showcase</span>
          </label>

          <button
            type="button"
            className="editor-btn-primary"
            onClick={handleAddMedia}
            disabled={isProcessing}
          >
            <Plus size={16} /> Add to Portfolio
          </button>
        </div>
      </div>

      {/* Existing Media Items List */}
      <div className="editor-card">
        <div className="card-header-with-action">
          <div>
            <h3 className="editor-card-title">Portfolio Items ({media.length})</h3>
            <p className="editor-card-sub">Reorder, edit details, or remove media items.</p>
          </div>
        </div>

        {media.length === 0 ? (
          <div className="editor-empty-state">
            <Film size={32} />
            <p>No media items added yet. Upload your first video or photo above!</p>
          </div>
        ) : (
          <div className="media-items-grid">
            {media.map((item, index) => {
              const isVid = item.type === "video";
              return (
                <div className="media-admin-card" key={item.id || index}>
                  <div className="media-admin-thumb-box">
                    {isVid ? (
                      <video
                        src={item.url}
                        poster={item.thumbnailUrl || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        className="media-admin-thumb-img media-admin-video"
                        onLoadedMetadata={(event) => {
                          const { videoWidth: width, videoHeight: height } = event.currentTarget;
                          if (width && height && (!item.width || !item.height)) {
                            handleVideoMetadata(item.id, {
                              width,
                              height,
                              videoWidth: width,
                              videoHeight: height,
                              aspectRatio: width / height,
                              orientation: getVideoOrientation(width, height),
                            });
                          }
                        }}
                        style={item.width && item.height ? { aspectRatio: `${item.width} / ${item.height}` } : undefined}
                      />
                    ) : (
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.title}
                        className="media-admin-thumb-img"
                      />
                    )}
                    <span className="media-type-badge">
                      {isVid ? <Video size={12} /> : <ImageIcon size={12} />}
                      {isVid ? "Video" : "Photo"}
                    </span>
                    {item.featured && (
                      <span className="featured-star-badge" title="Featured Item">
                        <Star size={12} fill="#f5b84b" />
                      </span>
                    )}
                  </div>

                  <div className="media-admin-details">
                    <div className="media-title-row">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                        className="editor-input media-input-title"
                      />
                    </div>

                    <div className="media-sub-row">
                      <input
                        type="text"
                        value={item.category || ""}
                        placeholder="Category"
                        onChange={(e) => handleUpdateItem(item.id, "category", e.target.value)}
                        className="editor-input media-input-cat"
                      />
                      <label className="featured-toggle-mini">
                        <input
                          type="checkbox"
                          checked={Boolean(item.featured)}
                          onChange={(e) => handleUpdateItem(item.id, "featured", e.target.checked)}
                        />
                        <span>Featured</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Caption / description"
                      value={item.caption || ""}
                      onChange={(e) => handleUpdateItem(item.id, "caption", e.target.value)}
                      className="editor-input media-input-caption"
                    />
                  </div>

                  <div className="media-admin-actions">
                    <div className="reorder-col">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                        className="reorder-btn"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={index === media.length - 1}
                        onClick={() => moveItem(index, 1)}
                        className="reorder-btn"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="editor-btn-icon-danger"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete Media"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
