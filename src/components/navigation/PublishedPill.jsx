import { Sparkles, ArrowRight } from "lucide-react";
import { useAppRouter } from "../../router/Router";

export const PublishedPill = ({ portfolio }) => {
  const { navigate } = useAppRouter();

  return (
    <div className="published-pill-container">
      <div className="published-pill-inner" onClick={() => navigate("/")}>
        <div className="pill-badge-icon">
          <Sparkles size={14} />
        </div>
        <span className="pill-text">
          Built with <strong>VerseBuilder</strong> • Create your own free portfolio
        </span>
        <ArrowRight size={14} className="pill-arrow" />
      </div>
    </div>
  );
};
