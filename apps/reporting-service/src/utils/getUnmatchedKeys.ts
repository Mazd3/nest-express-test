export function getUnmatchedKeys(
  keys: string[],
  match: Record<string, unknown>,
): [] | string[] {
  const matchKeys = Object.keys(match);
  const unmatchedKeys = [];
  keys.map((key) => {
    if (!matchKeys.includes(key)) {
      unmatchedKeys.push(key);
    }
  });
  return unmatchedKeys;
}
