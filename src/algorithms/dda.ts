import { DDAStepState, PixelCoord } from '../types';

export function generateDDASteps(x1: number, y1: number, x2: number, y2: number): DDAStepState[] {
  const steps: DDAStepState[] = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const numSteps = Math.max(Math.abs(dx), Math.abs(dy));

  if (numSteps === 0) {
    const px: PixelCoord = { x: Math.round(x1), y: Math.round(y1) };
    return [{
      step: 0,
      totalSteps: 1,
      xFloat: x1,
      yFloat: y1,
      xPixel: px.x,
      yPixel: px.y,
      dx: 0,
      dy: 0,
      xInc: 0,
      yInc: 0,
      slope: 'Undefined (point)',
      explanation: `Start and end points coincide at (${x1}, ${y1}). Single pixel drawn.`,
      historyPixels: [px]
    }];
  }

  const xInc = dx / numSteps;
  const yInc = dy / numSteps;
  const slope = dx === 0 ? 'Infinity (Vertical)' : (dy / dx).toFixed(4);

  let curX = x1;
  let curY = y1;
  const history: PixelCoord[] = [];

  for (let i = 0; i <= numSteps; i++) {
    const xPix = Math.round(curX);
    const yPix = Math.round(curY);
    history.push({ x: xPix, y: yPix, label: `(${xPix},${yPix})` });

    let explanation = '';
    if (i === 0) {
      explanation = `Initial point plotted at (${xPix}, ${yPix}). Total steps needed = max(|dx|, |dy|) = max(${Math.abs(dx)}, ${Math.abs(dy)}) = ${numSteps}. Increments: x_inc = ${xInc.toFixed(3)}, y_inc = ${yInc.toFixed(3)}.`;
    } else if (i === numSteps) {
      explanation = `Final endpoint reached at (${xPix}, ${yPix}). Line rasterization complete.`;
    } else {
      explanation = `Step ${i}: Float values (x = ${curX.toFixed(2)}, y = ${curY.toFixed(2)}) rounded to nearest pixel raster coordinates (${xPix}, ${yPix}).`;
    }

    steps.push({
      step: i,
      totalSteps: numSteps,
      xFloat: Number(curX.toFixed(3)),
      yFloat: Number(curY.toFixed(3)),
      xPixel: xPix,
      yPixel: yPix,
      dx,
      dy,
      xInc: Number(xInc.toFixed(4)),
      yInc: Number(yInc.toFixed(4)),
      slope,
      explanation,
      historyPixels: [...history]
    });

    curX += xInc;
    curY += yInc;
  }

  return steps;
}
