import config from '../../config.js';

/* eslint-disable */
export function hexToPixel(q, r) {
  const { size, spacing } = config.tiles;
  const width = (size + spacing) * 2;
  const height = (Math.sqrt(3) / 2) * width;
  const horiz = width * (3 / 4);
  const vert = height;

  return {
    x: horiz * q,
    y: vert * (r + (q / 2)),
  };
}
/* eslint-enable */
