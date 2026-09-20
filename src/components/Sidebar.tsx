import React from 'react';
import { ActiveView, AlgorithmId } from '../types';
import {
  Layers,
  Sparkles,
  GitCompare,
  BookOpen,
  Terminal,
  HelpCircle,
  Home,
  CircleDot,
  Scissors,
  Spline
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  selectedAlgorithm: AlgorithmId;
  onSelectView: (view: ActiveView) => void;
  onSelectAlgorithm: (algo: AlgorithmId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  selectedAlgorithm,
  onSelectView,
  onSelectAlgorithm
}) => {
  const algorithms = [
    { id: 'dda' as AlgorithmId, label: 'DDA Line', icon: Spline, tag: 'Float / Rounding' },
    { id: 'bresenham' as AlgorithmId, label: 'Bresenham Line', icon: Layers, tag: 'Integer Arithmetic' },
    { id: 'circle' as AlgorithmId, label: 'Midpoint Circle', icon: CircleDot, tag: '8-Way Symmetry' },
    { id: 'cohen_sutherland' as AlgorithmId, label: 'Cohen–Sutherland', icon: Scissors, tag: '4-Bit Outcodes' },
    { id: 'liang_barsky' as AlgorithmId, label: 'Liang–Barsky', icon: Sparkles, tag: 'Parametric Clip' }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wider text-slate-100 uppercase">
              Graphics Visualizer
            </h1>
            <p className="text-[10px] text-sky-400 font-mono font-medium">Computer Graphics Lab</p>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={() => onSelectView('home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'home'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home Dashboard</span>
          </button>
        </div>

        {/* Algorithm Modules Group */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Algorithms
          </div>
          <div className="space-y-1">
            {algorithms.map(algo => {
              const Icon = algo.icon;
              const isSelected = activeView === 'visualizer' && selectedAlgorithm === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => {
                    onSelectAlgorithm(algo.id);
                    onSelectView('visualizer');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-600/25 border border-sky-500/50 text-sky-300 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span>{algo.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 font-mono border border-slate-800">
                    {algo.id === 'dda' ? 'DDA' : algo.id === 'bresenham' ? 'Bres' : algo.id === 'circle' ? 'Circ' : 'Clip'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Educational Tools */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Analysis & Study
          </div>
          <div className="space-y-1">
            {/* Comparison */}
            <button
              onClick={() => onSelectView('comparison')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeView === 'comparison'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>DDA vs Bresenham</span>
            </button>

            {/* Algorithm Guide */}
            <button
              onClick={() => onSelectView('guide')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeView === 'guide'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Algorithm Guide & Viva</span>
            </button>

            {/* Python Source Code */}
            <button
              onClick={() => onSelectView('python_code')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeView === 'python_code'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Python + Tkinter Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-1.5">
        <button
          onClick={() => onSelectView('about')}
          className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>About Project</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">v1.0</span>
        </button>
        <p className="text-[10px] text-slate-400 leading-tight">
          Designed for MCA & CS Computer Graphics coursework.
        </p>
      </div>
    </aside>
  );
};
