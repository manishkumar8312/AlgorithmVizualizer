export async function binarySearch(array, target, setCurrentIndex, setFoundIndex, setSearchRange, speed) {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    setSearchRange([left, right]);
    setCurrentIndex(mid);
    await new Promise(resolve => setTimeout(resolve, speed));

    if (array[mid] === target) {
      setFoundIndex(mid);
      await new Promise(resolve => setTimeout(resolve, speed));
      return mid;
    }

    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  setCurrentIndex(-1);
  setSearchRange([-1, -1]);
  return -1;
}

export const binarySearchInfo = {
  name: "Binary Search",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  description: "Binary Search efficiently finds a target value in a sorted array by repeatedly dividing the search interval in half."
};
