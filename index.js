/** @module halton */

import { radicalInverse } from "hammersley";

/**
 * The Halton sequence algorithm.
 * @see [Wikipedia Halton_sequence]{@link https://en.wikipedia.org/wiki/Halton_sequence#Implementation}
 * @param {number} index Index in the sequence.
 * @param {number} base An integer, preferably prime number.
 * @returns {number}
 */
function haltonSequence(index, base) {
  let fraction = 1;
  let result = 0;

  while (index > 0) {
    fraction /= base;
    result += fraction * (index % base);
    index = ~~(index / base);
  }

  return result;
}

/**
 * Generate n points of the Halton sequence in n-dimensions.
 * The "bases" parameter defines how many dimensions.
 * @alias module:halton.default
 * @param {number} count Number of points in the sequence to generate.
 * @param {number[]} [bases=[2, 3]] The bases for the Van der Corput operation. Best results with small coprime numbers.
 * @returns {number[][]}
 */
const halton = (count, bases = [2, 3]) =>
  Array.from({ length: count }, (_, index) =>
    bases.map((base) =>
      base === 2 ? radicalInverse(index) : haltonSequence(index, base),
    ),
  );

export { haltonSequence };
export default halton;
