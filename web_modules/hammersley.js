const bits = /* @__PURE__ */ new Uint32Array(1);
function radicalInverse(i) {
	bits[0] = i;
	bits[0] = (bits[0] << 16 | bits[0] >> 16) >>> 0;
	bits[0] = (bits[0] & 1431655765) << 1 | (bits[0] & 2863311530) >>> 1 >>> 0;
	bits[0] = (bits[0] & 858993459) << 2 | (bits[0] & 3435973836) >>> 2 >>> 0;
	bits[0] = (bits[0] & 252645135) << 4 | (bits[0] & 4042322160) >>> 4 >>> 0;
	bits[0] = (bits[0] & 16711935) << 8 | (bits[0] & 4278255360) >>> 8 >>> 0;
	return bits[0] * 23283064365386963e-26;
}
function hammersley(i, n) {
	return [i / n, radicalInverse(i)];
}

export { hammersley as default, radicalInverse };