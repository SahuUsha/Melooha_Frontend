
import type { ReactNode } from "react";

const stars = Array.from({ length: 75 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  delay: `${(i % 9) * 0.45}s`,
  duration: `${2 + (i % 5)}s`,
  size: i % 7 === 0 ? "3px" : "2px",
}));

interface CosmicAuthBackgroundProps {
  children: ReactNode;
}

export default function CosmicAuthBackground({
  children,
}: CosmicAuthBackgroundProps) {
  return (
    <div className="cosmic-auth-layout">
      <div
        className="cosmos-bg auth-cosmos-bg"
        aria-hidden="true"
      >
        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />

        {stars.map((star, index) => (
          <span
            key={index}
            className="cosmic-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}

        <span className="shooting-star shooting-one" />
        <span className="shooting-star shooting-two" />
        <span className="shooting-star shooting-three" />
      </div>

      <div className="cosmic-auth-content">
        {children}
      </div>
    </div>
  );
}
