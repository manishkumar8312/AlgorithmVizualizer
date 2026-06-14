// src/algorithms/recursion/puzzleEngine.js
// Trace generator for puzzle algorithms.

export const runTowerOfHanoiTrace = (n) => {
  const trace = [];
  const stack = [];
  
  // Initialize pegs: A has all disks, B and C are empty
  const pegs = {
    A: Array.from({ length: n }, (_, i) => n - i),
    B: [],
    C: []
  };

  function clonePegs(p) {
    return {
      A: [...p.A],
      B: [...p.B],
      C: [...p.C]
    };
  }

  function recurse(disk, source, auxiliary, target) {
    stack.push(`hanoi(${disk}, ${source}, ${target}, ${auxiliary})`);
    
    trace.push({
      type: 'CALL',
      pegs: clonePegs(pegs),
      message: `Moving ${disk} disk(s) from ${source} to ${target}`,
      stack: [...stack]
    });

    if (disk === 1) {
      const movedDisk = pegs[source].pop();
      pegs[target].push(movedDisk);
      
      trace.push({
        type: 'MOVE',
        pegs: clonePegs(pegs),
        message: `Moved disk ${movedDisk} from ${source} to ${target}`,
        stack: [...stack]
      });
      
      stack.pop();
      return;
    }

    recurse(disk - 1, source, target, auxiliary);
    
    const movedDisk = pegs[source].pop();
    pegs[target].push(movedDisk);
    
    trace.push({
      type: 'MOVE',
      pegs: clonePegs(pegs),
      message: `Moved disk ${movedDisk} from ${source} to ${target}`,
      stack: [...stack]
    });

    recurse(disk - 1, auxiliary, source, target);
    
    trace.push({
      type: 'RETURN',
      pegs: clonePegs(pegs),
      message: `Finished moving ${disk} disk(s) from ${source} to ${target}`,
      stack: [...stack]
    });
    
    stack.pop();
  }

  trace.push({ type: 'START', pegs: clonePegs(pegs), message: `Starting Tower of Hanoi with ${n} disks`, stack: [] });
  recurse(n, 'A', 'B', 'C');
  trace.push({ type: 'SUCCESS', pegs: clonePegs(pegs), message: 'All disks moved successfully!', stack: [] });
  
  return trace;
};
