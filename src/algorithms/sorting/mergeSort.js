export async function mergeSort(array, updateArray, setComparingIndices, setSwappingIndices, speedRef) {
  const arr = [...array];
  
  async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      setComparingIndices([left + i, mid + 1 + j]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      setSwappingIndices([k]);
      updateArray([...arr]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
      setSwappingIndices([]);
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      setSwappingIndices([k]);
      updateArray([...arr]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
      setSwappingIndices([]);
      i++;
      k++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      setSwappingIndices([k]);
      updateArray([...arr]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
      setSwappingIndices([]);
      j++;
      k++;
    }
    
    setComparingIndices([]);
  }
  
  async function mergeSortHelper(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  }
  
  await mergeSortHelper(arr, 0, arr.length - 1);
  return arr;
}

export const mergeSortInfo = {
  name: "Merge Sort",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description: "Merge Sort is a divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together."
};
