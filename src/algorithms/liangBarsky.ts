import { ClippingRect, LiangBarskyStepState, Point2D } from '../types';

export function generateLiangBarskySteps(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  clip: ClippingRect
): LiangBarskyStepState[] {
  const steps: LiangBarskyStepState[] = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const originalLine = { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } };

  // Parametric tests: p_k * u <= q_k
  // k=1 (Left):   p1 = -dx, q1 = x1 - xmin
  // k=2 (Right):  p2 =  dx, q2 = xmax - x1
  // k=3 (Bottom): p3 = -dy, q3 = y1 - ymin
  // k=4 (Top):    p4 =  dy, q4 = ymax - y1
  const edges: Array<{ name: 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP'; p: number; q: number }> = [
    { name: 'LEFT', p: -dx, q: x1 - clip.xmin },
    { name: 'RIGHT', p: dx, q: clip.xmax - x1 },
    { name: 'BOTTOM', p: -dy, q: y1 - clip.ymin },
    { name: 'TOP', p: dy, q: clip.ymax - y1 }
  ];

  let u1 = 0;
  let u2 = 1;
  let rejected = false;

  // Initial step 0
  steps.push({
    step: 0,
    totalSteps: 5,
    p1: { x: x1, y: y1 },
    p2: { x: x2, y: y2 },
    dx,
    dy,
    currentEdge: 'LEFT',
    p: 0,
    q: 0,
    r: 0,
    u1,
    u2,
    explanation: `Liang-Barsky parametric formulation: P(u) = P1 + u · ΔP, u ∈ [0, 1]. Initial bounds: u₁ = 0.0, u₂ = 1.0. Window: [${clip.xmin}, ${clip.xmax}] × [${clip.ymin}, ${clip.ymax}].`,
    originalLine,
    clippingWindow: clip,
    acceptedSegment: null,
    rejected: false
  });

  for (let i = 0; i < edges.length; i++) {
    const { name, p, q } = edges[i];
    const r = p !== 0 ? q / p : 0;
    let expl = '';

    if (p === 0) {
      if (q < 0) {
        rejected = true;
        expl = `Edge ${name}: p = 0 and q = ${q} < 0. Line is parallel to this boundary and completely outside!`;
      } else {
        expl = `Edge ${name}: p = 0 and q = ${q} ≥ 0. Line is parallel and inside the boundary strip.`;
      }
    } else if (p < 0) {
      // Line goes from outside to inside (potential entry)
      expl = `Edge ${name} (Entry): p = ${p} < 0, q = ${q}, r = q/p = ${r.toFixed(3)}. Update u₁ = max(u₁, r) = max(${u1.toFixed(3)}, ${r.toFixed(3)})`;
      if (r > u1) u1 = r;
      if (u1 > u2) {
        rejected = true;
        expl += ` ➔ u₁ (${u1.toFixed(3)}) > u₂ (${u2.toFixed(3)}) ➔ REJECTED!`;
      }
    } else {
      // Line goes from inside to outside (potential exit)
      expl = `Edge ${name} (Exit): p = ${p} > 0, q = ${q}, r = q/p = ${r.toFixed(3)}. Update u₂ = min(u₂, r) = min(${u2.toFixed(3)}, ${r.toFixed(3)})`;
      if (r < u2) u2 = r;
      if (u1 > u2) {
        rejected = true;
        expl += ` ➔ u₁ (${u1.toFixed(3)}) > u₂ (${u2.toFixed(3)}) ➔ REJECTED!`;
      }
    }

    steps.push({
      step: i + 1,
      totalSteps: 5,
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      dx,
      dy,
      currentEdge: name,
      p,
      q,
      r: Number(r.toFixed(3)),
      u1: Number(u1.toFixed(3)),
      u2: Number(u2.toFixed(3)),
      explanation: expl,
      originalLine,
      clippingWindow: clip,
      acceptedSegment: null,
      rejected
    });

    if (rejected) break;
  }

  // Final step
  if (!rejected && u1 <= u2) {
    const finalP1: Point2D = {
      x: Number((x1 + u1 * dx).toFixed(2)),
      y: Number((y1 + u1 * dy).toFixed(2))
    };
    const finalP2: Point2D = {
      x: Number((x1 + u2 * dx).toFixed(2)),
      y: Number((y1 + u2 * dy).toFixed(2))
    };
    steps.push({
      step: steps.length,
      totalSteps: steps.length,
      p1: finalP1,
      p2: finalP2,
      dx,
      dy,
      currentEdge: 'FINAL',
      p: 0,
      q: 0,
      r: 0,
      u1: Number(u1.toFixed(3)),
      u2: Number(u2.toFixed(3)),
      explanation: `Line accepted! Clipped segment computed from parameters: P(u₁=${u1.toFixed(3)}) = (${finalP1.x}, ${finalP1.y}) to P(u₂=${u2.toFixed(3)}) = (${finalP2.x}, ${finalP2.y}).`,
      originalLine,
      clippingWindow: clip,
      acceptedSegment: { p1: finalP1, p2: finalP2 },
      rejected: false
    });
  } else {
    steps.push({
      step: steps.length,
      totalSteps: steps.length,
      p1: { x: x1, y: y1 },
      p2: { x: x2, y: y2 },
      dx,
      dy,
      currentEdge: 'FINAL',
      p: 0,
      q: 0,
      r: 0,
      u1: Number(u1.toFixed(3)),
      u2: Number(u2.toFixed(3)),
      explanation: `Clipping complete: Entire line is REJECTED (no portion inside clipping window).`,
      originalLine,
      clippingWindow: clip,
      acceptedSegment: null,
      rejected: true
    });
  }

  const finalTotal = steps.length - 1;
  steps.forEach(s => s.totalSteps = finalTotal);
  return steps;
}
