export const isNil = arg => arg === null || arg === undefined;

export const isUndefined = arg => arg === undefined;
export const detectmob = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  }
  return false;
};

export const isIos = () =>
  window &&
  window.navigator &&
  window.navigator.platform &&
  !!window.navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
