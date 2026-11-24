import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBg = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#020617" },
        particles: {
          number: { value: 50 },
          size: { value: 2 },
          move: { speed: 1 },
          links: {
            enable: true,
            color: "#a855f7",
            opacity: 0.3,
          },
        },
      }}
      style={{
        position: "fixed",
        zIndex: -1,
      }}
    />
  );
};

export default ParticlesBg;