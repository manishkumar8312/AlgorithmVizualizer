export const algorithmDatabase = {
  sorting: {
    bubbleSort: {
      name: 'Bubble Sort',
      description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      purpose: 'To sort an array by repeatedly swapping adjacent elements if they are in the wrong order.',
      workingPrinciple: 'The algorithm works by repeatedly swapping adjacent elements if they are in the wrong order. This process continues until no swaps are needed, indicating the array is sorted.',
      bestCase: 'O(n)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)',
      spaceComplexity: 'O(1)',
      applications: [
        'Simple to implement and understand',
        'Useful for small datasets',
        'Educational purposes to teach sorting concepts',
        'Detecting whether a list is already sorted'
      ],
      advantages: [
        'Simple implementation',
        'No additional memory required',
        'Stable sort (maintains relative order of equal elements)',
        'Adaptive (can detect already sorted arrays)'
      ],
      disadvantages: [
        'Inefficient for large datasets',
        'O(n²) time complexity in average and worst cases',
        'Slow compared to other sorting algorithms',
        'Not suitable for real-time applications'
      ],
      pseudocode: [
        'procedure bubbleSort(arr)',
        '  n = length(arr)',
        '  for i = 0 to n-1 do',
        '    for j = 0 to n-i-1 do',
        '      if arr[j] > arr[j+1] then',
        '        swap(arr[j], arr[j+1])',
        '      end if',
        '    end for',
        '  end for',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
        java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
        javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
      }
    },
    selectionSort: {
      name: 'Selection Sort',
      description: 'Selection Sort divides the input into a sorted and unsorted region, and repeatedly selects the smallest element from the unsorted region.',
      purpose: 'To sort an array by finding the minimum element and placing it at the beginning.',
      workingPrinciple: 'The algorithm divides the array into two parts: sorted and unsorted. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning of the unsorted part.',
      bestCase: 'O(n²)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)',
      spaceComplexity: 'O(1)',
      applications: [
        'Small datasets where simplicity is preferred',
        'Memory-constrained environments',
        'When write operations are expensive'
      ],
      advantages: [
        'Simple implementation',
        'No additional memory required',
        'Performs well on small lists',
        'Reduces number of swaps compared to bubble sort'
      ],
      disadvantages: [
        'Inefficient for large datasets',
        'O(n²) time complexity in all cases',
        'Not adaptive',
        'Not stable by default'
      ],
      pseudocode: [
        'procedure selectionSort(arr)',
        '  n = length(arr)',
        '  for i = 0 to n-1 do',
        '    minIdx = i',
        '    for j = i+1 to n do',
        '      if arr[j] < arr[minIdx] then',
        '        minIdx = j',
        '      end if',
        '    end for',
        '    swap(arr[i], arr[minIdx])',
        '  end for',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
        java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
        javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`
      }
    },
    insertionSort: {
      name: 'Insertion Sort',
      description: 'Insertion Sort builds the final sorted array one item at a time by comparing each new element with the already-sorted elements.',
      purpose: 'To sort an array by building a sorted array one element at a time.',
      workingPrinciple: 'The algorithm works by taking one element at a time and inserting it into its correct position in the already sorted portion of the array.',
      bestCase: 'O(n)',
      averageCase: 'O(n²)',
      worstCase: 'O(n²)',
      spaceComplexity: 'O(1)',
      applications: [
        'Small datasets',
        'Nearly sorted arrays',
        'Online sorting (data arriving in real-time)',
        'When memory is limited'
      ],
      advantages: [
        'Simple implementation',
        'Efficient for small and nearly sorted datasets',
        'Stable sort',
        'In-place sorting',
        'Adaptive algorithm'
      ],
      disadvantages: [
        'Inefficient for large datasets',
        'O(n²) time complexity in average and worst cases',
        'Not suitable for large lists'
      ],
      pseudocode: [
        'procedure insertionSort(arr)',
        '  n = length(arr)',
        '  for i = 1 to n do',
        '    key = arr[i]',
        '    j = i - 1',
        '    while j >= 0 and arr[j] > key do',
        '      arr[j + 1] = arr[j]',
        '      j = j - 1',
        '    end while',
        '    arr[j + 1] = key',
        '  end for',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
        javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
      }
    },
    mergeSort: {
      name: 'Merge Sort',
      description: 'Merge Sort divides the array into halves, recursively sorts them, and then merges the sorted halves.',
      purpose: 'To sort an array using divide and conquer strategy.',
      workingPrinciple: 'The algorithm divides the array into two halves, recursively sorts each half, and then merges the two sorted halves back together.',
      bestCase: 'O(n log n)',
      averageCase: 'O(n log n)',
      worstCase: 'O(n log n)',
      spaceComplexity: 'O(n)',
      applications: [
        'Large datasets',
        'External sorting (sorting data that doesn\'t fit in memory)',
        'Parallel processing',
        'When stable sorting is required'
      ],
      advantages: [
        'Consistent O(n log n) time complexity',
        'Stable sort',
        'Suitable for large datasets',
        'Can be parallelized',
        'Works well with external storage'
      ],
      disadvantages: [
        'Requires O(n) additional space',
        'Slower than quicksort for in-memory sorting',
        'Not in-place',
        'More complex implementation'
      ],
      pseudocode: [
        'procedure mergeSort(arr)',
        '  if length(arr) <= 1 then',
        '    return arr',
        '  end if',
        '  mid = length(arr) / 2',
        '  left = mergeSort(arr[0:mid])',
        '  right = mergeSort(arr[mid:])',
        '  return merge(left, right)',
        'end procedure',
        '',
        'procedure merge(left, right)',
        '  result = []',
        '  while left and right are not empty do',
        '    if left[0] <= right[0] then',
        '      append left[0] to result',
        '      remove left[0]',
        '    else',
        '      append right[0] to result',
        '      remove right[0]',
        '    end if',
        '  end while',
        '  append remaining elements to result',
        '  return result',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
        java: `void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
        javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}`
      }
    },
    quickSort: {
      name: 'Quick Sort',
      description: 'Quick Sort selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
      purpose: 'To sort an array using divide and conquer with partitioning.',
      workingPrinciple: 'The algorithm selects a pivot element and partitions the array around it such that elements less than pivot are on the left and greater are on the right. It then recursively sorts the sub-arrays.',
      bestCase: 'O(n log n)',
      averageCase: 'O(n log n)',
      worstCase: 'O(n²)',
      spaceComplexity: 'O(log n)',
      applications: [
        'Large datasets',
        'When average-case performance is important',
        'In-place sorting',
        'Cache-efficient sorting'
      ],
      advantages: [
        'Efficient in practice (fast average case)',
        'In-place sorting (minimal extra space)',
        'Cache-friendly',
        'Widely used in standard libraries'
      ],
      disadvantages: [
        'Worst-case O(n²) time complexity',
        'Not stable by default',
        'Sensitive to pivot selection',
        'Complex implementation'
      ],
      pseudocode: [
        'procedure quickSort(arr, low, high)',
        '  if low < high then',
        '    pivotIdx = partition(arr, low, high)',
        '    quickSort(arr, low, pivotIdx - 1)',
        '    quickSort(arr, pivotIdx + 1, high)',
        '  end if',
        'end procedure',
        '',
        'procedure partition(arr, low, high)',
        '  pivot = arr[high]',
        '  i = low - 1',
        '  for j = low to high - 1 do',
        '    if arr[j] < pivot then',
        '      i = i + 1',
        '      swap(arr[i], arr[j])',
        '    end if',
        '  end for',
        '  swap(arr[i + 1], arr[high])',
        '  return i + 1',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
        javascript: `function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}`
      }
    }
  },
  searching: {
    binarySearch: {
      name: 'Binary Search',
      description: 'Binary Search repeatedly divides the search interval in half to find the target element.',
      purpose: 'To efficiently find an element in a sorted array.',
      workingPrinciple: 'The algorithm compares the target with the middle element. If they match, it returns the index. If target is smaller, it searches the left half; otherwise, it searches the right half.',
      bestCase: 'O(1)',
      averageCase: 'O(log n)',
      worstCase: 'O(log n)',
      spaceComplexity: 'O(1)',
      applications: [
        'Searching in sorted databases',
        'Finding elements in sorted arrays',
        'Game development (binary space partitioning)',
        'Debugging (binary search for bugs)'
      ],
      advantages: [
        'Very efficient for large sorted datasets',
        'O(log n) time complexity',
        'Simple implementation',
        'No extra space required (iterative version)'
      ],
      disadvantages: [
        'Requires sorted array',
        'Not suitable for unsorted data',
        'Inefficient for small datasets',
        'Insertion/deletion is expensive'
      ],
      pseudocode: [
        'procedure binarySearch(arr, target)',
        '  low = 0',
        '  high = length(arr) - 1',
        '  while low <= high do',
        '    mid = floor((low + high) / 2)',
        '    if arr[mid] == target then',
        '      return mid',
        '    else if arr[mid] < target then',
        '      low = mid + 1',
        '    else',
        '      high = mid - 1',
        '    end if',
        '  end while',
        '  return -1',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        java: `int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        javascript: `function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
      }
    },
    linearSearch: {
      name: 'Linear Search',
      description: 'Linear Search sequentially checks each element until the target is found.',
      purpose: 'To find an element by checking each element sequentially.',
      workingPrinciple: 'The algorithm starts from the first element and compares each element with the target until a match is found or all elements are checked.',
      bestCase: 'O(1)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(1)',
      applications: [
        'Small datasets',
        'Unsorted data',
        'When simplicity is preferred',
        'Searching in linked lists'
      ],
      advantages: [
        'Simple implementation',
        'Works on unsorted data',
        'No extra space required',
        'Works on any data structure'
      ],
      disadvantages: [
        'Inefficient for large datasets',
        'O(n) time complexity',
        'Not suitable for frequent searches',
        'Slow compared to binary search for sorted data'
      ],
      pseudocode: [
        'procedure linearSearch(arr, target)',
        '  for i = 0 to length(arr) - 1 do',
        '    if arr[i] == target then',
        '      return i',
        '    end if',
        '  end for',
        '  return -1',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
        java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
        python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
        javascript: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`
      }
    }
  },
  trees: {
    preOrder: {
      name: 'Pre-order Traversal',
      description: 'Pre-order traversal visits the current node first, then recursively visits the left subtree, and finally the right subtree.',
      purpose: 'To explore a tree structure by visiting parent nodes before their children.',
      workingPrinciple: 'The algorithm processes the root node, then traverses the left subtree, and finally traverses the right subtree. It is often used to create a copy of the tree.',
      bestCase: 'O(n)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(h) where h is the height of the tree',
      applications: [
        'Creating a prefix expression from an expression tree',
        'Copying a tree',
        'Serialization of a tree structure'
      ],
      advantages: [
        'Naturally captures the structure of the tree',
        'Simple recursive implementation'
      ],
      disadvantages: [
        'Not suitable for finding shortest paths',
        'Can cause stack overflow on very deep trees'
      ],
      pseudocode: [
        'procedure preOrder(node)',
        '  if node == null then',
        '    return',
        '  end if',
        '  visit(node)',
        '  preOrder(node.left)',
        '  preOrder(node.right)',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void preOrder(Node* root) {\n    if (root == NULL) return;\n    cout << root->data << " ";\n    preOrder(root->left);\n    preOrder(root->right);\n}`,
        java: `void preOrder(Node node) {\n    if (node == null) return;\n    System.out.print(node.data + " ");\n    preOrder(node.left);\n    preOrder(node.right);\n}`,
        python: `def pre_order(root):\n    if root:\n        print(root.val)\n        pre_order(root.left)\n        pre_order(root.right)`,
        javascript: `function preOrder(node) {\n    if (node === null) return;\n    console.log(node.val);\n    preOrder(node.left);\n    preOrder(node.right);\n}`
      }
    },
    inOrder: {
      name: 'In-order Traversal',
      description: 'In-order traversal visits the left subtree first, then the current node, and finally the right subtree.',
      purpose: 'To retrieve elements of a Binary Search Tree (BST) in sorted order.',
      workingPrinciple: 'The algorithm traverses the left subtree, processes the root node, and then traverses the right subtree.',
      bestCase: 'O(n)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(h) where h is the height of the tree',
      applications: [
        'Retrieving keys from a BST in sorted order',
        'Flattening a binary tree',
        'Expression evaluation'
      ],
      advantages: [
        'Produces sorted output for BSTs',
        'Simple and elegant logic'
      ],
      disadvantages: [
        'Can be slower than iterative approaches due to function call overhead',
        'Stack overflow risk for unbalanced deep trees'
      ],
      pseudocode: [
        'procedure inOrder(node)',
        '  if node == null then',
        '    return',
        '  end if',
        '  inOrder(node.left)',
        '  visit(node)',
        '  inOrder(node.right)',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void inOrder(Node* root) {\n    if (root == NULL) return;\n    inOrder(root->left);\n    cout << root->data << " ";\n    inOrder(root->right);\n}`,
        java: `void inOrder(Node node) {\n    if (node == null) return;\n    inOrder(node.left);\n    System.out.print(node.data + " ");\n    inOrder(node.right);\n}`,
        python: `def in_order(root):\n    if root:\n        in_order(root.left)\n        print(root.val)\n        in_order(root.right)`,
        javascript: `function inOrder(node) {\n    if (node === null) return;\n    inOrder(node.left);\n    console.log(node.val);\n    inOrder(node.right);\n}`
      }
    },
    postOrder: {
      name: 'Post-order Traversal',
      description: 'Post-order traversal recursively visits the left subtree, then the right subtree, and finally processes the current node.',
      purpose: 'To process children before their parents.',
      workingPrinciple: 'The algorithm visits the left subtree, then the right subtree, and processes the root node last.',
      bestCase: 'O(n)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(h) where h is the height of the tree',
      applications: [
        'Deleting a tree from leaf to root',
        'Generating postfix representations of expression trees',
        'Evaluating mathematical expressions'
      ],
      advantages: [
        'Safely process or delete nodes since children are handled first',
        'Works well for dependency resolution in trees'
      ],
      disadvantages: [
        'Iterative implementation is complex compared to pre/in-order'
      ],
      pseudocode: [
        'procedure postOrder(node)',
        '  if node == null then',
        '    return',
        '  end if',
        '  postOrder(node.left)',
        '  postOrder(node.right)',
        '  visit(node)',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void postOrder(Node* root) {\n    if (root == NULL) return;\n    postOrder(root->left);\n    postOrder(root->right);\n    cout << root->data << " ";\n}`,
        java: `void postOrder(Node node) {\n    if (node == null) return;\n    postOrder(node.left);\n    postOrder(node.right);\n    System.out.print(node.data + " ");\n}`,
        python: `def post_order(root):\n    if root:\n        post_order(root.left)\n        post_order(root.right)\n        print(root.val)`,
        javascript: `function postOrder(node) {\n    if (node === null) return;\n    postOrder(node.left);\n    postOrder(node.right);\n    console.log(node.val);\n}`
      }
    },
    levelOrder: {
      name: 'Level-order Traversal',
      description: 'Level-order traversal (BFS) visits nodes level by level from top to bottom and left to right.',
      purpose: 'To explore the tree breadth-first, level by level.',
      workingPrinciple: 'The algorithm uses a queue to keep track of nodes to visit. It dequeues a node, visits it, and enqueues its children.',
      bestCase: 'O(n)',
      averageCase: 'O(n)',
      worstCase: 'O(n)',
      spaceComplexity: 'O(w) where w is the maximum width of the tree',
      applications: [
        'Finding the shortest path on unweighted graphs/trees',
        'Serialization/Deserialization of trees',
        'Printing tree level by level'
      ],
      advantages: [
        'Finds the closest nodes first',
        'Does not suffer from deep recursion stack overflow'
      ],
      disadvantages: [
        'Requires more memory (queue) proportional to the tree width',
        'Not ideal if the target is deep in a very wide tree'
      ],
      pseudocode: [
        'procedure levelOrder(root)',
        '  if root == null return',
        '  queue = empty queue',
        '  queue.enqueue(root)',
        '  while queue is not empty do',
        '    node = queue.dequeue()',
        '    visit(node)',
        '    if node.left != null then',
        '      queue.enqueue(node.left)',
        '    if node.right != null then',
        '      queue.enqueue(node.right)',
        '  end while',
        'end procedure'
      ],
      codeSnippets: {
        cpp: `void levelOrder(Node* root) {\n    if (root == NULL) return;\n    queue<Node*> q;\n    q.push(root);\n    while (!q.empty()) {\n        Node* node = q.front();\n        q.pop();\n        cout << node->data << " ";\n        if (node->left != NULL) q.push(node->left);\n        if (node->right != NULL) q.push(node->right);\n    }\n}`,
        java: `void levelOrder(Node root) {\n    if (root == null) return;\n    Queue<Node> q = new LinkedList<>();\n    q.add(root);\n    while (!q.isEmpty()) {\n        Node node = q.poll();\n        System.out.print(node.data + " ");\n        if (node.left != null) q.add(node.left);\n        if (node.right != null) q.add(node.right);\n    }\n}`,
        python: `def level_order(root):\n    if not root: return\n    queue = [root]\n    while queue:\n        node = queue.pop(0)\n        print(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)`,
        javascript: `function levelOrder(root) {\n    if (!root) return;\n    const queue = [root];\n    while (queue.length > 0) {\n        const node = queue.shift();\n        console.log(node.val);\n        if (node.left) queue.push(node.left);\n        if (node.right) queue.push(node.right);\n    }\n}`
      }
    }
  },
  pathfinding: {
    astar: {
      name: "A* Search Algorithm",
      description: "A* Search is an informed search algorithm that uses heuristic functions to find the shortest path between start and goal nodes efficiently.",
      purpose: "To find the shortest path faster than Dijkstra by guiding the search towards the target using heuristics.",
      workingPrinciple: "A* calculates f(n) = g(n) + h(n) for each node, where g(n) is the cost from start and h(n) is the estimated cost to target (Manhattan distance). It expands nodes with the smallest f(n) first.",
      bestCase: "O(1)",
      averageCase: "O(E)",
      worstCase: "O(b^d)",
      spaceComplexity: "O(V)",
      applications: [
        "Video game pathing (NPC navigation)",
        "GPS navigation & mapping services",
        "Robotic motion planning"
      ],
      advantages: [
        "Optimal and complete (finds shortest path if admissible heuristic is used)",
        "Dramatically faster than Dijkstra on spatial grids"
      ],
      disadvantages: [
        "Memory intensive as it keeps all generated nodes in memory"
      ],
      pseudocode: [
        "openSet = {startNode}",
        "while openSet is not empty:",
        "  current = node in openSet with lowest fScore",
        "  if current == goal: return reconstruct_path(current)",
        "  openSet.remove(current)",
        "  for neighbor of current:",
        "    tentative_g = gScore[current] + weight(current, neighbor)",
        "    if tentative_g < gScore[neighbor]:",
        "      cameFrom[neighbor] = current",
        "      gScore[neighbor] = tentative_g",
        "      fScore[neighbor] = gScore[neighbor] + h(neighbor, goal)",
        "      if neighbor not in openSet: openSet.add(neighbor)"
      ],
      codeSnippets: {
        cpp: `struct Node { int r, c, g, h; int f() const { return g + h; } };
int astar(Node start, Node goal) {
    priority_queue<Node> openSet;
    openSet.push(start);
    while(!openSet.empty()) {
        Node curr = openSet.top(); openSet.pop();
        if(curr.r == goal.r && curr.c == goal.c) return curr.g;
        // Expand 4-directional neighbors...
    }
    return -1;
}`,
        java: `public int astar(Node start, Node goal) {
    PriorityQueue<Node> openSet = new PriorityQueue<>((a, b) -> a.f() - b.f());
    openSet.add(start);
    while (!openSet.isEmpty()) {
        Node curr = openSet.poll();
        if (curr.r == goal.r && curr.c == goal.c) return curr.g;
        // Expand neighbors...
    }
    return -1;
}`,
        python: `import heapq
def astar(start, goal):
    open_set = []
    heapq.heappush(open_set, (0 + h(start, goal), 0, start))
    while open_set:
        f, g, curr = heapq.heappop(open_set)
        if curr == goal: return g
        # Expand neighbors...
    return -1`,
        javascript: `function astar(start, goal) {
    const openSet = [start];
    while (openSet.length) {
        openSet.sort((a, b) => a.f - b.f);
        const curr = openSet.shift();
        if (curr === goal) return curr.g;
        // Expand neighbors...
    }
    return -1;
}`
      }
    }
  }
};
