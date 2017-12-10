/* eslint-disable import/prefer-default-export */

export function properCase(text) {
  return text.replace(/\w\S*/g, (txt) => {
    const t = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    return t;
  });
}

export function getFuelAmount(delta, deltaStart, offset, timeUnit, now) {
  const time = (now - deltaStart) / timeUnit;

  return Math.round(offset + (delta * time));
}

export function calculateAffordableTiles(amount, currentCost, costPerTile, round = true) {
  const x = currentCost;
  const y = costPerTile;
  const xy = x / y;
  const result = 0.5 - xy + Math.sqrt(xy * (xy - 1) + 0.25 + 2 * amount / y);

  return round ? Math.floor(result) : result;
}

/* eslint-enable import/prefer-default-export */
