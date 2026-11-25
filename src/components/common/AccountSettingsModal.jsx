import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Upload,
  Trash2,
  Lock,
  Mail,
  AtSign,
  Check,
  AlertCircle,
  Sparkles,
  Camera,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { compressImage } from "../../lib/mediaCompressor";
import { uploadToCloudinary, isCloudinaryConfigured } from "../../lib/cloudinaryService";
import { storageService } from "../../lib/storageService";

export const AccountSettingsModal = () => {
  const { user, updateProfile, updatePassword, isCloudAuth } = useAuth();
  const { userPortfolios, syncAccountIdentity, validateSlug, refreshPortfolios } = usePortfolio();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "security"

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [syncToPortfolio, setSyncToPortfolio] = useState(true);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);

  const fileInputRef = useRef(null);
  const slugRequestRef = useRef(0);
  const portfolioUsingHandle = userPortfolios.find((portfolio) => portfolio.slug === user?.username);

  // Sync state when user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
      setBio(user.bio || "");
      setError("");
      setSuccessMsg("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [user, isOpen]);

  // Global event listener to open modal from any component
  useEffect(() => {
    const handleOpen = () => {
      setActiveTab("profile");
      setIsOpen(true);
    };
    window.addEventListener("open-account-settings", handleOpen);
    return () => window.removeEventListener("open-account-settings", handleOpen);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // Real-time handle / username validation
  const handleUsernameChange = async (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const requestId = ++slugRequestRef.current;
    setUsername(val);
    setError("");

    if (!val || val === user.username) {
      setSlugAvailable(true);
      setSlugChecking(false);
      return;
    }

    setSlugChecking(true);
    try {
      const portfolioSlugAvailable = await validateSlug(val, portfolioUsingHandle?.id || null);
      const localUsernameAvailable = isCloudAuth || storageService.isUsernameAvailable(val, user.id);
      if (requestId === slugRequestRef.current) {
        setSlugAvailable(portfolioSlugAvailable && localUsernameAvailable);
      }
    } catch {
      if (requestId === slugRequestRef.current) setSlugAvailable(false);
    } finally {
      if (requestId === slugRequestRef.current) setSlugChecking(false);
    }
  };

  // Avatar upload with auto-compression (400x400) + Cloudinary/local storage
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError("");
    setSuccessMsg("");

    try {
      // Compress to 400x400 clean square avatar
      const compressed = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        cropToSquare: true,
      });

      let finalAvatarUrl = compressed.dataUrl;

      // Upload to Cloudinary if configured
      if (isCloudinaryConfigured) {
        try {
          const cloudRes = await uploadToCloudinary(compressed.dataUrl || file, {
            folder: "versebuilder/avatars",
          });
          if (cloudRes?.url) {
            finalAvatarUrl = cloudRes.url;
          }
        } catch (err) {
          console.warn("Cloudinary upload fallback to dataUrl:", err);
        }
      }

      setAvatar(finalAvatarUrl);
      setSuccessMsg("Profile photo compressed and ready to save.");
    } catch (err) {
      setError("Failed to process profile image: " + (err.message || "Unknown error"));
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleResetAvatar = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || user.username || "creator"}`;
    setAvatar(defaultAvatar);
    setSuccessMsg("Reset avatar to default seed.");
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setSuccessMsg("Profile photo will be removed when you save.");
  };

  // Save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);

    try {
      if (!name.trim()) {
        throw new Error("Display Name cannot be empty.");
      }
      if (!username.trim()) {
        throw new Error("Public Handle / Username cannot be empty.");
      }
      if (!slugAvailable && username !== user.username) {
        throw new Error("This username is already taken. Please choose another.");
      }

      const previousUser = user;
      const isHandleChanged = username.trim() !== user.username;
      const currentPortfolios = await refreshPortfolios();
      const currentHandlePortfolio = currentPortfolios.find((portfolio) => portfolio.slug === user.username);
      if (isHandleChanged) {
        const available = await validateSlug(username.trim(), currentHandlePortfolio?.id || null);
        const localUsernameAvailable = isCloudAuth || storageService.isUsernameAvailable(username.trim(), user.id);
        if (!available || !localUsernameAvailable) {
          throw new Error("That public handle is already used. Please choose another.");
        }
      }

      const updatedUser = await updateProfile({
        name: name.trim(),
        username: username.trim(),
        avatar,
        bio: bio.trim(),
      });

      await syncAccountIdentity(previousUser, updatedUser, { syncProfile: syncToPortfolio });
      await refreshPortfolios();

      setSuccessMsg("Account profile successfully updated!");
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Save password update
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword(newPassword);
      setSuccessMsg("Password successfully updated!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="account-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="account-modal-header">
          <div className="account-modal-title-group">
            <div className="account-icon-badge">
              <User size={20} className="text-accent" />
            </div>
            <div>
              <h2>Profile &amp; Account Settings</h2>
              <p>Manage your public identity, avatar photo, and account security.</p>
            </div>
          </div>
          <button
            type="button"
            className="account-modal-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="account-modal-tabs">
          <button
            type="button"
            className={`account-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setError("");
              setSuccessMsg("");
            }}
          >
            <User size={15} />
            <span>Profile &amp; Identity</span>
          </button>
          <button
            type="button"
            className={`account-tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("security");
              setError("");
              setSuccessMsg("");
            }}
          >
            <Lock size={15} />
            <span>Security &amp; Password</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="account-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="account-alert success">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Profile & Identity */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="account-form">
            {/* Avatar Section */}
            <div className="account-avatar-card">
              <div className="account-avatar-preview-wrap">
                {avatar ? (
                  <img src={avatar} alt={name || "Avatar"} className="account-avatar-img" />
                ) : (
                  <div className="account-avatar-placeholder">
                    {name?.charAt(0) || "U"}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="account-avatar-loading-overlay">
                    <Sparkles size={20} className="animate-spin text-accent" />
                  </div>
                )}
              </div>

              <div className="account-avatar-info">
                <h4>Profile Avatar</h4>
                <p>Upload a photo to crop to a centered square, resize, and compress to 400&times;400. Preview it here before saving.</p>
                <div className="account-avatar-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFile}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="account-btn secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    <Camera size={14} />
                    <span>{uploadingAvatar ? "Compressing..." : "Upload Photo"}</span>
                  </button>
                  <button
                    type="button"
                    className="account-btn text-muted"
                    onClick={handleResetAvatar}
                    disabled={uploadingAvatar}
                    title="Reset to generated avatar"
                  >
                    <Trash2 size={14} />
                    <span>Reset Avatar</span>
                  </button>
                  <button
                    type="button"
                    className="account-btn text-muted"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar || !avatar}
                    title="Remove profile photo"
                  >
                    <X size={14} />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="account-form-row">
              <div className="editor-form-group">
                <label className="editor-label">Display / Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="editor-input"
                    required
                  />
                </div>
              </div>

              {/* Public Username / Handle */}
              <div className="editor-form-group">
                <label className="editor-label">
                  Public Handle / Slug *
                  {slugChecking && <span className="slug-status checking"> Checking...</span>}
                  {!slugChecking && username && !slugAvailable && (
                    <span className="slug-status unavailable"> Already Taken</span>
                  )}
                  {!slugChecking && username && slugAvailable && username !== user.username && (
                    <span className="slug-status available"> Available</span>
                  )}
                </label>
                <div className="input-with-icon">
                  <AtSign size={16} />
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="alex-rivera"
                    className="editor-input"
                    required
                  />
                </div>
                <small className="account-field-help">
                  {portfolioUsingHandle ? (
                    <>Public portfolio URL: <code>{window.location.origin}/u/{username || "your-handle"}</code></>
                  ) : (
                    <>Portfolios keep their own public URLs; this handle identifies your account.</>
                  )}
                </small>
              </div>
            </div>

            {/* Email Address (Read-Only) */}
            <div className="editor-form-group">
              <label className="editor-label">Account Email (Read-Only)</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="editor-input is-disabled"
                />
              </div>
              <small className="account-field-help">
                Primary login email registered to your VerseBuilder account.
              </small>
            </div>

            {/* Bio / Tagline */}
            <div className="editor-form-group">
              <label className="editor-label">Bio / Tagline Shortcut</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Senior Visual Designer & Motion Director crafting futuristic digital experiences."
                rows={3}
                className="editor-input"
              />
            </div>

            {/* Sync inherited account details while retaining portfolio specific overrides */}
            {userPortfolios.length > 0 && (
              <label className="account-checkbox-label">
                <input
                  type="checkbox"
                  checked={syncToPortfolio}
                  onChange={(e) => setSyncToPortfolio(e.target.checked)}
                />
                <span>Sync account name, avatar, and bio to portfolios that still use my account defaults. Custom portfolio details stay as they are.</span>
              </label>
            )}

            {/* Modal Actions */}
            <div className="account-modal-footer">
              <button
                type="button"
                className="account-btn secondary"
                onClick={() => setIsOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="account-btn primary"
                disabled={saving || uploadingAvatar || slugChecking || (!slugAvailable && username !== user.username)}
              >
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === "security" && (
          <form onSubmit={handleSavePassword} className="account-form">
            <div className="account-security-notice">
              <Shield size={20} className="text-accent" />
              <div>
                <h4>Change Account Password</h4>
                <p>Create a strong password of at least 6 characters to secure your portfolios and media.</p>
              </div>
            </div>

            <div className="editor-form-group">
              <label className="editor-label">New Password</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="editor-input"
                  required
                />
              </div>
            </div>

            <div className="editor-form-group">
              <label className="editor-label">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="editor-input"
                  required
                />
              </div>
            </div>

            <div className="account-modal-footer">
              <button
                type="button"
                className="account-btn secondary"
                onClick={() => setIsOpen(false)}
                disabled={savingPassword}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="account-btn primary"
                disabled={savingPassword || !newPassword}
              >
                {savingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
