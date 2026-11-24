import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Tag, Check } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const PRESET_SKILLS = [
  "Premiere Pro",
  "After Effects",
  "Photoshop",
  "Retention Editing",
  "Sound Design",
  "Color Grading",
  "Thumbnail Design",
  "Hook Optimization",
  "Blender 3D",
  "Cinema 4D",
  "Figma",
  "Typography",
  "Brand Identity",
  "Motion Graphics",
  "Illustrator",
  "DaVinci Resolve",
];

export const SkillsEditor = () => {
  const { activePortfolio, updateActivePortfolio } = usePortfolio();
  if (!activePortfolio) return null;

  const { skills = [] } = activePortfolio;
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Core");
  const [newSkillLevel, setNewSkillLevel] = useState(85);

  const handleAddSkill = (name = null, category = "Core", level = 85) => {
    const finalName = (name || newSkillName).trim();
    if (!finalName) return;

    const newSkill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      level: Number(level),
      category: category,
    };

    updateActivePortfolio({
      skills: [...skills, newSkill],
    });

    setNewSkillName("");
  };

  const handleSkillChange = (id, field, value) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    updateActivePortfolio({ skills: updated });
  };

  const handleDeleteSkill = (id) => {
    updateActivePortfolio({
      skills: skills.filter((s) => s.id !== id),
    });
  };

  const moveSkill = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const newSkills = [...skills];
    const [moved] = newSkills.splice(index, 1);
    newSkills.splice(targetIndex, 0, moved);

    updateActivePortfolio({ skills: newSkills });
  };

  return (
    <div className="editor-tab-pane">
      <div className="editor-section-header">
        <h2>Skills & Technical Superpowers</h2>
        <p>Showcase your expertise with proficiency percentages and categories.</p>
      </div>

      {/* Quick Suggestions Chips */}
      <div className="editor-card">
        <h3 className="editor-card-title">
          <Sparkles size={16} className="text-accent" /> Quick Add Popular Skills
        </h3>
        <p className="editor-card-sub">Click any skill to instantly add it to your portfolio:</p>
        <div className="skills-chip-cloud">
          {PRESET_SKILLS.filter((p) => !skills.some((s) => s.name.toLowerCase() === p.toLowerCase())).map(
            (preset) => (
              <button
                type="button"
                key={preset}
                className="skill-preset-chip"
                onClick={() => handleAddSkill(preset, "Creative", 85)}
              >
                <Plus size={13} />
                <span>{preset}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Add Custom Skill Form */}
      <div className="editor-card">
        <h3 className="editor-card-title">Add Custom Skill</h3>
        <div className="add-skill-form-row">
          <div className="form-col-name">
            <label className="editor-label">Skill Name</label>
            <input
              type="text"
              placeholder="e.g. 3D Fluid Simulation"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="editor-input"
            />
          </div>

          <div className="form-col-category">
            <label className="editor-label">Category</label>
            <input
              type="text"
              placeholder="e.g. Motion"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="editor-input"
            />
          </div>

          <div className="form-col-level">
            <div className="level-label-wrap">
              <label className="editor-label">Proficiency</label>
              <span className="level-val-badge">{newSkillLevel}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Number(e.target.value))}
              className="editor-slider"
            />
          </div>

          <button
            type="button"
            className="editor-btn-primary add-skill-btn"
            onClick={() => handleAddSkill()}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>
      </div>

      {/* Current Skills List */}
      <div className="editor-card">
        <div className="card-header-with-action">
          <div>
            <h3 className="editor-card-title">Current Skills ({skills.length})</h3>
            <p className="editor-card-sub">Drag or use arrows to reorder how skills appear in your template.</p>
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="editor-empty-state">
            <Tag size={32} />
            <p>No skills added yet. Add a skill above or click one of the quick suggestions!</p>
          </div>
        ) : (
          <div className="skills-active-list">
            {skills.map((skill, index) => (
              <div className="skill-active-row" key={skill.id || index}>
                <div className="skill-reorder-btns">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSkill(index, -1)}
                    className="reorder-btn"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === skills.length - 1}
                    onClick={() => moveSkill(index, 1)}
                    className="reorder-btn"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="skill-row-info">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(skill.id, "name", e.target.value)}
                    className="editor-input skill-inline-name"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={skill.category || ""}
                    onChange={(e) => handleSkillChange(skill.id, "category", e.target.value)}
                    className="editor-input skill-inline-cat"
                  />
                </div>

                <div className="skill-row-slider">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skill.level || 50}
                    onChange={(e) => handleSkillChange(skill.id, "level", Number(e.target.value))}
                    className="editor-slider"
                  />
                  <span className="slider-pct-label">{skill.level}%</span>
                </div>

                <button
                  type="button"
                  className="editor-btn-icon-danger"
                  onClick={() => handleDeleteSkill(skill.id)}
                  title="Delete Skill"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
