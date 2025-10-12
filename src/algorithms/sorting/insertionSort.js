export async function insertionSort(array, updateArray, setComparingIndices, setSwappingIndices, speed) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      setComparingIndices([j, j + 1]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (arr[j] > key) {
        setSwappingIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));

        arr[j + 1] = arr[j];
        updateArray([...arr]);

        await new Promise(resolve => setTimeout(resolve, speed));
        setSwappingIndices([]);
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    updateArray([...arr]);
    setComparingIndices([]);
  }

  return arr;
}

export const insertionSortInfo = {
  name: "Insertion Sort",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  description: "Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position."
};
