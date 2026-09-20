import React from 'react';
import { AlgorithmId, AlgorithmStep } from '../types';
import { Info, Calculator, CheckCircle2, ListFilter, Activity } from 'lucide-react';

interface InfoPanelProps {
  algorithm: AlgorithmId;
  currentStepData: AlgorithmStep | null;
  allSteps: AlgorithmStep[];
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  algorithm,
  currentStepData,
  allSteps,
  currentStepIndex,
  onSelectStep
}) => {
  if (!currentStepData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-sm">
        <Info className="w-8 h-8 mb-2 opacity-50" />
        <p>No steps generated. Click "Generate" to compute steps.</p>
      </div>
    );
  }

  const getAlgoTitle = () => {
    switch (algorithm) {
      case 'dda': return 'DDA Line Drawing Algorithm';
      case 'bresenham': return "Bresenham's Line Drawing Algorithm";
      case 'circle': return 'Midpoint Circle Drawing Algorithm';
      case 'cohen_sutherland': return 'Cohen–Sutherland Line Clipping';
      case 'liang_barsky': return 'Liang–Barsky Parametric Line Clipping';
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl overflow-y-auto max-h-[calc(100vh-180px)]">
      {/* Title & Status Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 font-mono">
            Active Telemetry
          </span>
          <h2 className="text-sm font-bold text-slate-100">{getAlgoTitle()}</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed text-slate-300">
        <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1 text-[11px] uppercase tracking-wide">
          <Info className="w-3.5 h-3.5" />
          <span>Algorithm Explanation</span>
        </div>
        <p className="text-slate-200">
          {currentStepData.type === 'dda' && currentStepData.data.explanation}
          {currentStepData.type === 'bresenham' && currentStepData.data.explanation}
          {currentStepData.type === 'circle' && currentStepData.data.explanation}
          {currentStepData.type === 'cohen_sutherland' && currentStepData.data.explanation}
          {currentStepData.type === 'liang_barsky' && currentStepData.data.explanation}
        </p>
      </div>

      {/* Primary Mathematical Telemetry Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Current Coordinates */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Current Position
          </span>
          {currentStepData.type === 'dda' && (
            <div className="font-mono text-xs">
              <div className="text-sky-300 font-bold">Pixel: ({currentStepData.data.xPixel}, {currentStepData.data.yPixel})</div>
              <div className="text-slate-400 text-[11px]">Float: ({currentStepData.data.xFloat}, {currentStepData.data.yFloat})</div>
            </div>
          )}
          {currentStepData.type === 'bresenham' && (
            <div className="font-mono text-xs">
              <div className="text-emerald-300 font-bold">Pixel: ({currentStepData.data.x}, {currentStepData.data.y})</div>
              <div className="text-slate-400 text-[11px]">Choice: {currentStepData.data.chosenCandidate}</div>
            </div>
          )}
          {currentStepData.type === 'circle' && (
            <div className="font-mono text-xs">
              <div className="text-purple-300 font-bold">Octant 1: ({currentStepData.data.x}, {currentStepData.data.y})</div>
              <div className="text-slate-400 text-[11px]">Center: ({currentStepData.data.center.x}, {currentStepData.data.center.y})</div>
            </div>
          )}
          {currentStepData.type === 'cohen_sutherland' && (
            <div className="font-mono text-xs">
              <div className="text-amber-300 font-bold">P1: ({currentStepData.data.p1.x}, {currentStepData.data.p1.y})</div>
              <div className="text-amber-300 font-bold">P2: ({currentStepData.data.p2.x}, {currentStepData.data.p2.y})</div>
            </div>
          )}
          {currentStepData.type === 'liang_barsky' && (
            <div className="font-mono text-xs">
              <div className="text-sky-300 font-bold">u1: {currentStepData.data.u1}</div>
              <div className="text-sky-300 font-bold">u2: {currentStepData.data.u2}</div>
            </div>
          )}
        </div>

        {/* Decision Parameter / Core Metric */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Decision Parameter
          </span>
          {currentStepData.type === 'dda' && (
            <div className="font-mono text-xs">
              <div className="text-slate-200">Slope m = {currentStepData.data.slope}</div>
              <div className="text-slate-400 text-[11px]">Rounding nearest int</div>
            </div>
          )}
          {currentStepData.type === 'bresenham' && (
            <div className="font-mono text-xs">
              <div className="text-amber-300 font-bold">p_k = {currentStepData.data.pk}</div>
              <div className="text-slate-400 text-[11px]">
                {currentStepData.data.pk < 0 ? 'p < 0 (Straight)' : 'p ≥ 0 (Diagonal)'}
              </div>
            </div>
          )}
          {currentStepData.type === 'circle' && (
            <div className="font-mono text-xs">
              <div className="text-amber-300 font-bold">P_k = {currentStepData.data.pk}</div>
              <div className="text-slate-400 text-[11px]">
                {currentStepData.data.pk < 0 ? 'P < 0 (Inside)' : 'P ≥ 0 (Outside)'}
              </div>
            </div>
          )}
          {currentStepData.type === 'cohen_sutherland' && (
            <div className="font-mono text-xs">
              <div className="text-emerald-400 font-bold">{currentStepData.data.action}</div>
              <div className="text-slate-400 text-[11px]">
                {(currentStepData.data.code1Val | currentStepData.data.code2Val) === 0 ? 'Inside Window' : 'Outside Window'}
              </div>
            </div>
          )}
          {currentStepData.type === 'liang_barsky' && (
            <div className="font-mono text-xs">
              <div className="text-sky-400 font-bold">{currentStepData.data.currentEdge}</div>
              <div className="text-slate-400 text-[11px]">p={currentStepData.data.p}, q={currentStepData.data.q}</div>
            </div>
          )}
        </div>
      </div>

      {/* Intermediate Values Breakdown */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-2 text-xs">
          <Calculator className="w-3.5 h-3.5 text-sky-400" />
          <span>Intermediate Calculations</span>
        </div>

        {currentStepData.type === 'dda' && (
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 font-mono text-xs text-slate-300">
            <div><span className="text-slate-500">Δx (dx):</span> {currentStepData.data.dx}</div>
            <div><span className="text-slate-500">Δy (dy):</span> {currentStepData.data.dy}</div>
            <div><span className="text-slate-500">Total Steps:</span> {currentStepData.data.totalSteps}</div>
            <div><span className="text-slate-500">x_inc:</span> {currentStepData.data.xInc}</div>
            <div><span className="text-slate-500">y_inc:</span> {currentStepData.data.yInc}</div>
            <div><span className="text-slate-500">Slope m:</span> {currentStepData.data.slope}</div>
          </div>
        )}

        {currentStepData.type === 'bresenham' && (
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 font-mono text-xs text-slate-300">
            <div><span className="text-slate-500">Δx:</span> {currentStepData.data.dx}</div>
            <div><span className="text-slate-500">Δy:</span> {currentStepData.data.dy}</div>
            <div><span className="text-slate-500">2Δy:</span> {currentStepData.data.twoDy}</div>
            <div><span className="text-slate-500">2Δy - 2Δx:</span> {currentStepData.data.twoDyMinusTwoDx}</div>
            <div className="col-span-2 text-sky-400 font-semibold pt-1 border-t border-slate-800">
              Condition: {currentStepData.data.decisionCondition}
            </div>
          </div>
        )}

        {currentStepData.type === 'circle' && (
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div><span className="text-slate-500">Radius R:</span> {currentStepData.data.radius}</div>
              <div><span className="text-slate-500">Current P_k:</span> {currentStepData.data.pk}</div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 mb-1 font-sans">
              8-Way Symmetric Pixel Reflections for current (x={currentStepData.data.x}, y={currentStepData.data.y}):
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
              <div>1: ({currentStepData.data.symmetricPoints.octant1.x}, {currentStepData.data.symmetricPoints.octant1.y})</div>
              <div>2: ({currentStepData.data.symmetricPoints.octant2.x}, {currentStepData.data.symmetricPoints.octant2.y})</div>
              <div>3: ({currentStepData.data.symmetricPoints.octant3.x}, {currentStepData.data.symmetricPoints.octant3.y})</div>
              <div>4: ({currentStepData.data.symmetricPoints.octant4.x}, {currentStepData.data.symmetricPoints.octant4.y})</div>
              <div>5: ({currentStepData.data.symmetricPoints.octant5.x}, {currentStepData.data.symmetricPoints.octant5.y})</div>
              <div>6: ({currentStepData.data.symmetricPoints.octant6.x}, {currentStepData.data.symmetricPoints.octant6.y})</div>
              <div>7: ({currentStepData.data.symmetricPoints.octant7.x}, {currentStepData.data.symmetricPoints.octant7.y})</div>
              <div>8: ({currentStepData.data.symmetricPoints.octant8.x}, {currentStepData.data.symmetricPoints.octant8.y})</div>
            </div>
          </div>
        )}

        {currentStepData.type === 'cohen_sutherland' && (
          <div className="flex flex-col gap-2 font-mono text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">P1 Outcode</span>
                <span className="text-amber-400 font-bold">{currentStepData.data.code1}</span>
                <span className="text-slate-500 text-[10px] block">
                  ({currentStepData.data.code1Val === 0 ? 'Inside' : `Dec: ${currentStepData.data.code1Val}`})
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">P2 Outcode</span>
                <span className="text-amber-400 font-bold">{currentStepData.data.code2}</span>
                <span className="text-slate-500 text-[10px] block">
                  ({currentStepData.data.code2Val === 0 ? 'Inside' : `Dec: ${currentStepData.data.code2Val}`})
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Bitwise Tests:
              <div className="text-slate-200 mt-0.5">
                • Trivial Accept test (C1 | C2):{' '}
                <span className={(currentStepData.data.code1Val | currentStepData.data.code2Val) === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {(currentStepData.data.code1Val | currentStepData.data.code2Val).toString(2).padStart(4, '0')}
                </span>
              </div>
              <div className="text-slate-200 mt-0.5">
                • Trivial Reject test (C1 & C2):{' '}
                <span className={(currentStepData.data.code1Val & currentStepData.data.code2Val) !== 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {(currentStepData.data.code1Val & currentStepData.data.code2Val).toString(2).padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        )}

        {currentStepData.type === 'liang_barsky' && (
          <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
            <div><span className="text-slate-500">p:</span> {currentStepData.data.p}</div>
            <div><span className="text-slate-500">q:</span> {currentStepData.data.q}</div>
            <div><span className="text-slate-500">r = q/p:</span> {currentStepData.data.r}</div>
            <div><span className="text-slate-500">u1 (entry):</span> {currentStepData.data.u1}</div>
            <div><span className="text-slate-500">u2 (exit):</span> {currentStepData.data.u2}</div>
            <div><span className="text-slate-500">Status:</span> {currentStepData.data.rejected ? 'Rejected' : 'Clipping'}</div>
          </div>
        )}
      </div>

      {/* Step History Log Table */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
            <ListFilter className="w-3.5 h-3.5 text-sky-400" />
            <span>Step History Log</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {allSteps.length} Total States
          </span>
        </div>

        <div className="max-h-36 overflow-y-auto rounded border border-slate-800/80">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-slate-900 text-slate-400 sticky top-0">
              <tr>
                <th className="p-1.5">Step</th>
                <th className="p-1.5">Pixel/Coords</th>
                <th className="p-1.5">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {allSteps.map((s, idx) => {
                const isSelected = idx === currentStepIndex;
                return (
                  <tr
                    key={idx}
                    onClick={() => onSelectStep(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-950/60 text-sky-300 font-bold'
                        : 'hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <td className="p-1.5 flex items-center gap-1">
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-sky-400" />}
                      #{s.data.step}
                    </td>
                    <td className="p-1.5">
                      {s.type === 'dda' && `(${s.data.xPixel}, ${s.data.yPixel})`}
                      {s.type === 'bresenham' && `(${s.data.x}, ${s.data.y})`}
                      {s.type === 'circle' && `(${s.data.x}, ${s.data.y})`}
                      {s.type === 'cohen_sutherland' && `${s.data.code1} / ${s.data.code2}`}
                      {s.type === 'liang_barsky' && `u=[${s.data.u1}, ${s.data.u2}]`}
                    </td>
                    <td className="p-1.5 truncate max-w-[90px]">
                      {s.type === 'dda' && `m=${s.data.slope}`}
                      {s.type === 'bresenham' && `p=${s.data.pk}`}
                      {s.type === 'circle' && `P=${s.data.pk}`}
                      {s.type === 'cohen_sutherland' && s.data.action}
                      {s.type === 'liang_barsky' && s.data.currentEdge}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
