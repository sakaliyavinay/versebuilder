import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";

export const MediaLightbox = ({ items = [], activeIndex = 0, onClose, onNavigate }) => {
  const currentItem = items[activeIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && activeIndex > 0) onNavigate(activeIndex - 1);
      if (e.key === "ArrowRight" && activeIndex < items.length - 1) onNavigate(activeIndex + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, items.length, onClose, onNavigate]);

  if (!currentItem) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <header className="lightbox-header">
          <div className="lightbox-info">
            <span className="lightbox-counter">
              {activeIndex + 1} / {items.length}
            </span>
            <span className="lightbox-category">{currentItem.category || "Media"}</span>
          </div>
          <div className="lightbox-actions">
            <a
              href={currentItem.url || currentItem.thumbnailUrl}
              target="_blank"
              rel="noreferrer"
              className="lightbox-btn"
              title="Open full resolution"
            >
              <ExternalLink size={18} />
            </a>
            <button className="lightbox-btn close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="lightbox-body">
          {activeIndex > 0 && (
            <button
              className="lightbox-nav-btn prev-btn"
              onClick={() => onNavigate(activeIndex - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div className="lightbox-media-wrapper">
            <img
              src={currentItem.url || currentItem.thumbnailUrl}
              alt={currentItem.title}
              className="lightbox-image"
            />
          </div>

          {activeIndex < items.length - 1 && (
            <button
              className="lightbox-nav-btn next-btn"
              onClick={() => onNavigate(activeIndex + 1)}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        <footer className="lightbox-footer">
          <h3 className="lightbox-title">{currentItem.title}</h3>
          {currentItem.caption && <p className="lightbox-caption">{currentItem.caption}</p>}
        </footer>
      </div>
    </div>
  );
};
