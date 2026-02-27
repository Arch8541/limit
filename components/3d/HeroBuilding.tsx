'use client';

export function HeroBuilding() {
  return (
    <div className="building-3d-container">
      <div className="building-3d">
        {/* Ambient glow */}
        <div className="building-glow" />

        {/* Grid floor */}
        <div className="building-grid-floor" />

        {/* Wireframe building */}
        <div className="building-wireframe">
          {/* Building faces */}
          <div className="building-face building-face-front">
            <div className="building-floors">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="building-floor-line" />
              ))}
            </div>
            <div className="building-scan" />
          </div>
          <div className="building-face building-face-back" />
          <div className="building-face building-face-left" />
          <div className="building-face building-face-right" />
          <div className="building-face building-face-top" />
        </div>

        {/* Floating particles */}
        <div className="building-particles">
          <div className="building-particle" />
          <div className="building-particle" />
          <div className="building-particle" />
          <div className="building-particle" />
          <div className="building-particle" />
        </div>
      </div>
    </div>
  );
}
