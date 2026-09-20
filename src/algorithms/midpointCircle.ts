import { CircleStepState, CircleSymmetricPoints, PixelCoord, Point2D } from '../types';

export function getSymmetricPoints(xc: number, yc: number, x: number, y: number): CircleSymmetricPoints {
  return {
    octant1: { x: xc + x, y: yc + y },
    octant2: { x: xc - x, y: yc + y },
    octant3: { x: xc + x, y: yc - y },
    octant4: { x: xc - x, y: yc - y },
    octant5: { x: xc + y, y: yc + x },
    octant6: { x: xc - y, y: yc + x },
    octant7: { x: xc + y, y: yc - x },
    octant8: { x: xc - y, y: yc - x }
  };
}

export function generateMidpointCircleSteps(xc: number, yc: number, radius: number): CircleStepState[] {
  const steps: CircleStepState[] = [];
  const r = Math.round(Math.abs(radius));

  if (r === 0) {
    const symm = getSymmetricPoints(xc, yc, 0, 0);
    return [{
      step: 0,
      totalSteps: 0,
      x: 0,
      y: 0,
      pk: 0,
      center: { x: xc, y: yc },
      radius: 0,
      symmetricPoints: symm,
      explanation: `Radius is 0. Single center pixel plotted at (${xc}, ${yc}).`,
      historyPixels: [{ x: xc, y: yc }]
    }];
  }

  let x = 0;
  let y = r;
  let pk = 1 - r;

  // Pre-calculate step count for accurate timeline
  let simX = 0;
  let simY = r;
  let simP = 1 - r;
  let count = 0;
  while (simX <= simY) {
    count++;
    if (simP < 0) {
      simP += 2 * simX + 3;
    } else {
      simP += 2 * (simX - simY) + 5;
      simY--;
    }
    simX++;
  }
  const totalSteps = count - 1;

  const historyMap = new Map<string, PixelCoord>();

  const addSymmetricToHistory = (symm: CircleSymmetricPoints) => {
    const pts: Point2D[] = [
      symm.octant1, symm.octant2, symm.octant3, symm.octant4,
      symm.octant5, symm.octant6, symm.octant7, symm.octant8
    ];
    pts.forEach((p, idx) => {
      const key = `${p.x},${p.y}`;
      if (!historyMap.has(key)) {
        historyMap.set(key, { x: p.x, y: p.y, symmetricGroup: idx + 1 });
      }
    });
  };

  let stepIndex = 0;

  while (x <= y) {
    const symm = getSymmetricPoints(xc, yc, x, y);
    addSymmetricToHistory(symm);

    let nextPk = pk;
    let nextY = y;
    let expl = '';

    if (stepIndex === 0) {
      expl = `Initial point (x=0, y=${r}) relative to center (${xc}, ${yc}). Initial decision parameter P₀ = 1 - R = 1 - ${r} = ${pk}. 8 symmetric pixels generated on the grid.`;
    }

    if (pk < 0) {
      nextPk = pk + 2 * x + 3;
      nextY = y;
      if (stepIndex > 0) {
        expl = `Step ${stepIndex}: Since P = ${pk} < 0, midpoint lies inside circle. Choose E (x+1, y) = (${x + 1}, ${y}). Next P = P + 2x + 3 = ${pk} + 2(${x}) + 3 = ${nextPk}.`;
      }
    } else {
      nextPk = pk + 2 * (x - y) + 5;
      nextY = y - 1;
      if (stepIndex > 0) {
        expl = `Step ${stepIndex}: Since P = ${pk} ≥ 0, midpoint lies outside/on circle. Choose SE (x+1, y-1) = (${x + 1}, ${y - 1}). Next P = P + 2(x - y) + 5 = ${pk} + 2(${x - y}) + 5 = ${nextPk}.`;
      }
    }

    steps.push({
      step: stepIndex,
      totalSteps,
      x,
      y,
      pk,
      pkNext: nextPk,
      center: { x: xc, y: yc },
      radius: r,
      symmetricPoints: symm,
      explanation: expl,
      historyPixels: Array.from(historyMap.values())
    });

    pk = nextPk;
    x++;
    y = nextY;
    stepIndex++;
  }

  return steps;
}
