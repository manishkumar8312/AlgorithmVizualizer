export async function insertionSort(array, updateArray, setComparingIndices, setSwappingIndices, speedRef) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      setComparingIndices([j, j + 1]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));

      if (arr[j] > key) {
        setSwappingIndices([j, j + 1]);
        if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));

        arr[j + 1] = arr[j];
        updateArray([...arr]);

        if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
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
