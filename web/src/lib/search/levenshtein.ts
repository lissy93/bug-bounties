export function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  if (!al) return bl;
  if (!bl) return al;

  let prev2: number[] | null = null;
  let prev = new Array<number>(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;

  for (let i = 1; i <= al; i++) {
    const curr = new Array<number>(bl + 1);
    curr[0] = i;
    let rowMin = curr[0];
    const ac = a.charCodeAt(i - 1);
    for (let j = 1; j <= bl; j++) {
      const bc = b.charCodeAt(j - 1);
      const cost = ac === bc ? 0 : 1;
      let v = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      /* Damerau: a swap ("appel"/"apple") is one edit */
      if (
        prev2 &&
        i > 1 &&
        j > 1 &&
        ac === b.charCodeAt(j - 2) &&
        a.charCodeAt(i - 2) === bc
      ) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = curr;
  }
  return prev[bl];
}

export function fuzzyThreshold(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 8) return 2;
  return 3;
}
