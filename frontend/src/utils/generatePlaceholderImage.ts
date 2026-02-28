/**
 * Generates a deterministic placeholder image as a data URI using Canvas.
 * The image is based on a hash of the prompt for uniqueness.
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function generatePlaceholderImage(prompt: string): string {
  const hash = hashString(prompt || 'default');
  const hue1 = hash % 360;
  const hue2 = (hash * 7 + 120) % 360;
  const hue3 = (hash * 13 + 240) % 360;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  const [r1, g1, b1] = hslToRgb(hue1, 70, 15);
  const [r2, g2, b2] = hslToRgb(hue2, 60, 20);
  grad.addColorStop(0, `rgb(${r1},${g1},${b1})`);
  grad.addColorStop(1, `rgb(${r2},${g2},${b2})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Decorative circles
  for (let i = 0; i < 8; i++) {
    const cx = ((hash * (i + 1) * 37) % 512);
    const cy = ((hash * (i + 1) * 53) % 512);
    const radius = 30 + ((hash * (i + 1) * 17) % 80);
    const [rc, gc, bc] = hslToRgb((hue3 + i * 30) % 360, 80, 60);
    const circleGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    circleGrad.addColorStop(0, `rgba(${rc},${gc},${bc},0.4)`);
    circleGrad.addColorStop(1, `rgba(${rc},${gc},${bc},0)`);
    ctx.fillStyle = circleGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grid lines
  ctx.strokeStyle = `rgba(255,255,255,0.05)`;
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Center glow
  const centerGrad = ctx.createRadialGradient(256, 256, 0, 256, 256, 200);
  const [rg, gg, bg] = hslToRgb(hue1, 90, 70);
  centerGrad.addColorStop(0, `rgba(${rg},${gg},${bg},0.3)`);
  centerGrad.addColorStop(1, `rgba(${rg},${gg},${bg},0)`);
  ctx.fillStyle = centerGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Prompt text overlay
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 16px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const maxWidth = 440;
  const words = prompt.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  const lineHeight = 24;
  const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
  lines.slice(0, 4).forEach((line, i) => {
    ctx.fillText(line, 256, startY + i * lineHeight);
  });

  // NEXO AI watermark
  ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
  ctx.font = '500 13px Outfit, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('NEXO AI', 500, 500);

  return canvas.toDataURL('image/png');
}
