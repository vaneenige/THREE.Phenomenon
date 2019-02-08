/**
 * Get a random value between positive and negative.
 * @param {number} value
 */
export function getRandomBetween(value) {
  const floor = -value;
  return floor + Math.random() * value * 2;
}

/**
 * Get a random value from an array.
 * @param {array} array
 */
export function getRandomFromArray(array) {
  console.log(array);
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get an array with noise added to values.
 * @param {array} array
 * @param {number} noise
 */
export function getArrayWithNoise(array, noise) {
  return array.map(item => item + getRandomBetween(noise));
}
