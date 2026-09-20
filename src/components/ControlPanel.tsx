import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from 'lucide-react';

interface ControlPanelProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: 'slow' | 'medium' | 'fast';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: 'slow' | 'medium' | 'fast') => void;
  onSeek: (step: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onSeek
}) => {
  return (
    <div className="flex flex-col gap-2.5 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
      {/* Primary Action Buttons & Timeline */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Buttons Group */}
        <div className="flex items-center gap-1.5">
          {/* Play/Pause */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={currentStep >= totalSteps && totalSteps > 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          )}

          {/* Previous Step */}
          <button
            onClick={onPrev}
            disabled={currentStep <= 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all active:scale-95"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Next Step */}
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 disabled:opacity-40 text-sky-300 text-xs font-semibold transition-all active:scale-95"
            title="Next Step (Executes single iteration)"
          >
            <span>Next</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-medium transition-all active:scale-95"
            title="Reset to Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2 py-1 rounded-lg">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400 font-medium mr-1">Speed:</span>
          {(['slow', 'medium', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                speed === s
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-sky-400 bg-sky-950/40 border border-sky-800/40 px-3 py-1 rounded-lg">
          <span className="text-slate-400">Step:</span>
          <span className="font-bold text-sky-300">{currentStep}</span>
          <span className="text-slate-500">/</span>
          <span>{totalSteps}</span>
        </div>
      </div>

      {/* Scrubbable Timeline Slider */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-[11px] font-mono text-slate-400 w-8 text-right">0</span>
        <input
          type="range"
          min={0}
          max={Math.max(1, totalSteps)}
          value={currentStep}
          onChange={e => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
        />
        <span className="text-[11px] font-mono text-slate-400 w-8">{totalSteps}</span>
      </div>
    </div>
  );
};
