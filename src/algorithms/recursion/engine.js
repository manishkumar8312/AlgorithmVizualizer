// src/algorithms/recursion/engine.js
// Trace generator for Tree-based recursion algorithms.

let _idCounter = 0;
const getId = () => `node-${_idCounter++}`;

export const runFactorialTrace = (n) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];

  function recurse(val, depth, parentId) {
    const id = getId();
    const callArgs = `fact(${val})`;
    stack.push(callArgs);
    
    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Calling ${callArgs}`
    });

    if (val <= 1) {
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: '1',
        depth,
        stack: [...stack],
        message: `Base case reached: fact(${val}) = 1`
      });
      stack.pop();
      return 1;
    }

    const childRes = recurse(val - 1, depth + 1, id);
    const res = val * childRes;

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: String(res),
      depth,
      stack: [...stack],
      message: `Returning ${val} * ${childRes} = ${res}`
    });

    stack.pop();
    return res;
  }

  recurse(n, 0, null);
  return trace;
};

export const runFibonacciTrace = (n) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];

  function recurse(val, depth, parentId) {
    const id = getId();
    const callArgs = `fib(${val})`;
    stack.push(callArgs);

    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Calling ${callArgs}`
    });

    if (val <= 1) {
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: String(val),
        depth,
        stack: [...stack],
        message: `Base case reached: fib(${val}) = ${val}`
      });
      stack.pop();
      return val;
    }

    const left = recurse(val - 1, depth + 1, id);
    const right = recurse(val - 2, depth + 1, id);
    const res = left + right;

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: String(res),
      depth,
      stack: [...stack],
      message: `Returning ${left} + ${right} = ${res}`
    });

    stack.pop();
    return res;
  }

  recurse(n, 0, null);
  return trace;
};

export const runPermutationsTrace = (arr) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];
  const results = [];

  function recurse(current, depth, parentId) {
    const id = getId();
    const callArgs = `perm([${current.join(',')}])`;
    stack.push(callArgs);

    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Current permutation: [${current.join(', ')}]`
    });

    if (current.length === arr.length) {
      results.push([...current]);
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: `[${current.join(',')}]`,
        depth,
        stack: [...stack],
        message: `Found valid permutation!`
      });
      stack.pop();
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (!current.includes(arr[i])) {
        current.push(arr[i]);
        recurse(current, depth + 1, id);
        current.pop(); // backtrack
        
        trace.push({
          type: 'BACKTRACK',
          nodeId: id,
          parentId,
          callArgs,
          depth,
          stack: [...stack],
          message: `Backtracking: removed ${arr[i]}`
        });
      }
    }

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: null,
      depth,
      stack: [...stack],
      message: `All branches explored for [${current.join(',')}]`
    });
    stack.pop();
  }

  recurse([], 0, null);
  return { trace, results };
};

export const runCombinationSumTrace = (arr, target) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];
  const results = [];

  function recurse(current, currentSum, startIdx, depth, parentId) {
    const id = getId();
    const callArgs = `comb([${current.join(',')}], sum=${currentSum})`;
    stack.push(callArgs);

    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Current: [${current.join(', ')}], Sum: ${currentSum}`
    });

    if (currentSum === target) {
      results.push([...current]);
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: `[${current.join(',')}]`,
        depth,
        stack: [...stack],
        message: `Target ${target} reached!`
      });
      stack.pop();
      return;
    }

    if (currentSum > target) {
       trace.push({
        type: 'RETURN', // early return
        nodeId: id,
        parentId,
        callArgs,
        returnValue: 'null',
        depth,
        stack: [...stack],
        message: `Sum exceeded target (${currentSum} > ${target}). Returning.`
      });
      stack.pop();
      return;
    }

    for (let i = startIdx; i < arr.length; i++) {
      current.push(arr[i]);
      recurse(current, currentSum + arr[i], i, depth + 1, id);
      current.pop(); // backtrack

      trace.push({
        type: 'BACKTRACK',
        nodeId: id,
        parentId,
        callArgs,
        depth,
        stack: [...stack],
        message: `Backtracking: removed ${arr[i]}`
      });
    }

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: null,
      depth,
      stack: [...stack],
      message: `Explored all options from [${current.join(',')}]`
    });
    stack.pop();
  }

  recurse([], 0, 0, 0, null);
  return { trace, results };
};

export const runGenerateParenthesesTrace = (n) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];
  const results = [];

  function recurse(currentStr, openCount, closeCount, depth, parentId) {
    const id = getId();
    const callArgs = `gen("${currentStr}", o=${openCount}, c=${closeCount})`;
    stack.push(callArgs);

    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Str: "${currentStr}", Open: ${openCount}, Close: ${closeCount}`
    });

    if (currentStr.length === n * 2) {
      results.push(currentStr);
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: `"${currentStr}"`,
        depth,
        stack: [...stack],
        message: `Valid sequence generated!`
      });
      stack.pop();
      return;
    }

    if (openCount < n) {
      recurse(currentStr + '(', openCount + 1, closeCount, depth + 1, id);
      trace.push({
        type: 'BACKTRACK',
        nodeId: id,
        parentId,
        callArgs,
        depth,
        stack: [...stack],
        message: `Backtracked from '(' branch`
      });
    }

    if (closeCount < openCount) {
      recurse(currentStr + ')', openCount, closeCount + 1, depth + 1, id);
      trace.push({
        type: 'BACKTRACK',
        nodeId: id,
        parentId,
        callArgs,
        depth,
        stack: [...stack],
        message: `Backtracked from ')' branch`
      });
    }

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: null,
      depth,
      stack: [...stack],
      message: `Finished branches for "${currentStr}"`
    });
    stack.pop();
  }

  recurse("", 0, 0, 0, null);
  return { trace, results };
};

export const runSubsetsTrace = (arr) => {
  _idCounter = 0;
  const trace = [];
  const stack = [];
  const results = [];

  function recurse(current, index, depth, parentId) {
    const id = getId();
    const callArgs = `sub([${current.join(',')}], idx=${index})`;
    stack.push(callArgs);

    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Subset so far: [${current.join(',')}], considering idx ${index}`
    });

    if (index === arr.length) {
      results.push([...current]);
      trace.push({
        type: 'SUCCESS',
        nodeId: id,
        parentId,
        callArgs,
        returnValue: `[${current.join(',')}]`,
        depth,
        stack: [...stack],
        message: `Reached end of array. Saving subset.`
      });
      stack.pop();
      return;
    }

    // Branch 1: Include
    current.push(arr[index]);
    trace.push({
      type: 'CALL', // pseudo-call to show decision
      nodeId: id, // stay on same node logically before recurse
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Decision: Include ${arr[index]}`
    });
    recurse(current, index + 1, depth + 1, id);
    current.pop(); // backtrack
    
    trace.push({
      type: 'BACKTRACK',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Backtracking: removed ${arr[index]}`
    });

    // Branch 2: Exclude
    trace.push({
      type: 'CALL',
      nodeId: id,
      parentId,
      callArgs,
      depth,
      stack: [...stack],
      message: `Decision: Exclude ${arr[index]}`
    });
    recurse(current, index + 1, depth + 1, id);

    trace.push({
      type: 'RETURN',
      nodeId: id,
      parentId,
      callArgs,
      returnValue: null,
      depth,
      stack: [...stack],
      message: `Done exploring both include/exclude for idx ${index}`
    });
    stack.pop();
  }

  recurse([], 0, 0, null);
  return { trace, results };
};
