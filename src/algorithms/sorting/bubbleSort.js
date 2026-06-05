export async function bubbleSort(array, updateArray, setComparingIndices, setSwappingIndices, speed) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight comparing elements
      setComparingIndices([j, j + 1]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (arr[j] > arr[j + 1]) {
        // Highlight swapping elements
        setSwappingIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));

        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        updateArray([...arr]);

        await new Promise(resolve => setTimeout(resolve, speed));
        setSwappingIndices([]);
      }

      setComparingIndices([]);
    }
  }

  return arr;
}

export const bubbleSortInfo = {
  name: "Bubble Sort",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
};
