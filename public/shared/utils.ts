export const sample = <T = unknown>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

export function sampleUniq<T = unknown>(
  array: T[],
  compare: T,
  maxIteration = 10,
) {
  let item = sample(array);
  let count = 0;
  while (compare === item && count <= maxIteration) {
    item = sample(array);
    count++;
  }
  return item;
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
