// Step tracking utility for step-by-step execution

export class StepTracker {
  constructor() {
    this.steps = [];
    this.currentStepIndex = 0;
    this.metrics = {
      comparisons: 0,
      swaps: 0,
      operations: 0
    };
  }

  addStep(step) {
    this.steps.push({
      ...step,
      stepNumber: this.steps.length + 1
    });
  }

  getCurrentStep() {
    return this.steps[this.currentStepIndex] || null;
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      return this.getCurrentStep();
    }
    return null;
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      return this.getCurrentStep();
    }
    return null;
  }

  reset() {
    this.currentStepIndex = 0;
    this.metrics = {
      comparisons: 0,
      swaps: 0,
      operations: 0
    };
  }

  getTotalSteps() {
    return this.steps.length;
  }

  getProgress() {
    return {
      current: this.currentStepIndex + 1,
      total: this.steps.length,
      percentage: this.steps.length > 0 
        ? ((this.currentStepIndex + 1) / this.steps.length) * 100 
        : 0
    };
  }

  incrementComparison() {
    this.metrics.comparisons++;
    this.metrics.operations++;
  }

  incrementSwap() {
    this.metrics.swaps++;
    this.metrics.operations++;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Create a step-by-step version of bubble sort
export async function bubbleSortStepByStep(array, updateArray, setComparingIndices, setSwappingIndices, speed, stepTracker) {
  const arr = [...array];
  const n = arr.length;
  stepTracker.reset();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Step: Comparing elements
      stepTracker.addStep({
        operation: 'compare',
        indices: [j, j + 1],
        values: [arr[j], arr[j + 1]],
        explanation: `Comparing element at index ${j} (${arr[j]}) with element at index ${j + 1} (${arr[j + 1]}).`,
        pseudocodeLine: 4,
        arrayState: [...arr]
      });
      stepTracker.incrementComparison();

      setComparingIndices([j, j + 1]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (arr[j] > arr[j + 1]) {
        // Step: Swapping elements
        stepTracker.addStep({
          operation: 'swap',
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          explanation: `Since ${arr[j]} > ${arr[j + 1]}, swapping elements at indices ${j} and ${j + 1}.`,
          pseudocodeLine: 5,
          arrayState: [...arr]
        });
        stepTracker.incrementSwap();

        setSwappingIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        updateArray([...arr]);

        await new Promise(resolve => setTimeout(resolve, speed));
        setSwappingIndices([]);
      } else {
        // Step: No swap needed
        stepTracker.addStep({
          operation: 'no_swap',
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          explanation: `Since ${arr[j]} <= ${arr[j + 1]}, no swap is performed.`,
          pseudocodeLine: 5,
          arrayState: [...arr]
        });
      }

      setComparingIndices([]);
    }
  }

  // Final step: Array sorted
  stepTracker.addStep({
    operation: 'complete',
    indices: [],
    values: [],
    explanation: 'Array is now sorted!',
    pseudocodeLine: 8,
    arrayState: [...arr]
  });

  return arr;
}

// Create a step-by-step version of binary search
export async function binarySearchStepByStep(array, target, setCurrentIndex, setFoundIndex, setSearchRange, speed, stepTracker) {
  stepTracker.reset();
  let low = 0;
  let high = array.length - 1;

  stepTracker.addStep({
    operation: 'start',
    indices: [],
    values: [],
    explanation: `Starting binary search for target ${target} in sorted array.`,
    pseudocodeLine: 2,
    arrayState: [...array]
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    stepTracker.addStep({
      operation: 'calculate_mid',
      indices: [mid],
      values: [array[mid]],
      explanation: `Middle index calculated: ${mid}. Middle element: ${array[mid]}.`,
      pseudocodeLine: 4,
      arrayState: [...array]
    });

    setCurrentIndex(mid);
    setSearchRange([low, high]);
    await new Promise(resolve => setTimeout(resolve, speed));

    if (array[mid] === target) {
      stepTracker.addStep({
        operation: 'found',
        indices: [mid],
        values: [array[mid]],
        explanation: `Target ${target} found at index ${mid}!`,
        pseudocodeLine: 5,
        arrayState: [...array]
      });
      stepTracker.incrementComparison();

      setFoundIndex(mid);
      return mid;
    } else if (array[mid] < target) {
      stepTracker.addStep({
        operation: 'search_right',
        indices: [mid],
        values: [array[mid]],
        explanation: `${array[mid]} < ${target}, so target must be in the right half. Searching from index ${mid + 1} to ${high}.`,
        pseudocodeLine: 7,
        arrayState: [...array]
      });
      stepTracker.incrementComparison();

      low = mid + 1;
    } else {
      stepTracker.addStep({
        operation: 'search_left',
        indices: [mid],
        values: [array[mid]],
        explanation: `${array[mid]} > ${target}, so target must be in the left half. Searching from index ${low} to ${mid - 1}.`,
        pseudocodeLine: 9,
        arrayState: [...array]
      });
      stepTracker.incrementComparison();

      high = mid - 1;
    }

    await new Promise(resolve => setTimeout(resolve, speed));
  }

  stepTracker.addStep({
    operation: 'not_found',
    indices: [],
    values: [],
    explanation: `Target ${target} not found in the array.`,
    pseudocodeLine: 11,
    arrayState: [...array]
  });

  return -1;
}
