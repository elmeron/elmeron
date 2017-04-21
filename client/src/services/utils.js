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

/* eslint-enable import/prefer-default-export */
