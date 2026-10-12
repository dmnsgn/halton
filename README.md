# halton

[![npm version](https://img.shields.io/npm/v/halton)](https://www.npmjs.com/package/halton)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/halton)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/halton)](https://bundlephobia.com/package/halton)
[![dependencies](https://img.shields.io/librariesio/release/npm/halton)](https://github.com/dmnsgn/halton/blob/main/package.json)
[![types](https://img.shields.io/npm/types/halton)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/halton)](https://github.com/dmnsgn/halton/blob/main/LICENSE.md)

Generate n points of the Halton sequence in n-dimensions.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

[![halton screenshot](https://raw.githubusercontent.com/dmnsgn/halton/main/screenshot.png)](https://dmnsgn.github.io/halton/)

## Installation

```bash
npm install halton
```

## Usage

```js
import halton from "halton";

const points = halton(pointsCount);
// =>
// 0: [0, 0]
// 1: [0.5, 0.3333333333333333]
// 2: [0.25, 0.6666666666666666]
// 3: [0.75, 0.1111111111111111]
```

### Scrambling

Higher bases show regular patterns. Scramble each base with a digit permutation to break them.

With Faure permutations (deterministic):

```js
import halton, { createFaurePermutations } from "halton";

const bases = [11, 13];
const points = halton(pointsCount, bases, createFaurePermutations(bases));
```

With random permutations (`Math.random` by default). Pass a seeded random function, e.g. from [pex-random](https://github.com/pex-gl/pex-random), for reproducible results:

```js
import halton, { createPermutations } from "halton";
import random from "pex-random";

const bases = [11, 13];
const points = halton(pointsCount, bases, createPermutations(bases));

const prng = random.create(1);
const seededPoints = halton(
  pointsCount,
  bases,
  createPermutations(bases, () => prng.float()),
);
```

## API

<!-- api-start -->

<a name="module_halton"></a>

## halton

- [halton](#module_halton)
  - [.haltonSequence(index, base, [permutation])](#module_halton.haltonSequence) ⇒ <code>number</code>
  - [.createPermutations([bases], [random])](#module_halton.createPermutations) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
  - [.createFaurePermutations([bases])](#module_halton.createFaurePermutations) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
  - [.default(count, [bases], [permutations])](#module_halton.default) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

<a name="module_halton.haltonSequence"></a>

### halton.haltonSequence(index, base, [permutation]) ⇒ <code>number</code>

The Halton sequence algorithm (radical inverse), optionally scrambled with a
digit permutation.

**Kind**: static method of [<code>halton</code>](#module_halton)
**See**

- [Wikipedia Halton_sequence](https://en.wikipedia.org/wiki/Halton_sequence#Implementation)
- [PBR Book The Halton Sampler](https://www.pbr-book.org/3ed-2018/Sampling_and_Reconstruction/The_Halton_Sampler)

| Param         | Type                              | Description                                                      |
| ------------- | --------------------------------- | ---------------------------------------------------------------- |
| index         | <code>number</code>               | Index in the sequence.                                           |
| base          | <code>number</code>               | An integer, preferably prime number.                             |
| [permutation] | <code>Array.&lt;number&gt;</code> | A permutation of the digits [0, base - 1] applied to each digit. |

<a name="module_halton.createPermutations"></a>

### halton.createPermutations([bases], [random]) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

Create a random digit permutation for each base, to scramble the Halton
sequence.

**Kind**: static method of [<code>halton</code>](#module_halton)

| Param    | Type                              | Default                  | Description                                           |
| -------- | --------------------------------- | ------------------------ | ----------------------------------------------------- |
| [bases]  | <code>Array.&lt;number&gt;</code> | <code>[2, 3]</code>      | The bases to create a permutation for.                |
| [random] | <code>function</code>             | <code>Math.random</code> | A random number generator returning values in [0, 1). |

<a name="module_halton.createFaurePermutations"></a>

### halton.createFaurePermutations([bases]) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

Create a deterministic Faure digit permutation for each base, to scramble the
Halton sequence.

**Kind**: static method of [<code>halton</code>](#module_halton)
**See**: Faure, "Good permutations for extreme discrepancy", Journal of Number Theory, 1992.

| Param   | Type                              | Default             | Description                            |
| ------- | --------------------------------- | ------------------- | -------------------------------------- |
| [bases] | <code>Array.&lt;number&gt;</code> | <code>[2, 3]</code> | The bases to create a permutation for. |

<a name="module_halton.default"></a>

### halton.default(count, [bases], [permutations]) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

Generate n points of the Halton sequence in n-dimensions. The "bases"
parameter defines how many dimensions. Pass "permutations" to scramble the
sequence and break the regular patterns of higher bases.

**Kind**: static method of [<code>halton</code>](#module_halton)

| Param          | Type                                            | Default             | Description                                                                          |
| -------------- | ----------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| count          | <code>number</code>                             |                     | Number of points in the sequence to generate.                                        |
| [bases]        | <code>Array.&lt;number&gt;</code>               | <code>[2, 3]</code> | The bases for the Van der Corput operation. Best results with small coprime numbers. |
| [permutations] | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |                     | A digit permutation per base. See createPermutations and createFaurePermutations.    |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/halton/blob/main/LICENSE.md).
