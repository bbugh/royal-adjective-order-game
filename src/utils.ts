export function pickRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomElements<T>(arr: T[], count: number): T[] {
  // Clone the array to avoid modifying the original array
  const result: T[] = arr.slice();
  let m = result.length;
  let t: T;
  let i: number;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  // If n is greater than the array length, limit n to the array length
  count = Math.min(count, arr.length);

  return result.slice(0, count);
}

export function pickRandomElementsInOrder<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  const length = arr.length;
  const indices = Array.from({ length }, (_, i) => i);

  // Shuffle the indices array
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Pick the first n indices from the shuffled indices array
  const selectedIndices = indices.slice(0, Math.min(count, length));

  // Sort the selected indices to ensure the order is the same as in the original array
  selectedIndices.sort((a, b) => a - b);

  // Map the indices back to elements
  for (const index of selectedIndices) {
    result.push(arr[index]);
  }

  return result;
}

export function shuffleArray(arr: any[]) {
  const result = arr.slice();
  let m = result.length;
  let t: any;
  let i: number;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  return result;
}

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
