export async function quickSort(array, updateArray, setComparingIndices, setSwappingIndices, speedRef) {
  const arr = [...array];
  
  async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      setComparingIndices([j, high]);
      if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
      
      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) {
          setSwappingIndices([i, j]);
          if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
          
          [arr[i], arr[j]] = [arr[j], arr[i]];
          updateArray([...arr]);
          
          if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
          setSwappingIndices([]);
        }
      }
    }
    
    setSwappingIndices([i + 1, high]);
    if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    updateArray([...arr]);
    
    if (speedRef.current > 0) await new Promise(resolve => setTimeout(resolve, speedRef.current));
    setSwappingIndices([]);
    setComparingIndices([]);
    
    return i + 1;
  }
  
  async function quickSortHelper(arr, low, high) {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  }
  
  await quickSortHelper(arr, 0, arr.length - 1);
  return arr;
}

export const quickSortInfo = {
  name: "Quick Sort",
  timeComplexity: "O(n log n) avg, O(n²) worst",
  spaceComplexity: "O(log n)",
  description: "Quick Sort picks a pivot element and partitions the array around it, recursively sorting the sub-arrays."
};
