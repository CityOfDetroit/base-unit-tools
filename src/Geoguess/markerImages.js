// Generate marker images for guess (? icon) and actual (pin icon) map markers

function createCircleMarker(size, fillColor, drawIcon) {
  const canvas = document.createElement('canvas');
  const ratio = window.devicePixelRatio || 1;
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);

  const r = size / 2;

  // White border
  ctx.beginPath();
  ctx.arc(r, r, r - 1, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Colored fill
  ctx.beginPath();
  ctx.arc(r, r, r - 3, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Draw the icon
  drawIcon(ctx, r, size);

  return { canvas, ratio };
}

function drawQuestionMark(ctx, center, size) {
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size * 0.5}px system-ui, sans-serif`;
  ctx.fillText('?', center, center + 1);
}

function drawPin(ctx, center, size) {
  const s = size * 0.2;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(center, center - s);
  ctx.lineTo(center, center + s);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(center - s, center);
  ctx.lineTo(center + s, center);
  ctx.stroke();

  // Small center dot
  ctx.beginPath();
  ctx.arc(center, center, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

export function addMarkerImages(map, size = 26) {
  const guess = createCircleMarker(size, '#ff4444', drawQuestionMark);
  map.addImage('guess-icon', {
    width: guess.canvas.width,
    height: guess.canvas.height,
    data: guess.canvas.getContext('2d').getImageData(0, 0, guess.canvas.width, guess.canvas.height).data,
  }, { pixelRatio: guess.ratio });

  const actual = createCircleMarker(size, '#279989', drawPin);
  map.addImage('actual-icon', {
    width: actual.canvas.width,
    height: actual.canvas.height,
    data: actual.canvas.getContext('2d').getImageData(0, 0, actual.canvas.width, actual.canvas.height).data,
  }, { pixelRatio: actual.ratio });
}
