import React, { useState, useMemo } from 'react';
import { generateDDASteps } from '../algorithms/dda';
import { generateBresenhamSteps } from '../algorithms/bresenham';
import { GridCanvas } from './GridCanvas';
import { GitCompare, CheckCircle, Cpu, Zap, Scale, Calculator } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const [x1, setX1] = useState<number>(2);
  const [y1, setY1] = useState<number>(2);
  const [x2, setX2] = useState<number>(9);
  const [y2, setY2] = useState<number>(6);

  const ddaSteps = useMemo(() => generateDDASteps(x1, y1, x2, y2), [x1, y1, x2, y2]);
  const bresSteps = useMemo(() => generateBresenhamSteps(x1, y1, x2, y2), [x1, y1, x2, y2]);

  const lastDda = ddaSteps[ddaSteps.length - 1];
  const lastBres = bresSteps[bresSteps.length - 1];

  const dx = x2 - x1;
  const dy = y2 - y1;
  const slope = dx === 0 ? 'Undefined (Vertical)' : (dy / dx).toFixed(3);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Comparative Line Rasterization Engine</span>
          </div>
          <h1 className="text-xl font-black text-slate-100">
            DDA vs. Bresenham's Line Algorithm
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate arithmetic operations, rounding deviations, step counts, and hardware efficiency on identical endpoints.
          </p>
        </div>

        {/* Input Controls */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
          <span className="font-semibold text-slate-400">Endpoints:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span>P1(</span>
            <input
              type="number"
              value={x1}
              onChange={e => setX1(Number(e.target.value))}
              className="w-10 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-sky-300"
            />
            <span>,</span>
            <input
              type="number"
              value={y1}
              onChange={e => setY1(Number(e.target.value))}
              className="w-10 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-sky-300"
            />
            <span>) → P2(</span>
            <input
              type="number"
              value={x2}
              onChange={e => setX2(Number(e.target.value))}
              className="w-10 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-emerald-300"
            />
            <span>,</span>
            <input
              type="number"
              value={y2}
              onChange={e => setY2(Number(e.target.value))}
              className="w-10 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-emerald-300"
            />
            <span>)</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px] pl-2 border-l border-slate-800">
            Slope m = {slope}
          </div>
        </div>
      </div>

      {/* Dual Canvas Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* DDA Column */}
        <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
              <h2 className="font-bold text-sm text-slate-100">DDA Algorithm</h2>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
              Floating-Point Arithmetic
            </span>
          </div>

          <div className="h-64 rounded-lg overflow-hidden border border-slate-800">
            <GridCanvas
              algorithm="dda"
              currentStepData={{ type: 'dda', data: lastDda }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <div><span className="text-slate-500">Steps:</span> {ddaSteps.length}</div>
            <div><span className="text-slate-500">x_inc:</span> {lastDda.xInc}</div>
            <div><span className="text-slate-500">y_inc:</span> {lastDda.yInc}</div>
            <div><span className="text-slate-500">Operation:</span> round(x), round(y)</div>
          </div>
        </div>

        {/* Bresenham Column */}
        <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <h2 className="font-bold text-sm text-slate-100">Bresenham's Algorithm</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              Integer Arithmetic Only
            </span>
          </div>

          <div className="h-64 rounded-lg overflow-hidden border border-slate-800">
            <GridCanvas
              algorithm="bresenham"
              currentStepData={{ type: 'bresenham', data: lastBres }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <div><span className="text-slate-500">Steps:</span> {bresSteps.length}</div>
            <div><span className="text-slate-500">2Δy:</span> {lastBres.twoDy}</div>
            <div><span className="text-slate-500">2Δy - 2Δx:</span> {lastBres.twoDyMinusTwoDx}</div>
            <div><span className="text-slate-500">Final p_k:</span> {lastBres.pk}</div>
          </div>
        </div>
      </div>

      {/* Deep Educational Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Scale className="w-4 h-4 text-sky-400" />
          <span>Detailed Architecture Comparison Matrix</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Evaluation Feature</th>
                <th className="p-3 text-sky-400">DDA (Digital Differential Analyzer)</th>
                <th className="p-3 text-emerald-400">Bresenham's Line Algorithm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-slate-200">Arithmetic Type</td>
                <td className="p-3 text-rose-300 font-mono">Floating-Point Division & Increments</td>
                <td className="p-3 text-emerald-300 font-mono">Pure Integer Addition & Subtraction</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Hardware Efficiency</td>
                <td className="p-3">Requires Floating-Point Unit (FPU); slower in embedded / GPU hardware.</td>
                <td className="p-3 text-emerald-400 font-medium">Extremely fast; execute directly on integer ALUs.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Rounding Mechanism</td>
                <td className="p-3">Applies explicit <code className="text-sky-300 font-mono">round()</code> calls at every step, accumulating round-off errors.</td>
                <td className="p-3">Zero rounding. Evaluates exact sign of decision parameter <code className="text-emerald-300 font-mono">p_k</code>.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Multiplication / Division</td>
                <td className="p-3">Divides once at initialization (<code className="font-mono">dx/steps</code>, <code className="font-mono">dy/steps</code>).</td>
                <td className="p-3">Only multiplies by 2 (can be implemented with bitwise left shift <code className="text-emerald-300 font-mono">&lt;&lt; 1</code>).</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Precision / Drift</td>
                <td className="p-3">Floating-point truncation may cause cumulative drift on extremely long lines.</td>
                <td className="p-3">Exact mathematical precision; zero drift over arbitrarily long raster lines.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Step Coordinates Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Calculator className="w-4 h-4 text-sky-400" />
          <span>Side-by-Side Iteration Coordinates Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-sky-400">DDA Generated Pixels:</h3>
            <div className="max-h-48 overflow-y-auto bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs space-y-1">
              {ddaSteps.map((s, idx) => (
                <div key={idx} className="flex justify-between text-slate-400">
                  <span>Step {s.step}: ({s.xPixel}, {s.yPixel})</span>
                  <span className="text-slate-600">float: ({s.xFloat}, {s.yFloat})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-emerald-400">Bresenham Generated Pixels:</h3>
            <div className="max-h-48 overflow-y-auto bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs space-y-1">
              {bresSteps.map((s, idx) => (
                <div key={idx} className="flex justify-between text-slate-400">
                  <span>Step {s.step}: ({s.x}, {s.y})</span>
                  <span className="text-emerald-500/80">pk = {s.pk} [{s.chosenCandidate}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
