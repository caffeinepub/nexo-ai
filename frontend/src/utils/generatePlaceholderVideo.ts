/**
 * Generates a deterministic animated SVG data URI for video placeholders.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generatePlaceholderVideo(prompt: string): string {
  const hash = hashString(prompt || 'default');
  const hue1 = hash % 360;
  const hue2 = (hash * 7 + 120) % 360;
  const dur1 = 2 + (hash % 3);
  const dur2 = 3 + ((hash * 3) % 4);
  const dur3 = 1.5 + ((hash * 5) % 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue1},60%,8%)" />
        <stop offset="100%" style="stop-color:hsl(${hue2},50%,12%)" />
      </linearGradient>
      <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:hsl(${hue1},80%,60%);stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:hsl(${hue1},80%,60%);stop-opacity:0" />
      </radialGradient>
      <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:hsl(${hue2},80%,60%);stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:hsl(${hue2},80%,60%);stop-opacity:0" />
      </radialGradient>
      <filter id="blur1">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="640" height="360" fill="url(#bg)" />
    
    <!-- Animated glow orbs -->
    <circle cx="200" cy="180" r="120" fill="url(#glow1)" filter="url(#blur1)">
      <animate attributeName="cx" values="200;440;200" dur="${dur1}s" repeatCount="indefinite" />
      <animate attributeName="cy" values="180;120;180" dur="${dur2}s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;1;0.6" dur="${dur3}s" repeatCount="indefinite" />
    </circle>
    
    <circle cx="440" cy="180" r="100" fill="url(#glow2)" filter="url(#blur1)">
      <animate attributeName="cx" values="440;200;440" dur="${dur2}s" repeatCount="indefinite" />
      <animate attributeName="cy" values="180;240;180" dur="${dur1}s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.5;1" dur="${dur3 + 0.5}s" repeatCount="indefinite" />
    </circle>
    
    <!-- Grid lines -->
    ${Array.from({ length: 10 }, (_, i) => `
      <line x1="${i * 71}" y1="0" x2="${i * 71}" y2="360" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    `).join('')}
    ${Array.from({ length: 6 }, (_, i) => `
      <line x1="0" y1="${i * 72}" x2="640" y2="${i * 72}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    `).join('')}
    
    <!-- Animated particles -->
    ${Array.from({ length: 12 }, (_, i) => {
      const px = (hash * (i + 1) * 37) % 640;
      const py = (hash * (i + 1) * 53) % 360;
      const size = 2 + (i % 3);
      const pdur = 2 + (i % 4);
      return `<circle cx="${px}" cy="${py}" r="${size}" fill="hsl(${(hue1 + i * 25) % 360},80%,70%)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="${pdur}s" repeatCount="indefinite" begin="${i * 0.3}s" />
        <animate attributeName="r" values="${size};${size * 2};${size}" dur="${pdur + 1}s" repeatCount="indefinite" begin="${i * 0.2}s" />
      </circle>`;
    }).join('')}
    
    <!-- Play icon -->
    <circle cx="320" cy="180" r="36" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
      <animate attributeName="r" values="36;40;36" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <polygon points="312,165 312,195 340,180" fill="rgba(255,255,255,0.8)" />
    
    <!-- Prompt text -->
    <text x="320" y="248" text-anchor="middle" font-family="Outfit, sans-serif" font-size="13" fill="rgba(255,255,255,0.7)" font-weight="500">
      ${prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
    </text>
    
    <!-- NEXO AI watermark -->
    <text x="620" y="348" text-anchor="end" font-family="Outfit, sans-serif" font-size="11" fill="rgba(0,217,255,0.6)" font-weight="500">NEXO AI</text>
    
    <!-- Scan line animation -->
    <rect x="0" y="0" width="640" height="2" fill="rgba(255,255,255,0.06)">
      <animate attributeName="y" values="-2;362" dur="3s" repeatCount="indefinite" />
    </rect>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
