import { useEffect } from "react";
import { X, Play, ExternalLink } from "lucide-react";

export const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  // Determine if it's an embed URL (YouTube or Vimeo)
  const isYouTube = video.url?.includes("youtube.com") || video.url?.includes("youtu.be");
  const isVimeo = video.url?.includes("vimeo.com");

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div>
            <span className="video-modal-tag">{video.category || "Video"}</span>
            <h3 className="video-modal-title">{video.title}</h3>
          </div>
          <button className="video-modal-close" onClick={onClose} aria-label="Close video">
            <X size={22} />
          </button>
        </div>

        <div className="video-player-frame">
          {isYouTube || isVimeo ? (
            <iframe
              src={getEmbedUrl(video.url)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="embedded-video"
            />
          ) : (
            <video
              src={video.url}
              poster={video.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="native-video"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {video.caption && (
          <div className="video-modal-caption">
            <p>{video.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
