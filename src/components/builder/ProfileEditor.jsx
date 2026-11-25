import { useState } from "react";
import { Upload, Plus, Trash2, User, Sparkles, MapPin, Calendar, Clock, Image as ImageIcon } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { compressImage } from "../../lib/mediaCompressor";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../lib/cloudinaryService";

export const ProfileEditor = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  if (!activePortfolio) return null;

  const { profile = {}, stats = [], timeline = [] } = activePortfolio;

  const updateProfileField = (field, value) => {
    updateActivePortfolio((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Avatar file upload handler (compresses + uploads to Cloudinary if configured)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 640,
        maxHeight: 640,
        quality: 0.85,
      });

      if (isCloudinaryConfigured) {
        try {
          const cloudRes = await uploadToCloudinary(compressed.dataUrl || file, {
            folder: "versebuilder/avatars",
          });
          if (cloudRes?.url) {
            updateProfileField("avatarUrl", cloudRes.url);
            return;
          }
        } catch (err) {
          console.warn("Cloudinary avatar upload fallback:", err);
        }
      }

      updateProfileField("avatarUrl", compressed.dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfileField("avatarUrl", reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Stats handlers
  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateActivePortfolio({ stats: newStats });
  };

  const addStat = () => {
    updateActivePortfolio({
      stats: [...stats, { label: "New Metric", value: "100+" }],
    });
  };

  const removeStat = (index) => {
    const newStats = stats.filter((_, i) => i !== index);
    updateActivePortfolio({ stats: newStats });
  };

  // Timeline handlers
  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    updateActivePortfolio({ timeline: newTimeline });
  };

  const addTimeline = () => {
    updateActivePortfolio({
      timeline: [
        ...timeline,
        {
          year: new Date().getFullYear().toString(),
          title: "New Milestone",
          description: "Describe this milestone or accomplishment.",
        },
      ],
    });
  };

  const removeTimeline = (index) => {
    const newTimeline = timeline.filter((_, i) => i !== index);
    updateActivePortfolio({ timeline: newTimeline });
  };

  return (
    <div className="editor-tab-pane">
      <div className="editor-section-header">
        <h2>Profile & Identity</h2>
        <p>Define your personal brand, headline, narrative bio, and credibility stats.</p>
      </div>

      {/* Avatar & Basic Info */}
      <div className="editor-card">
        <h3 className="editor-card-title">Avatar & Photo</h3>
        <div className="avatar-editor-row">
          <div className="avatar-preview-box">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar Preview" className="avatar-img-preview" />
            ) : (
              <div className="avatar-placeholder">
                <User size={32} />
              </div>
            )}
          </div>
          <div className="avatar-inputs-col">
            <label className="editor-btn-upload">
              <Upload size={16} />
              <span>{uploadingAvatar ? "Compressing & Uploading..." : "Upload Photo from Computer"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden-file-input"
              />
            </label>
            <span className="or-divider-text">or paste image URL</span>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={profile.avatarUrl || ""}
              onChange={(e) => updateProfileField("avatarUrl", e.target.value)}
              className="editor-input"
            />
          </div>
        </div>
      </div>

      {/* Core Fields */}
      <div className="editor-card">
        <h3 className="editor-card-title">Profile Essentials</h3>

        <div className="editor-form-group">
          <label className="editor-label">Display Name *</label>
          <input
            type="text"
            value={profile.displayName || ""}
            onChange={(e) => updateProfileField("displayName", e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Role / Tagline</label>
          <input
            type="text"
            value={profile.tagline || ""}
            onChange={(e) => updateProfileField("tagline", e.target.value)}
            placeholder="e.g. Visual Designer & Video Director"
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Headline / Hook</label>
          <input
            type="text"
            value={profile.headline || ""}
            onChange={(e) => updateProfileField("headline", e.target.value)}
            placeholder="e.g. Turning raw footage into scroll-stopping content."
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">About / Narrative Bio</label>
          <textarea
            rows={5}
            value={profile.bio || ""}
            onChange={(e) => updateProfileField("bio", e.target.value)}
            placeholder="Write a clear, compelling story about your work, creative process, and what makes you unique..."
            className="editor-textarea"
          />
        </div>

        <div className="editor-form-row">
          <div className="editor-form-group">
            <label className="editor-label">Location / Timezone</label>
            <div className="input-with-icon">
              <MapPin size={16} />
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => updateProfileField("location", e.target.value)}
                placeholder="e.g. Mumbai, India • Remote Worldwide"
                className="editor-input"
              />
            </div>
          </div>

          <div className="editor-form-group">
            <label className="editor-label">Availability / Status Badge</label>
            <div className="input-with-icon">
              <Sparkles size={16} />
              <input
                type="text"
                value={profile.statusBadge || ""}
                onChange={(e) => updateProfileField("statusBadge", e.target.value)}
                placeholder="e.g. Available for new edits & packages"
                className="editor-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Credibility Stats */}
      <div className="editor-card">
        <div className="card-header-with-action">
          <div>
            <h3 className="editor-card-title">Highlights & Metrics</h3>
            <p className="editor-card-sub">Key numbers that prove your experience and build trust.</p>
          </div>
          <button type="button" className="editor-btn-secondary editor-btn-sm" onClick={addStat}>
            <Plus size={14} /> Add Metric
          </button>
        </div>

        <div className="stats-editor-list">
          {stats.map((s, idx) => (
            <div className="stat-editor-item" key={idx}>
              <div className="stat-input-box">
                <label>Value</label>
                <input
                  type="text"
                  placeholder="50K+"
                  value={s.value}
                  onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                  className="editor-input"
                />
              </div>
              <div className="stat-input-box">
                <label>Label</label>
                <input
                  type="text"
                  placeholder="Views"
                  value={s.label}
                  onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                  className="editor-input"
                />
              </div>
              <button
                type="button"
                className="editor-btn-icon-danger"
                onClick={() => removeStat(idx)}
                title="Remove metric"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="editor-card">
        <div className="card-header-with-action">
          <div>
            <h3 className="editor-card-title">Experience & Timeline</h3>
            <p className="editor-card-sub">Highlight key career steps, milestones, or achievements.</p>
          </div>
          <button type="button" className="editor-btn-secondary editor-btn-sm" onClick={addTimeline}>
            <Plus size={14} /> Add Milestone
          </button>
        </div>

        <div className="timeline-editor-list">
          {timeline.map((item, idx) => (
            <div className="timeline-editor-item" key={idx}>
              <div className="timeline-item-top">
                <input
                  type="text"
                  placeholder="Year (e.g. 2026)"
                  value={item.year}
                  onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                  className="editor-input year-input"
                />
                <input
                  type="text"
                  placeholder="Milestone Title"
                  value={item.title}
                  onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                  className="editor-input title-input"
                />
                <button
                  type="button"
                  className="editor-btn-icon-danger"
                  onClick={() => removeTimeline(idx)}
                  title="Remove milestone"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Brief description of what you accomplished..."
                value={item.description}
                onChange={(e) => handleTimelineChange(idx, "description", e.target.value)}
                className="editor-textarea"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
