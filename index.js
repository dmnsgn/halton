/** @module halton */

import { radicalInverse } from "hammersley";

// Largest double below 1: keeps scrambled values in [0, 1).
const ONE_MINUS_EPSILON = 1 - Number.EPSILON / 2;

/**
 * The Halton sequence algorithm (radical inverse), optionally scrambled with a
 * digit permutation.
 *
 * @param {number} index Index in the sequence.
 * @param {number} base An integer, preferably prime number.
 * @param {number[]} [permutation] A permutation of the digits [0, base - 1]
 *   applied to each digit.
 * @returns {number}
 * @see [Wikipedia Halton_sequence]{@link https://en.wikipedia.org/wiki/Halton_sequence#Implementation}
 * @see [PBR Book The Halton Sampler]{@link https://www.pbr-book.org/3ed-2018/Sampling_and_Reconstruction/The_Halton_Sampler}
 */
function haltonSequence(index, base, permutation) {
  // Single division at the end for a correctly rounded result.
  let reversedDigits = 0;
  let baseN = 1;

  while (index > 0) {
    const next = Math.floor(index / base);
    const digit = index - next * base;
    reversedDigits =
      reversedDigits * base + (permutation ? permutation[digit] : digit);
    baseN *= base;
    index = next;
  }

  if (!permutation) return reversedDigits / baseN;

  // Leading zeros are permuted too: add their infinite suffix (geometric series).
  return Math.min(
    (reversedDigits + permutation[0] / (base - 1)) / baseN,
    ONE_MINUS_EPSILON,
  );
}

/**
 * Create a random digit permutation for each base, to scramble the Halton
 * sequence.
 *
 * @param {number[]} [bases=[2, 3]] The bases to create a permutation for.
 * @param {function(): number} [random=Math.random] A random number generator
 *   returning values in [0, 1).
 * @returns {number[][]}
 */
const createPermutations = (bases = [2, 3], random = Math.random) =>
  bases.map((base) => {
    const permutation = Array.from({ length: base }, (_, digit) => digit);

    for (let i = base - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }

    return permutation;
  });

const faurePermutation = (base) => {
  if (base === 2) return [0, 1];

  if (base % 2 === 0) {
    const half = faurePermutation(base / 2).map((digit) => 2 * digit);
    return [...half, ...half.map((digit) => digit + 1)];
  }

  const center = (base - 1) / 2;
  const permutation = faurePermutation(base - 1).map((digit) =>
    digit >= center ? digit + 1 : digit,
  );
  permutation.splice(center, 0, center);
  return permutation;
};

/**
 * Create a deterministic Faure digit permutation for each base, to scramble the
 * Halton sequence.
 *
 * @param {number[]} [bases=[2, 3]] The bases to create a permutation for.
 * @returns {number[][]}
 * @see Faure, "Good permutations for extreme discrepancy", Journal of Number Theory, 1992.
 */
const createFaurePermutations = (bases = [2, 3]) => bases.map(faurePermutation);

/**
 * Generate n points of the Halton sequence in n-dimensions. The "bases"
 * parameter defines how many dimensions. Pass "permutations" to scramble the
 * sequence and break the regular patterns of higher bases.
 *
 * @param {number} count Number of points in the sequence to generate.
 * @param {number[]} [bases=[2, 3]] The bases for the Van der Corput operation.
 *   Best results with small coprime numbers.
 * @param {number[][]} [permutations] A digit permutation per base. See
 *   createPermutations and createFaurePermutations.
 * @returns {number[][]}
 * @alias module:halton.default
 */
const halton = (count, bases = [2, 3], permutations) =>
  Array.from({ length: count }, (_, index) =>
    bases.map((base, i) => {
      const permutation = permutations?.[i];
      return base === 2 && !permutation
        ? radicalInverse(index)
        : haltonSequence(index, base, permutation);
    }),
  );

export { haltonSequence, createPermutations, createFaurePermutations };
export default halton;
