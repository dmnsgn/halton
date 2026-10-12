import test from "node:test";
import assert from "node:assert";

import halton, { haltonSequence, createPermutations } from "../index.js";

// No intermediate rounding: only the final conversion to a double.
const exactRadicalInverse = (index, base, permutation) => {
  const b = BigInt(base);
  let n = BigInt(index);
  let numerator = 0n;
  let denominator = 1n;

  while (n > 0n) {
    const digit = Number(n % b);
    numerator =
      numerator * b + BigInt(permutation ? permutation[digit] : digit);
    denominator *= b;
    n /= b;
  }

  if (!permutation) return Number(numerator) / Number(denominator);

  return (
    Number(numerator * (b - 1n) + BigInt(permutation[0])) /
    Number(denominator * (b - 1n))
  );
};

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const bases = [2, 3, 5, 7, 11, 13, 101];

test("should return the first points with default bases", () => {
  assert.deepStrictEqual(halton(4), [
    [0, 0],
    [0.5, 0.3333333333333333],
    [0.25, 0.6666666666666666],
    [0.75, 0.1111111111111111],
  ]);
});

test("should generate count points of bases.length dimensions", () => {
  const points = halton(10, [2, 3, 5]);
  assert.strictEqual(points.length, 10);
  for (const point of points) assert.strictEqual(point.length, 3);
});

test("should compute a correctly rounded radical inverse", () => {
  for (const base of bases) {
    for (let index = 0; index < 5000; index++) {
      assert.strictEqual(
        haltonSequence(index, base),
        exactRadicalInverse(index, base),
        `index ${index}, base ${base}`,
      );
    }
  }
});

test("should support indices above 32 bits", () => {
  for (const index of [2 ** 31, 3 * 2 ** 32 + 1, 2 ** 40 + 7]) {
    for (const base of bases) {
      assert.strictEqual(
        haltonSequence(index, base),
        exactRadicalInverse(index, base),
        `index ${index}, base ${base}`,
      );
    }
  }
});

test("should match the base 2 fast path", () => {
  const points = halton(1024, [2]);
  for (let index = 0; index < points.length; index++) {
    assert.strictEqual(points[index][0], haltonSequence(index, 2));
  }
});

test("should leave the sequence unchanged with identity permutations", () => {
  const identities = bases.map((base) =>
    Array.from({ length: base }, (_, digit) => digit),
  );
  assert.deepStrictEqual(halton(512, bases, identities), halton(512, bases));
});

test("should compute the scrambled radical inverse", () => {
  const permutations = createPermutations(bases, mulberry32(1));
  bases.forEach((base, i) => {
    for (let index = 0; index < 5000; index++) {
      const value = haltonSequence(index, base, permutations[i]);
      const expected = exactRadicalInverse(index, base, permutations[i]);
      assert.ok(
        Math.abs(value - expected) <= Number.EPSILON,
        `index ${index}, base ${base}: ${value} != ${expected}`,
      );
    }
  });
});

test("should keep scrambled values in [0, 1)", () => {
  // permutation[0] = base - 1 produces the largest values and hits the clamp.
  for (const base of bases) {
    const reversed = Array.from(
      { length: base },
      (_, digit) => base - 1 - digit,
    );
    for (let index = 0; index < 1000; index++) {
      const value = haltonSequence(index, base, reversed);
      assert.ok(value >= 0 && value < 1, `index ${index}, base ${base}`);
    }
  }
});

test("should scramble base 2 with a permutation", () => {
  const points = halton(8, [2], [[1, 0]]);
  for (let index = 1; index < points.length; index++) {
    assert.strictEqual(points[index][0], 1 - haltonSequence(index, 2));
  }
});

test("should preserve stratification when scrambled", () => {
  const permutations = createPermutations(bases, mulberry32(2));
  bases.slice(0, -1).forEach((base, i) => {
    // The first base^k points are evenly spaced by base^-k.
    const count = base ** Math.floor(Math.log(1000) / Math.log(base));
    const values = halton(count, [base], [permutations[i]])
      .map(([x]) => x)
      .sort((a, b) => a - b);
    for (let j = 1; j < count; j++) {
      assert.ok(
        Math.abs(values[j] - values[j - 1] - 1 / count) < 1e-12,
        `base ${base}, point ${j}`,
      );
    }
  });
});

test("should change the sequence when scrambled", () => {
  const permutations = createPermutations([3, 5], mulberry32(3));
  assert.notDeepStrictEqual(
    halton(64, [3, 5], permutations),
    halton(64, [3, 5]),
  );
});

test("should create a valid permutation per base", () => {
  const permutations = createPermutations(bases);
  assert.strictEqual(permutations.length, bases.length);
  bases.forEach((base, i) => {
    assert.deepStrictEqual(
      permutations[i].toSorted((a, b) => a - b),
      Array.from({ length: base }, (_, digit) => digit),
    );
  });
});

test("should create deterministic permutations with a seeded random", () => {
  assert.deepStrictEqual(
    createPermutations(bases, mulberry32(4)),
    createPermutations(bases, mulberry32(4)),
  );
});
