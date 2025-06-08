/**
 * Main library module
 * @module index
 */

/**
 * Default export for the main library
 * @type {Object}
 */
export const greet = (name: string = "World"): string => {
  return `Hello, ${name}!`;
};

export default greet;
