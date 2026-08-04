import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle, BookOpen, Code2 } from 'lucide-react';
import ExplanationPanel from './educational/ExplanationPanel';
import CodeViewer from './educational/CodeViewer';

const DP_INFO = {
  knapsack: {
    name: '0/1 Knapsack Problem',
    description: 'Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.',
    timeComplexity: 'O(N × W)',
    spaceComplexity: 'O(N × W)',
    purpose: 'To maximize total value without exceeding weight capacity.',
    workingPrinciple: 'Build a 2D table DP[i][w] representing the max value achievable using a subset of the first i items with a maximum capacity w.',
    bestCase: 'O(N × W)',
    averageCase: 'O(N × W)',
    worstCase: 'O(N × W)',
    applications: ['Resource allocation', 'Financial portfolio selection', 'Cargo loading'],
    advantages: ['Guarantees global optimal solution', 'Prevents redundant exponential subproblems'],
    disadvantages: ['Pseudo-polynomial time complexity dependent on capacity W'],
    pseudocode: [
      'for i from 0 to N:',
      '  for w from 0 to Capacity:',
      '    if i == 0 or w == 0: DP[i][w] = 0',
      '    else if weight[i-1] <= w:',
      '      DP[i][w] = max(val[i-1] + DP[i-1][w-weight[i-1]], DP[i-1][w])',
      '    else: DP[i][w] = DP[i-1][w]'
    ],
    codeSnippets: {
      cpp: `int knapsack(int W, int wt[], int val[], int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
      java: `public int knapsack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
      python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
      javascript: `function knapsack(W, wt, val, n) {
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`
    }
  },
  lcs: {
    name: 'Longest Common Subsequence (LCS)',
    description: 'Finds the longest subsequence present in two sequences in the same order.',
    timeComplexity: 'O(M × N)',
    spaceComplexity: 'O(M × N)',
    purpose: 'To find similarities between two strings or sequences.',
    workingPrinciple: 'Compare characters from both strings. If they match, add 1 to the diagonal DP value; otherwise, take the maximum from top or left cell.',
    bestCase: 'O(M × N)',
    averageCase: 'O(M × N)',
    worstCase: 'O(M × N)',
    applications: ['Git diff tools', 'Bioinformatics DNA alignment', 'File comparison'],
    advantages: ['Computes optimal sequence alignment in polynomial time'],
    disadvantages: ['Quadratic space complexity if full 2D table is maintained'],
    pseudocode: [
      'for i from 0 to M:',
      '  for j from 0 to N:',
      '    if i == 0 or j == 0: DP[i][j] = 0',
      '    else if S1[i-1] == S2[j-1]: DP[i][j] = 1 + DP[i-1][j-1]',
      '    else: DP[i][j] = max(DP[i-1][j], DP[i][j-1])'
    ],
    codeSnippets: {
      cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
      java: `public int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
      python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
      javascript: `function lcs(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`
    }
  }
};

const DPVisualizer = ({ algorithmType = 'knapsack' }) => {
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);

  // Knapsack state
  const items = [
    { name: 'Item 1', w: 2, v: 3 },
    { name: 'Item 2', w: 3, v: 4 },
    { name: 'Item 3', w: 4, v: 5 },
    { name: 'Item 4', w: 5, v: 8 }
  ];
  const capacity = 7;

  // LCS state
  const s1 = "AGGTAB";
  const s2 = "GXTXAYB";

  useEffect(() => {
    generateDPSteps();
  }, [algorithmType]);

  const generateDPSteps = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const generatedSteps = [];

    if (algorithmType === 'knapsack') {
      const rows = items.length + 1;
      const cols = capacity + 1;
      const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let i = 0; i < rows; i++) {
        for (let w = 0; w < cols; w++) {
          if (i === 0 || w === 0) {
            grid[i][w] = 0;
          } else {
            const item = items[i - 1];
            if (item.w <= w) {
              grid[i][w] = Math.max(item.v + grid[i - 1][w - item.w], grid[i - 1][w]);
            } else {
              grid[i][w] = grid[i - 1][w];
            }
          }
          generatedSteps.push({
            cell: [i, w],
            val: grid[i][w],
            gridState: JSON.parse(JSON.stringify(grid))
          });
        }
      }
    } else {
      // LCS
      const rows = s1.length + 1;
      const cols = s2.length + 1;
      const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (i === 0 || j === 0) {
            grid[i][j] = 0;
          } else if (s1[i - 1] === s2[j - 1]) {
            grid[i][j] = 1 + grid[i - 1][j - 1];
          } else {
            grid[i][j] = Math.max(grid[i - 1][j], grid[i][j - 1]);
          }
          generatedSteps.push({
            cell: [i, j],
            val: grid[i][j],
            gridState: JSON.parse(JSON.stringify(grid))
          });
        }
      }
    }
    setSteps(generatedSteps);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 250);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const currentStepData = steps[currentStep] || { cell: [-1, -1], gridState: [] };
  const info = DP_INFO[algorithmType] || DP_INFO.knapsack;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {info.name}
        </h2>
        <div className="flex flex-wrap gap-3 text-xs mb-3">
          <div className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-medium border border-purple-100">
            <span className="font-bold opacity-75 mr-1">Time:</span> {info.timeComplexity}
          </div>
          <div className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-medium border border-purple-100">
            <span className="font-bold opacity-75 mr-1">Space:</span> {info.spaceComplexity}
          </div>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
          {info.description}
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-purple-600/20"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          {isPlaying ? 'Pause' : 'Visualize DP'}
        </button>

        <button
          onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          Reset
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showExplanation ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4 opacity-80" />
          Info
        </button>

        <button
          onClick={() => setShowCodeViewer(!showCodeViewer)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showCodeViewer ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Code2 className="w-4 h-4 opacity-80" />
          Code
        </button>

        <div className="ml-auto text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
          Step: <span className="text-purple-600 dark:text-purple-400 font-bold">{currentStep + 1}</span> / {steps.length}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center overflow-auto">
        <div className="overflow-x-auto max-w-full">
          <table className="border-collapse text-center font-mono text-sm shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <th className="p-3 border border-slate-200 dark:border-slate-700">i \ j</th>
                {algorithmType === 'knapsack'
                  ? Array.from({ length: capacity + 1 }, (_, w) => <th key={w} className="p-3 border border-slate-200 dark:border-slate-700">W={w}</th>)
                  : Array.from({ length: s2.length + 1 }, (_, j) => <th key={j} className="p-3 border border-slate-200 dark:border-slate-700">{j === 0 ? 'Ø' : s2[j - 1]}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {currentStepData.gridState?.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {algorithmType === 'knapsack'
                      ? (i === 0 ? '0 (None)' : `Item ${i} (w:${items[i-1].w}, v:${items[i-1].v})`)
                      : (i === 0 ? '0 (Ø)' : s1[i - 1])}
                  </td>
                  {row.map((val, j) => {
                    const isActive = currentStepData.cell[0] === i && currentStepData.cell[1] === j;
                    return (
                      <td
                        key={j}
                        className={`p-3 w-12 h-12 border border-slate-200 dark:border-slate-700 transition-all ${
                          isActive
                            ? 'bg-purple-600 text-white font-extrabold scale-110 shadow-lg'
                            : val > 0
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-semibold'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Modals */}
      <ExplanationPanel
        algorithmInfo={info}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />

      {showCodeViewer && (
        <div className="fixed bottom-0 right-0 h-3/4 w-[500px] bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-700 z-50 shadow-2xl rounded-tl-2xl overflow-hidden">
          <CodeViewer
            codeSnippets={info.codeSnippets}
            isOpen={showCodeViewer}
            onClose={() => setShowCodeViewer(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DPVisualizer;
