import { ThreatTarget, THREAT_STYLE } from "../../types/threat";

const markerPath = {
  diamond: "M50 6 L86 50 L50 94 L14 50 Z",
  triangle: "M50 5 L90 88 L50 72 L10 88 Z",
  bolt: "M55 4 L20 58 L48 55 L37 96 L82 38 L55 42 Z",
  chevron: "M50 6 L88 50 L70 92 L50 68 L30 92 L12 50 Z",
  hex: "M28 12 L72 12 L94 50 L72 88 L28 88 L6 50 Z"
} as const;

export function buildTargetHtml(target: ThreatTarget, zoomScale: number) {
  const style = THREAT_STYLE[target.type];
  const size = Math.round(style.size * zoomScale);
  const label = target.callsign ?? style.shortLabel;
  const speed = Math.round(target.speedKmh);

  return `
    <div class="target-marker target-${target.type}" style="--target-color:${style.color}; --target-glow:${style.glow}; --marker-size:${size}px;">
      <div class="target-heading" style="transform: rotate(${target.heading}deg)">
        <div class="target-cone"></div>
        <div class="target-pulse"></div>
        <svg class="target-glyph" viewBox="0 0 100 100" aria-hidden="true">
          <path d="${markerPath[style.marker]}"></path>
          <circle cx="50" cy="50" r="8"></circle>
          <line x1="50" y1="10" x2="50" y2="0"></line>
        </svg>
        <div class="target-arrow"></div>
      </div>
      <div class="target-readout">
        <strong>${label}</strong>
        <span>${speed} км/г</span>
      </div>
    </div>
  `;
}
