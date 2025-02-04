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

![](https://raw.githubusercontent.com/dmnsgn/halton/main/screenshot.png)

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

## API

<!-- api-start -->

<a name="halton"></a>

## halton(count, [bases]) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

Generate n points of the Halton sequence in n-dimensions.
The "bases" parameter defines how many dimensions.

**Kind**: global function

| Param   | Type                              | Default             | Description                                                                          |
| ------- | --------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| count   | <code>number</code>               |                     | Number of points in the sequence to generate.                                        |
| [bases] | <code>Array.&lt;number&gt;</code> | <code>[2, 3]</code> | The bases for the Van der Corput operation. Best results with small coprime numbers. |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/halton/blob/main/LICENSE.md).
