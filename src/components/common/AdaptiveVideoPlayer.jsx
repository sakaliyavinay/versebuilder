import { useEffect, useState } from "react";

const getSavedDimensions = (video) => {
  const width = Number(video?.videoWidth || video?.width);
  const height = Number(video?.videoHeight || video?.height);
  return width > 0 && height > 0 ? { width, height } : null;
};

export const getVideoOrientation = (width, height) => {
  if (!width || !height) return "landscape";
  const ratio = width / height;
  if (ratio < 0.9) return "vertical";
  if (ratio > 1.1) return "landscape";
  return "square";
};

export const AdaptiveVideoPlayer = ({
  video,
  className = "",
  autoPlay = false,
  controls = true,
  onMetadata,
}) => {
  const [dimensions, setDimensions] = useState(() => getSavedDimensions(video));
  useEffect(() => {
    setDimensions(getSavedDimensions(video));
  }, [video?.url, video?.width, video?.height, video?.videoWidth, video?.videoHeight]);
  const aspectRatio = dimensions
    ? `${dimensions.width} / ${dimensions.height}`
    : Number(video?.aspectRatio) > 0
      ? String(video.aspectRatio)
      : undefined;

  const handleMetadata = (event) => {
    const { videoWidth: width, videoHeight: height, duration } = event.currentTarget;
    if (!width || !height) return;
    const metadata = { width, height, videoWidth: width, videoHeight: height, aspectRatio: width / height, orientation: getVideoOrientation(width, height), duration };
    setDimensions(metadata);
    onMetadata?.(metadata);
  };

  return (
    <video
      src={video?.url}
      poster={video?.thumbnailUrl || undefined}
      controls={controls}
      autoPlay={autoPlay}
      playsInline
      preload="metadata"
      onLoadedMetadata={handleMetadata}
      className={`adaptive-video-player ${className}`.trim()}
      style={aspectRatio ? { aspectRatio } : undefined}
      aria-label={video?.title || "Portfolio video"}
    >
      Your browser does not support the video tag.
    </video>
  );
};
