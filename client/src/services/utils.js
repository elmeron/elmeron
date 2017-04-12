/* eslint-disable import/prefer-default-export */

export function properCase(text) {
  return text.replace(/\w\S*/g, (txt) => {
    const t = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    return t;
  });
}

/* eslint-enable import/prefer-default-export */
