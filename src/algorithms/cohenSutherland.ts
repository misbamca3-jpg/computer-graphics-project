import { ClippingRect, CohenSutherlandStepState, Point2D } from '../types';

export const INSIDE = 0; // 0000
export const LEFT = 1;   // 0001
export const RIGHT = 2;  // 0010
export const BOTTOM = 4; // 0100
export const TOP = 8;    // 1000

export function computeOutCode(x: number, y: number, clip: ClippingRect): number {
  let code = INSIDE;
  if (x < clip.xmin) {
    code |= LEFT;
  } else if (x > clip.xmax) {
    code |= RIGHT;
  }
  if (y < clip.ymin) {
    code |= BOTTOM;
  } else if (y > clip.ymax) {
    code |= TOP;
  }
  return code;
}

export function toBinary4(code: number): string {
  return (code >>> 0).toString(2).padStart(4, '0');
}

export function generateCohenSutherlandSteps(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  clip: ClippingRect
): CohenSutherlandStepState[] {
  const steps: CohenSutherlandStepState[] = [];
  const originalLine = { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } };
  const rejectedSegments: Array<{ p1: Point2D; p2: Point2D }> = [];

  let curP1: Point2D = { x: x1, y: y1 };
  let curP2: Point2D = { x: x2, y: y2 };
  let code1 = computeOutCode(curP1.x, curP1.y, clip);
  let code2 = computeOutCode(curP2.x, curP2.y, clip);

  let stepIdx = 0;
  let done = false;
  let maxIters = 8;

  // Initial step 0: Evaluation
  steps.push({
    step: 0,
    totalSteps: 1, // dynamically updated at end
    p1: { ...curP1 },
    p2: { ...curP2 },
    code1: toBinary4(code1),
    code2: toBinary4(code2),
    code1Val: code1,
    code2Val: code2,
    action: 'EVALUATE',
    explanation: `Initial line endpoints: P1(${curP1.x}, ${curP1.y}) code = ${toBinary4(code1)}, P2(${curP2.x}, ${curP2.y}) code = ${toBinary4(code2)}. Clipping window: [${clip.xmin}, ${clip.xmax}] × [${clip.ymin}, ${clip.ymax}].`,
    originalLine,
    clippingWindow: clip,
    rejectedSegments: [...rejectedSegments],
    acceptedSegment: null
  });

  while (!done && maxIters > 0) {
    maxIters--;
    stepIdx++;

    // Check trivial accept
    if ((code1 | code2) === 0) {
      done = true;
      steps.push({
        step: stepIdx,
        totalSteps: stepIdx,
        p1: { ...curP1 },
        p2: { ...curP2 },
        code1: toBinary4(code1),
        code2: toBinary4(code2),
        code1Val: code1,
        code2Val: code2,
        action: 'ACCEPT',
        explanation: `Trivial ACCEPT! (code1 | code2) == 0 (both endpoints inside window). Visible line segment is from (${curP1.x.toFixed(2)}, ${curP1.y.toFixed(2)}) to (${curP2.x.toFixed(2)}, ${curP2.y.toFixed(2)}).`,
        originalLine,
        clippingWindow: clip,
        rejectedSegments: [...rejectedSegments],
        acceptedSegment: { p1: { ...curP1 }, p2: { ...curP2 } }
      });
      break;
    }

    // Check trivial reject
    if ((code1 & code2) !== 0) {
      done = true;
      rejectedSegments.push({ p1: { ...curP1 }, p2: { ...curP2 } });
      steps.push({
        step: stepIdx,
        totalSteps: stepIdx,
        p1: { ...curP1 },
        p2: { ...curP2 },
        code1: toBinary4(code1),
        code2: toBinary4(code2),
        code1Val: code1,
        code2Val: code2,
        action: 'REJECT',
        explanation: `Trivial REJECT! (code1 & code2) = ${toBinary4(code1 & code2)} ≠ 0. Both endpoints share an outside half-plane. Line is completely outside the clipping window.`,
        originalLine,
        clippingWindow: clip,
        rejectedSegments: [...rejectedSegments],
        acceptedSegment: null
      });
      break;
    }

    // Clipping is necessary
    const codeOut = code1 !== 0 ? code1 : code2;
    const isP1 = code1 !== 0;
    let ix = 0;
    let iy = 0;
    let boundary: 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP' = 'TOP';

    const dx = curP2.x - curP1.x;
    const dy = curP2.y - curP1.y;

    if (codeOut & TOP) {
      boundary = 'TOP';
      iy = clip.ymax;
      ix = curP1.x + (dx * (clip.ymax - curP1.y)) / dy;
    } else if (codeOut & BOTTOM) {
      boundary = 'BOTTOM';
      iy = clip.ymin;
      ix = curP1.x + (dx * (clip.ymin - curP1.y)) / dy;
    } else if (codeOut & RIGHT) {
      boundary = 'RIGHT';
      ix = clip.xmax;
      iy = curP1.y + (dy * (clip.xmax - curP1.x)) / dx;
    } else if (codeOut & LEFT) {
      boundary = 'LEFT';
      ix = clip.xmin;
      iy = curP1.y + (dy * (clip.xmin - curP1.x)) / dx;
    }

    const oldPt = isP1 ? { ...curP1 } : { ...curP2 };
    const newPt: Point2D = { x: Number(ix.toFixed(2)), y: Number(iy.toFixed(2)) };
    rejectedSegments.push({ p1: oldPt, p2: newPt });

    if (isP1) {
      curP1 = newPt;
      code1 = computeOutCode(curP1.x, curP1.y, clip);
    } else {
      curP2 = newPt;
      code2 = computeOutCode(curP2.x, curP2.y, clip);
    }

    steps.push({
      step: stepIdx,
      totalSteps: stepIdx + 1,
      p1: { ...curP1 },
      p2: { ...curP2 },
      code1: toBinary4(code1),
      code2: toBinary4(code2),
      code1Val: code1,
      code2Val: code2,
      action: 'CLIP',
      clippedPointIndex: isP1 ? 1 : 2,
      intersectionPoint: newPt,
      boundaryTested: boundary,
      explanation: `Line clipped against ${boundary} boundary! P${isP1 ? 1 : 2} (${oldPt.x}, ${oldPt.y}) replaced with intersection point (${newPt.x}, ${newPt.y}). New code: ${toBinary4(isP1 ? code1 : code2)}.`,
      originalLine,
      clippingWindow: clip,
      rejectedSegments: [...rejectedSegments],
      acceptedSegment: null
    });
  }

  // Set totalSteps correctly on all steps
  const totalSteps = steps.length - 1;
  steps.forEach(s => s.totalSteps = totalSteps);

  return steps;
}
