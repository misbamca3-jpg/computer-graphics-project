import { BresenhamStepState, PixelCoord } from '../types';

export function generateBresenhamSteps(x1: number, y1: number, x2: number, y2: number): BresenhamStepState[] {
  const steps: BresenhamStepState[] = [];

  const rawDx = x2 - x1;
  const rawDy = y2 - y1;
  const absDx = Math.abs(rawDx);
  const absDy = Math.abs(rawDy);
  const stepX = rawDx >= 0 ? 1 : -1;
  const stepY = rawDy >= 0 ? 1 : -1;

  const isSteep = absDy > absDx;
  const numSteps = isSteep ? absDy : absDx;

  if (numSteps === 0) {
    const px: PixelCoord = { x: x1, y: y1 };
    return [{
      step: 0,
      totalSteps: 0,
      x: x1,
      y: y1,
      pk: 0,
      dx: 0,
      dy: 0,
      twoDy: 0,
      twoDyMinusTwoDx: 0,
      decisionCondition: 'Single Point',
      chosenCandidate: 'Straight',
      candidate1: px,
      candidate2: px,
      explanation: `Start and end points coincide at (${x1}, ${y1}).`,
      historyPixels: [px]
    }];
  }

  let curX = x1;
  let curY = y1;
  const history: PixelCoord[] = [{ x: curX, y: curY }];

  if (!isSteep) {
    // Shallow line: |m| <= 1, driving axis is X
    const twoDy = 2 * absDy;
    const twoDyMinusTwoDx = 2 * absDy - 2 * absDx;
    let pk = 2 * absDy - absDx;

    // Step 0: Initial point
    steps.push({
      step: 0,
      totalSteps: numSteps,
      x: curX,
      y: curY,
      pk,
      dx: absDx,
      dy: absDy,
      twoDy,
      twoDyMinusTwoDx,
      decisionCondition: `Initial parameter p₀ = 2Δy - Δx = 2(${absDy}) - ${absDx} = ${pk}`,
      chosenCandidate: 'Straight',
      candidate1: { x: curX + stepX, y: curY, isCandidate: true, label: 'E' },
      candidate2: { x: curX + stepX, y: curY + stepY, isCandidate: true, label: 'NE' },
      explanation: `Plotting initial pixel (${curX}, ${curY}). Slope is shallow (|m| ≤ 1). Initial decision parameter p₀ = 2Δy - Δx = ${pk}.`,
      historyPixels: [...history]
    });

    for (let i = 1; i <= numSteps; i++) {
      const candEast: PixelCoord = { x: curX + stepX, y: curY, isCandidate: true, label: stepY >= 0 ? 'East (E)' : 'East-South (ES)' };
      const candNorthEast: PixelCoord = { x: curX + stepX, y: curY + stepY, isCandidate: true, label: stepY >= 0 ? 'North-East (NE)' : 'South-East (SE)' };

      let nextX = curX + stepX;
      let nextY = curY;
      let chosenName: 'East' | 'North-East' = 'East';
      let nextPk = pk;
      let condStr = '';
      let expl = '';

      if (pk < 0) {
        nextY = curY; // East
        nextPk = pk + twoDy;
        chosenName = 'East';
        condStr = `p_${i - 1} = ${pk} < 0 ➔ Select ${candEast.label} (${nextX}, ${nextY})`;
        expl = `Because decision parameter p = ${pk} is negative (< 0), the ideal line is closer to the horizontal neighbor (${nextX}, ${nextY}). Next p = p + 2Δy = ${pk} + ${twoDy} = ${nextPk}.`;
      } else {
        nextY = curY + stepY; // North-East
        nextPk = pk + twoDyMinusTwoDx;
        chosenName = 'North-East';
        condStr = `p_${i - 1} = ${pk} ≥ 0 ➔ Select ${candNorthEast.label} (${nextX}, ${nextY})`;
        expl = `Because decision parameter p = ${pk} is non-negative (≥ 0), the ideal line is closer to diagonal neighbor (${nextX}, ${nextY}). Next p = p + 2Δy - 2Δx = ${pk} + (${twoDyMinusTwoDx}) = ${nextPk}.`;
      }

      curX = nextX;
      curY = nextY;
      history.push({ x: curX, y: curY });

      steps.push({
        step: i,
        totalSteps: numSteps,
        x: curX,
        y: curY,
        pk,
        pkNext: nextPk,
        dx: absDx,
        dy: absDy,
        twoDy,
        twoDyMinusTwoDx,
        decisionCondition: condStr,
        chosenCandidate: chosenName,
        candidate1: candEast,
        candidate2: candNorthEast,
        explanation: expl,
        historyPixels: [...history]
      });

      pk = nextPk;
    }
  } else {
    // Steep line: |m| > 1, driving axis is Y
    const twoDx = 2 * absDx;
    const twoDxMinusTwoDy = 2 * absDx - 2 * absDy;
    let pk = 2 * absDx - absDy;

    // Step 0: Initial point
    steps.push({
      step: 0,
      totalSteps: numSteps,
      x: curX,
      y: curY,
      pk,
      dx: absDx,
      dy: absDy,
      twoDy: twoDx, // using primary axis difference
      twoDyMinusTwoDx: twoDxMinusTwoDy,
      decisionCondition: `Initial parameter p₀ = 2Δx - Δy = 2(${absDx}) - ${absDy} = ${pk}`,
      chosenCandidate: 'Straight',
      candidate1: { x: curX, y: curY + stepY, isCandidate: true, label: 'N' },
      candidate2: { x: curX + stepX, y: curY + stepY, isCandidate: true, label: 'NE' },
      explanation: `Plotting initial pixel (${curX}, ${curY}). Slope is steep (|m| > 1), so Y is the driving axis. Initial p₀ = 2Δx - Δy = ${pk}.`,
      historyPixels: [...history]
    });

    for (let i = 1; i <= numSteps; i++) {
      const candNorth: PixelCoord = { x: curX, y: curY + stepY, isCandidate: true, label: 'North (N)' };
      const candDiagonal: PixelCoord = { x: curX + stepX, y: curY + stepY, isCandidate: true, label: 'Diagonal (NE/NW)' };

      let nextX = curX;
      let nextY = curY + stepY;
      let chosenName: 'Straight' | 'Diagonal' = 'Straight';
      let nextPk = pk;
      let condStr = '';
      let expl = '';

      if (pk < 0) {
        nextX = curX; // North
        nextPk = pk + twoDx;
        chosenName = 'Straight';
        condStr = `p_${i - 1} = ${pk} < 0 ➔ Select Vertical (${nextX}, ${nextY})`;
        expl = `Because p = ${pk} < 0, line is closer to vertical neighbor (${nextX}, ${nextY}). Next p = p + 2Δx = ${pk} + ${twoDx} = ${nextPk}.`;
      } else {
        nextX = curX + stepX; // Diagonal
        nextPk = pk + twoDxMinusTwoDy;
        chosenName = 'Diagonal';
        condStr = `p_${i - 1} = ${pk} ≥ 0 ➔ Select Diagonal (${nextX}, ${nextY})`;
        expl = `Because p = ${pk} ≥ 0, line is closer to diagonal neighbor (${nextX}, ${nextY}). Next p = p + 2Δx - 2Δy = ${pk} + (${twoDxMinusTwoDy}) = ${nextPk}.`;
      }

      curX = nextX;
      curY = nextY;
      history.push({ x: curX, y: curY });

      steps.push({
        step: i,
        totalSteps: numSteps,
        x: curX,
        y: curY,
        pk,
        pkNext: nextPk,
        dx: absDx,
        dy: absDy,
        twoDy: twoDx,
        twoDyMinusTwoDx: twoDxMinusTwoDy,
        decisionCondition: condStr,
        chosenCandidate: chosenName,
        candidate1: candNorth,
        candidate2: candDiagonal,
        explanation: expl,
        historyPixels: [...history]
      });

      pk = nextPk;
    }
  }

  return steps;
}
