// Tower of Hanoi Solution
export async function towerOfHanoi(n, source, destination, auxiliary, updateState, speed) {
  const moves = [];

  async function moveDisks(n, from, to, aux) {
    if (n === 1) {
      // Move single disk
      const move = { disk: n, from, to };
      moves.push(move);
      
      updateState({ 
        move, 
        totalMoves: moves.length,
        message: `Move disk ${n} from ${from} to ${to}`
      });
      await new Promise(resolve => setTimeout(resolve, speed));
      return;
    }

    // Move n-1 disks from source to auxiliary using destination
    await moveDisks(n - 1, from, aux, to);

    // Move the largest disk from source to destination
    const move = { disk: n, from, to };
    moves.push(move);
    
    updateState({ 
      move, 
      totalMoves: moves.length,
      message: `Move disk ${n} from ${from} to ${to}`
    });
    await new Promise(resolve => setTimeout(resolve, speed));

    // Move n-1 disks from auxiliary to destination using source
    await moveDisks(n - 1, aux, to, from);
  }

  await moveDisks(n, source, destination, auxiliary);
  return moves;
}

// Calculate minimum number of moves
export function calculateMinMoves(n) {
  return Math.pow(2, n) - 1;
}

export const towerOfHanoiInfo = {
  name: "Tower of Hanoi",
  timeComplexity: "O(2ⁿ)",
  spaceComplexity: "O(n)",
  description: "The Tower of Hanoi is a classic recursive puzzle where you must move n disks from source peg to destination peg using an auxiliary peg, following the rule that a larger disk cannot be placed on a smaller disk."
};
