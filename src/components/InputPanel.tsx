import React, { useState } from 'react';
import { AlgorithmId, AlgorithmInputParams, TestCasePreset } from '../types';
import { TEST_CASE_PRESETS } from '../data/presets';
import { PlayCircle, AlertCircle, Sparkles } from 'lucide-react';

interface InputPanelProps {
  algorithm: AlgorithmId;
  params: AlgorithmInputParams;
  onParamsChange: (newParams: AlgorithmInputParams) => void;
  onGenerate: () => void;
  error: string | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  algorithm,
  params,
  onParamsChange,
  onGenerate,
  error
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const handleInputChange = (field: keyof AlgorithmInputParams, val: string) => {
    const num = parseFloat(val);
    onParamsChange({
      ...params,
      [field]: isNaN(num) ? 0 : num
    });
  };

  const handleApplyPreset = (preset: TestCasePreset) => {
    setSelectedPresetId(preset.id);
    onParamsChange({
      ...params,
      ...preset.params
    });
  };

  const relevantPresets = TEST_CASE_PRESETS.filter(p => {
    if (algorithm === 'dda' || algorithm === 'bresenham') return p.category === 'Line';
    if (algorithm === 'circle') return p.category === 'Circle';
    if (algorithm === 'cohen_sutherland' || algorithm === 'liang_barsky') return p.category === 'Clipping';
    return false;
  });

  return (
    <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
      {/* Header & Presets Selector */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Input Parameters
        </span>
        {relevantPresets.length > 0 && (
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedPresetId}
              onChange={e => {
                const p = relevantPresets.find(pr => pr.id === e.target.value);
                if (p) handleApplyPreset(p);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-sky-500 max-w-[170px]"
            >
              <option value="">Load Preset Test Case...</option>
              {relevantPresets.map(pr => (
                <option key={pr.id} value={pr.id}>
                  {pr.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2 bg-rose-950/40 border border-rose-800/60 rounded-lg p-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Fields */}
      {(algorithm === 'dda' || algorithm === 'bresenham') && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Start Point (X1, Y1)</span>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                value={params.x1}
                onChange={e => handleInputChange('x1', e.target.value)}
                placeholder="X1"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.y1}
                onChange={e => handleInputChange('y1', e.target.value)}
                placeholder="Y1"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">End Point (X2, Y2)</span>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                value={params.x2}
                onChange={e => handleInputChange('x2', e.target.value)}
                placeholder="X2"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.y2}
                onChange={e => handleInputChange('y2', e.target.value)}
                placeholder="Y2"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {algorithm === 'circle' && (
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Center X</span>
            <input
              type="number"
              value={params.cx}
              onChange={e => handleInputChange('cx', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Center Y</span>
            <input
              type="number"
              value={params.cy}
              onChange={e => handleInputChange('cy', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Radius (R)</span>
            <input
              type="number"
              min={1}
              value={params.radius}
              onChange={e => handleInputChange('radius', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {(algorithm === 'cohen_sutherland' || algorithm === 'liang_barsky') && (
        <div className="flex flex-col gap-2.5">
          {/* Line Endpoints */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Line Segment: (X1, Y1) to (X2, Y2)</span>
            <div className="grid grid-cols-4 gap-1.5">
              <input
                type="number"
                value={params.x1}
                onChange={e => handleInputChange('x1', e.target.value)}
                placeholder="X1"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.y1}
                onChange={e => handleInputChange('y1', e.target.value)}
                placeholder="Y1"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.x2}
                onChange={e => handleInputChange('x2', e.target.value)}
                placeholder="X2"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.y2}
                onChange={e => handleInputChange('y2', e.target.value)}
                placeholder="Y2"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Window Bounds */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-400">Clipping Window: [Xmin, Ymin] to [Xmax, Ymax]</span>
            <div className="grid grid-cols-4 gap-1.5">
              <input
                type="number"
                value={params.xmin}
                onChange={e => handleInputChange('xmin', e.target.value)}
                placeholder="Xmin"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.ymin}
                onChange={e => handleInputChange('ymin', e.target.value)}
                placeholder="Ymin"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.xmax}
                onChange={e => handleInputChange('xmax', e.target.value)}
                placeholder="Xmax"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="number"
                value={params.ymax}
                onChange={e => handleInputChange('ymax', e.target.value)}
                placeholder="Ymax"
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-98"
      >
        <PlayCircle className="w-4 h-4" />
        <span>Generate & Compute Steps</span>
      </button>
    </div>
  );
};
