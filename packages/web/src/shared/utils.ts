export const sample = <T = unknown>(array: T[] | readonly T[]) =>
  array[Math.floor(Math.random() * array.length)];

export function sampleUniq<T = unknown>(
  array: T[],
  compare?: T,
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
  const roundedMin = Math.ceil(min);
  return Math.floor(
    Math.random() * (Math.floor(max) - roundedMin + 1) + roundedMin,
  ); //The maximum is inclusive and the minimum is inclusive
}

export function preload(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
}
