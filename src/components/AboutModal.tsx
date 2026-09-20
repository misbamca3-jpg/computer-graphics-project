import React from 'react';
import { X, Layers, Terminal, CheckCircle2, Code2, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">About Graphics Algorithm Visualizer</h2>
              <p className="text-[11px] text-sky-400 font-mono">Educational Interactive Learning Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">Project Purpose</h3>
            <p>
              Created specifically for MCA, B.Tech, and Computer Science students studying Computer Graphics (MCA 203 / CS 301). Instead of merely rendering static output images, this system exposes the inner mechanics of rasterization algorithms: floating point increments, integer decision parameters ($p_k$), candidate pixel comparisons, 8-way circle reflections, and bitwise window clipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Code2 className="w-4 h-4" />
                <span>Web Stack</span>
              </div>
              <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                <li>• React 18 + TypeScript</li>
                <li>• HTML5 Canvas 2D Rendering</li>
                <li>• Tailwind CSS Styling</li>
                <li>• Lucide React Icons</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>Python Desktop Stack</span>
              </div>
              <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                <li>• Python 3.8+</li>
                <li>• Native Tkinter GUI Canvas</li>
                <li>• Clean MVC separation</li>
                <li>• Zero external dependencies</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">How to Run Python Desktop Application</h3>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 space-y-1.5">
              <div className="text-slate-500"># 1. Navigate to python_project folder</div>
              <div>cd python_project</div>
              <div className="text-slate-500 pt-1"># 2. Launch the Tkinter desktop GUI</div>
              <div className="text-emerald-300 font-bold">python main.py</div>
              <div className="text-slate-500 pt-1"># 3. Run automated unit test suite</div>
              <div>python test_cases.py</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
