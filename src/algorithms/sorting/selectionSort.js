export async function selectionSort(array, updateArray, setComparingIndices, setSwappingIndices, speed) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // Highlight comparing elements
      setComparingIndices([minIdx, j]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      // Highlight swapping elements
      setSwappingIndices([i, minIdx]);
      await new Promise(resolve => setTimeout(resolve, speed));

      // Swap elements
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      updateArray([...arr]);

      await new Promise(resolve => setTimeout(resolve, speed));
      setSwappingIndices([]);
    }

    setComparingIndices([]);
  }

  return arr;
}

export const selectionSortInfo = {
  name: "Selection Sort",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description: "Selection Sort divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region."
};
