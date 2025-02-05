import { radicalInverse } from "hammersley";

// Based on pseudocode from https://en.wikipedia.org/wiki/Halton_sequence#Implementation
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
