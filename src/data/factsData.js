export const dailyInsights = [
  [
    { icon: "⚡", title: "Quick vs Merge", text: "QuickSort is usually faster than MergeSort in practice due to better cache locality, despite both averaging O(n log n)." },
    { icon: "🧠", title: "Memory Constraints", text: "In-place algorithms like Heap Sort use O(1) auxiliary space, making them ideal for embedded systems." },
    { icon: "💡", title: "Network Routing", text: "Dijkstra's Algorithm is the foundation for widely-used network routing protocols like OSPF." }
  ],
  [
    { icon: "⚡", title: "Logarithmic Scaling", text: "Binary Search makes O(log n) comparisons - it takes merely 30 steps to search a billion sorted items!" },
    { icon: "🧠", title: "Call Stack Limits", text: "Deep recursion in DFS can cause stack overflows; iterative approaches are often safer for huge graphs." },
    { icon: "💡", title: "Web Search", text: "Graph algorithms like PageRank revolutionized web search by analyzing link structures." }
  ],
  [
    { icon: "⚡", title: "Bubble Sort Best Case", text: "With an optimized flag, Bubble Sort can detect an already sorted array and finish in O(n) time." },
    { icon: "🧠", title: "Merge Sort Trade-off", text: "Standard Merge Sort requires O(n) extra space, making it less memory-efficient for large datasets." },
    { icon: "💡", title: "Video Games", text: "A* Pathfinding is the industry standard in video games for smooth NPC navigation and movement." }
  ],
  [
    { icon: "⚡", title: "Hash Table Efficiency", text: "Hash Table lookups are typically O(1), but can degrade to O(n) in the worst case with excessive collisions." },
    { icon: "🧠", title: "Time-Space Trade-off", text: "Dynamic Programming often trades O(n) memory space for massive exponential-to-polynomial time improvements." },
    { icon: "💡", title: "Database Indexing", text: "B-Trees and their specialized variants form the structural backbone of modern database indexing systems." }
  ],
  [
    { icon: "⚡", title: "Minimum Spanning Tree", text: "Finding the MST of a graph takes O(E log V) using either Kruskal's or Prim's algorithm." },
    { icon: "🧠", title: "Topological Space", text: "Kahn's Algorithm for Topological Sort requires O(V) auxiliary space to track vertex in-degrees." },
    { icon: "💡", title: "Dependency Resolution", text: "Topological Sort is used under the hood by build systems like npm and Make to resolve complex dependencies." }
  ]
];
