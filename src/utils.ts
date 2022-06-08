type CreateBytesOptions = {
  offset?: number;
  length?: number;
  value?: string | number | number[];
  fillSymbol?: number;
};

/** Fill bytes array with given symbols */
function fillBytesWithLength(
  bytes: number[] = [],
  len: number,
  fillSymbol = 0x0
) {
  return Array.from({ length: len }, (_, i) => bytes[i] || fillSymbol);
}

/**
 * Create bytes array from string
 */
function createBytesFromString(value: string) {
  return [...value].map((character) => character.charCodeAt(0));
}

/**
 * Create bytes array
 */
export function createBytes(options: CreateBytesOptions | string): number[] {
  if (typeof options === "string") {
    return createBytesFromString(options);
  }

  let strBytes =
    typeof options.value === "string"
      ? createBytesFromString(options.value)
      : typeof options.value === "number"
      ? [options.value]
      : options.value || [];

  if (options.length) {
    strBytes = fillBytesWithLength(
      strBytes,
      options.length,
      options.fillSymbol
    );
  }

  if (typeof options.offset === "number") {
    const offsetBytes = fillBytesWithLength([], options.offset);
    return [...offsetBytes, ...strBytes];
  }

  return strBytes;
}
