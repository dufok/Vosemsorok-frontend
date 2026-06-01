/**
 * Shared state published by AsciiLogoBg and read by Logo3D.
 * Lets the chrome logo's reflection pan in sync with the background's
 * actual rotation, so the reflected dots stream when the bg spins.
 */
export const bgState = { rotationY: 0 };
