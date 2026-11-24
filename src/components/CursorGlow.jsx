import { useEffect } from "react";

const CursorGlow = () => {
  useEffect(() => {
    const glow = document.createElement("div");
    glow.style.position = "fixed";
    glow.style.width = "20px";
    glow.style.height = "20px";
    glow.style.borderRadius = "50%";
    glow.style.background = "rgba(168,85,247,0.7)";
    glow.style.pointerEvents = "none";
    glow.style.zIndex = "9999";
    glow.style.filter = "blur(10px)";
    document.body.appendChild(glow);

    const move = (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(glow);
    };
  }, []);

  return null;
};

export default CursorGlow;