import React from 'react';
import { AlgorithmId, ActiveView } from '../types';
import {
  Spline,
  Layers,
  CircleDot,
  Scissors,
  ArrowRight,
  Sparkles,
  GitCompare,
  BookOpen,
  Terminal,
  Cpu,
  Eye,
  Sliders
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectAlgorithm: (algo: AlgorithmId) => void;
  onSelectView: (view: ActiveView) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectAlgorithm,
  onSelectView
}) => {
  const cards = [
    {
      id: 'dda' as AlgorithmId,
      title: 'DDA Line Algorithm',
      subtitle: 'Digital Differential Analyzer',
      tag: 'Floating Point',
      icon: Spline,
      color: 'sky',
      desc: 'Step-by-step floating coordinate increments along the driving axis with round-off pixel quantization.',
      features: ['Calculates dx, dy, and steps', 'Floating-point incremental slope', 'Demonstrates round-off truncation']
    },
    {
      id: 'bresenham' as AlgorithmId,
      title: "Bresenham's Line Algorithm",
      subtitle: 'Integer Scan-Conversion',
      tag: 'Pure Integer Math',
      icon: Layers,
      color: 'emerald',
      desc: 'Evaluates candidate pixels (East vs North-East) using sign of decision parameter pk without floating division.',
      features: ['Initial decision p₀ = 2Δy - Δx', 'Zero floating-point operations', 'Supports all 8 octants']
    },
    {
      id: 'circle' as AlgorithmId,
      title: 'Midpoint Circle Algorithm',
      subtitle: '8-Way Symmetry Rasterizer',
      tag: 'Symmetry Optimization',
      icon: CircleDot,
      color: 'purple',
      desc: 'Computes points for only one octant (0 ≤ x ≤ y) and projects reflections across all 8 symmetric quadrants.',
      features: ['Initial parameter P₀ = 1 - R', 'Midpoint test: inside vs outside', 'Plots 8 symmetric points per step']
    },
    {
      id: 'cohen_sutherland' as AlgorithmId,
      title: 'Cohen–Sutherland Clipping',
      subtitle: '4-Bit Region Outcodes',
      tag: 'Window Line Clipping',
      icon: Scissors,
      color: 'amber',
      desc: 'Clips arbitrary lines against rectangular windows using 4-bit TBRL outcodes and bitwise Boolean logic.',
      features: ['9-region binary code division', 'Trivial Accept (C1 | C2 == 0)', 'Trivial Reject (C1 & C2 != 0)']
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Computer Graphics Lab</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight leading-tight">
            Learn Computer Graphics Algorithms — One Pixel at a Time
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            An educational interactive visualizer for <strong>DDA</strong>, <strong>Bresenham</strong>, <strong>Midpoint Circle</strong>, and <strong>Cohen–Sutherland line clipping</strong>. Inspect internal state transitions, decision parameter updates, candidate pixel selections, and clipping region codes with real-time mathematical telemetry.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                onSelectAlgorithm('dda');
                onSelectView('visualizer');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <span>Launch Visualizer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectView('comparison')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
            >
              <GitCompare className="w-4 h-4" />
              <span>DDA vs Bresenham</span>
            </button>
            <button
              onClick={() => onSelectView('guide')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Viva Guide & Theory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary 4 Algorithm Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Featured Graphics Algorithms
          </h2>
          <span className="text-xs text-slate-500 font-mono">4 Core Curriculum Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all shadow-xl hover:shadow-sky-500/5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 group-hover:text-sky-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{card.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                      {card.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>

                  <ul className="space-y-1 text-xs text-slate-400">
                    {card.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">Interactive Canvas</span>
                  <button
                    onClick={() => {
                      onSelectAlgorithm(card.id);
                      onSelectView('visualizer');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Step-by-Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wide">
            <Cpu className="w-4 h-4" />
            <span>Mathematical Telemetry</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every step exposes the exact internal calculations: increments, slope $m$, decision parameter updates ($p_k$), and 4-bit region outcodes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide">
            <Eye className="w-4 h-4" />
            <span>High-Precision Coordinate Grid</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Smooth zoom, pan, hover pixel coordinates inspector, ideal guideline overlay, candidate pixel indicators, and clipping window boundaries.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wide">
            <Terminal className="w-4 h-4" />
            <span>Dual Architecture (Web + Python)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Complete standalone Python 3 + Tkinter desktop implementation included. Run <code className="text-purple-300 font-mono">python main.py</code> directly on desktop!
          </p>
        </div>
      </div>
    </div>
  );
};
