import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, FolderTree, Play } from 'lucide-react';

export const PythonProjectViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [copied, setCopied] = useState<boolean>(false);

  const fileContents: Record<string, string> = {
    'main.py': `"""
Graphics Algorithm Visualizer
Entry Point for Python Tkinter Desktop Application.
Usage:
    python main.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ui.main_window import MainWindow

def main():
    try:
        app = MainWindow()
        app.mainloop()
    except Exception as e:
        print(f"Error launching application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
`,
    'algorithms/dda.py': `"""
DDA (Digital Differential Analyzer) Line Drawing Algorithm.
Generates step-by-step states for coordinate grid visualization.
"""

class DDALine:
    def __init__(self, x1: int, y1: int, x2: int, y2: int):
        self.x1 = int(x1)
        self.y1 = int(y1)
        self.x2 = int(x2)
        self.y2 = int(y2)

    def generate_steps(self):
        dx = self.x2 - self.x1
        dy = self.y2 - self.y1
        steps = max(abs(dx), abs(dy))

        if steps == 0:
            return [{
                "step": 0, "total_steps": 1,
                "x_float": self.x1, "y_float": self.y1,
                "pixel": (self.x1, self.y1),
                "dx": 0, "dy": 0, "x_inc": 0, "y_inc": 0,
                "explanation": f"Start and end points coincide at ({self.x1}, {self.y1}).",
                "pixels": [(self.x1, self.y1)]
            }]

        x_inc = dx / steps
        y_inc = dy / steps

        cur_x = float(self.x1)
        cur_y = float(self.y1)
        step_records = []
        accumulated_pixels = []

        for i in range(steps + 1):
            px = round(cur_x)
            py = round(cur_y)
            accumulated_pixels.append((px, py))

            expl = f"Step {i}: (x={cur_x:.2f}, y={cur_y:.2f}) rounded to pixel ({px}, {py})"
            step_records.append({
                "step": i, "total_steps": steps,
                "x_float": round(cur_x, 3), "y_float": round(cur_y, 3),
                "pixel": (px, py),
                "dx": dx, "dy": dy,
                "x_inc": round(x_inc, 4), "y_inc": round(y_inc, 4),
                "explanation": expl,
                "pixels": list(accumulated_pixels)
            })

            cur_x += x_inc
            cur_y += y_inc

        return step_records
`,
    'algorithms/bresenham.py': `"""
Bresenham's Line Drawing Algorithm.
Uses integer-only decision parameters and supports all 8 octants.
"""

class BresenhamLine:
    def __init__(self, x1: int, y1: int, x2: int, y2: int):
        self.x1 = int(x1)
        self.y1 = int(y1)
        self.x2 = int(x2)
        self.y2 = int(y2)

    def generate_steps(self):
        dx = abs(self.x2 - self.x1)
        dy = abs(self.y2 - self.y1)
        sx = 1 if self.x1 < self.x2 else -1
        sy = 1 if self.y1 < self.y2 else -1

        is_steep = dy > dx
        num_steps = dy if is_steep else dx

        cur_x = self.x1
        cur_y = self.y1
        history = [(cur_x, cur_y)]
        step_records = []

        if not is_steep:
            # Shallow slope: |m| <= 1, driving axis is X
            pk = 2 * dy - dx
            two_dy = 2 * dy
            two_dy_minus_two_dx = 2 * dy - 2 * dx

            step_records.append({
                "step": 0, "total_steps": num_steps, "pixel": (cur_x, cur_y),
                "pk": pk, "candidate1": (cur_x + sx, cur_y), "candidate2": (cur_x + sx, cur_y + sy),
                "selected": (cur_x, cur_y), "decision_cond": f"Initial p0 = 2*dy - dx = {pk}",
                "explanation": f"Initial pixel ({cur_x}, {cur_y}). Driving axis is X. p0 = {pk}.",
                "pixels": list(history)
            })

            for i in range(1, num_steps + 1):
                cand_straight = (cur_x + sx, cur_y)
                cand_diagonal = (cur_x + sx, cur_y + sy)

                if pk < 0:
                    chosen = cand_straight
                    next_pk = pk + two_dy
                    expl = f"p = {pk} < 0 -> Select horizontal ({chosen[0]}, {chosen[1]}). Next p = {next_pk}."
                else:
                    chosen = cand_diagonal
                    next_pk = pk + two_dy_minus_two_dx
                    expl = f"p = {pk} >= 0 -> Select diagonal ({chosen[0]}, {chosen[1]}). Next p = {next_pk}."

                cur_x, cur_y = chosen
                history.append((cur_x, cur_y))
                step_records.append({
                    "step": i, "total_steps": num_steps, "pixel": (cur_x, cur_y),
                    "pk": pk, "pk_next": next_pk,
                    "candidate1": cand_straight, "candidate2": cand_diagonal, "selected": chosen,
                    "explanation": expl, "pixels": list(history)
                })
                pk = next_pk
        else:
            # Steep slope: |m| > 1, driving axis is Y
            pk = 2 * dx - dy
            two_dx = 2 * dx
            two_dx_minus_two_dy = 2 * dx - 2 * dy

            step_records.append({
                "step": 0, "total_steps": num_steps, "pixel": (cur_x, cur_y),
                "pk": pk, "candidate1": (cur_x, cur_y + sy), "candidate2": (cur_x + sx, cur_y + sy),
                "selected": (cur_x, cur_y), "decision_cond": f"Initial p0 = 2*dx - dy = {pk}",
                "explanation": f"Initial pixel ({cur_x}, {cur_y}). Driving axis is Y (steep). p0 = {pk}.",
                "pixels": list(history)
            })

            for i in range(1, num_steps + 1):
                cand_straight = (cur_x, cur_y + sy)
                cand_diagonal = (cur_x + sx, cur_y + sy)

                if pk < 0:
                    chosen = cand_straight
                    next_pk = pk + two_dx
                    expl = f"p = {pk} < 0 -> Select vertical ({chosen[0]}, {chosen[1]}). Next p = {next_pk}."
                else:
                    chosen = cand_diagonal
                    next_pk = pk + two_dx_minus_two_dy
                    expl = f"p = {pk} >= 0 -> Select diagonal ({chosen[0]}, {chosen[1]}). Next p = {next_pk}."

                cur_x, cur_y = chosen
                history.append((cur_x, cur_y))
                step_records.append({
                    "step": i, "total_steps": num_steps, "pixel": (cur_x, cur_y),
                    "pk": pk, "pk_next": next_pk,
                    "candidate1": cand_straight, "candidate2": cand_diagonal, "selected": chosen,
                    "explanation": expl, "pixels": list(history)
                })
                pk = next_pk

        return step_records
`,
    'algorithms/midpoint_circle.py': `"""
Midpoint Circle Drawing Algorithm with 8-way symmetry.
"""

class MidpointCircle:
    def __init__(self, xc: int, yc: int, radius: int):
        self.xc = int(xc)
        self.yc = int(yc)
        self.radius = int(radius)

    def get_symmetric_points(self, x: int, y: int):
        return [
            (self.xc + x, self.yc + y),
            (self.xc - x, self.yc + y),
            (self.xc + x, self.yc - y),
            (self.xc - x, self.yc - y),
            (self.xc + y, self.yc + x),
            (self.xc - y, self.yc + x),
            (self.xc + y, self.yc - x),
            (self.xc - y, self.yc - x)
        ]

    def generate_steps(self):
        r = abs(self.radius)
        x = 0
        y = r
        pk = 1 - r

        step_records = []
        accumulated_pixels = set()
        step_idx = 0

        while x <= y:
            symm = self.get_symmetric_points(x, y)
            for pt in symm:
                accumulated_pixels.add(pt)

            if pk < 0:
                next_pk = pk + 2 * x + 3
                next_y = y
                expl = f"P = {pk} < 0 -> Choose E (x+1, y). Next P = {next_pk}."
            else:
                next_pk = pk + 2 * (x - y) + 5
                next_y = y - 1
                expl = f"P = {pk} >= 0 -> Choose SE (x+1, y-1). Next P = {next_pk}."

            step_records.append({
                "step": step_idx, "x": x, "y": y,
                "pk": pk, "pk_next": next_pk,
                "symmetric_points": symm, "explanation": expl,
                "pixels": list(accumulated_pixels)
            })

            pk = next_pk
            x += 1
            y = next_y
            step_idx += 1

        return step_records
`,
    'algorithms/cohen_sutherland.py': `"""
Cohen-Sutherland Line Clipping Algorithm with 4-bit region outcodes.
"""

INSIDE = 0  # 0000
LEFT = 1    # 0001
RIGHT = 2   # 0010
BOTTOM = 4  # 0100
TOP = 8     # 1000

def compute_outcode(x, y, xmin, ymin, xmax, ymax):
    code = INSIDE
    if x < xmin: code |= LEFT
    elif x > xmax: code |= RIGHT
    if y < ymin: code |= BOTTOM
    elif y > ymax: code |= TOP
    return code

class CohenSutherland:
    def __init__(self, x1, y1, x2, y2, xmin, ymin, xmax, ymax):
        self.x1, self.y1, self.x2, self.y2 = float(x1), float(y1), float(x2), float(y2)
        self.xmin, self.ymin, self.xmax, self.ymax = float(xmin), float(ymin), float(xmax), float(ymax)

    def generate_steps(self):
        steps = []
        cur_x1, cur_y1 = self.x1, self.y1
        cur_x2, cur_y2 = self.x2, self.y2

        code1 = compute_outcode(cur_x1, cur_y1, self.xmin, self.ymin, self.xmax, self.ymax)
        code2 = compute_outcode(cur_x2, cur_y2, self.xmin, self.ymin, self.xmax, self.ymax)

        step_idx = 0
        rejected_segments = []

        while True:
            if (code1 | code2) == 0:
                steps.append({
                    "step": step_idx, "action": "ACCEPT",
                    "p1": (cur_x1, cur_y1), "p2": (cur_x2, cur_y2),
                    "code1": f"{code1:04b}", "code2": f"{code2:04b}",
                    "explanation": "Trivial ACCEPT: Both codes 0000 (completely inside window).",
                    "accepted_segment": ((cur_x1, cur_y1), (cur_x2, cur_y2)),
                    "rejected_segments": list(rejected_segments)
                })
                break

            if (code1 & code2) != 0:
                rejected_segments.append(((cur_x1, cur_y1), (cur_x2, cur_y2)))
                steps.append({
                    "step": step_idx, "action": "REJECT",
                    "p1": (cur_x1, cur_y1), "p2": (cur_x2, cur_y2),
                    "code1": f"{code1:04b}", "code2": f"{code2:04b}",
                    "explanation": "Trivial REJECT: Logical AND != 0 (both points outside same edge).",
                    "accepted_segment": None,
                    "rejected_segments": list(rejected_segments)
                })
                break

            # Clipping
            code_out = code1 if code1 != 0 else code2
            is_p1 = (code1 != 0)
            dx = cur_x2 - cur_x1
            dy = cur_y2 - cur_y1

            if code_out & TOP:
                boundary = "TOP"; iy = self.ymax; ix = cur_x1 + (dx * (self.ymax - cur_y1)) / dy
            elif code_out & BOTTOM:
                boundary = "BOTTOM"; iy = self.ymin; ix = cur_x1 + (dx * (self.ymin - cur_y1)) / dy
            elif code_out & RIGHT:
                boundary = "RIGHT"; ix = self.xmax; iy = cur_y1 + (dy * (self.xmax - cur_x1)) / dx
            elif code_out & LEFT:
                boundary = "LEFT"; ix = self.xmin; iy = cur_y1 + (dy * (self.xmin - cur_x1)) / dx

            old_pt = (cur_x1, cur_y1) if is_p1 else (cur_x2, cur_y2)
            new_pt = (round(ix, 2), round(iy, 2))
            rejected_segments.append((old_pt, new_pt))

            if is_p1:
                cur_x1, cur_y1 = new_pt
                code1 = compute_outcode(cur_x1, cur_y1, self.xmin, self.ymin, self.xmax, self.ymax)
            else:
                cur_x2, cur_y2 = new_pt
                code2 = compute_outcode(cur_x2, cur_y2, self.xmin, self.ymin, self.xmax, self.ymax)

            steps.append({
                "step": step_idx, "action": "CLIP",
                "boundary": boundary, "intersection": new_pt,
                "p1": (cur_x1, cur_y1), "p2": (cur_x2, cur_y2),
                "code1": f"{code1:04b}", "code2": f"{code2:04b}",
                "explanation": f"Clipped against {boundary} boundary at ({new_pt[0]}, {new_pt[1]}).",
                "accepted_segment": None,
                "rejected_segments": list(rejected_segments)
            })
            step_idx += 1

        return steps
`,
    'visualization/grid.py': `"""
Coordinate Grid Manager for Tkinter Canvas.
Translates mathematical cartesian space (x, y) to physical screen pixels.
"""

class CoordinateGrid:
    def __init__(self, canvas, width=640, height=540, cell_size=28):
        self.canvas = canvas
        self.width = width
        self.height = height
        self.cell_size = cell_size
        self.origin_x = width // 2
        self.origin_y = height // 2

    def to_canvas(self, math_x, math_y):
        cx = self.origin_x + math_x * self.cell_size
        cy = self.origin_y - math_y * self.cell_size
        return cx, cy

    def draw_grid(self):
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, self.width, self.height, fill="#0f172a", outline="")
        # Grid lines and coordinate axes are rendered here...
`,
    'test_cases.py': `"""
Unit Test Verification Suite for Graphics Algorithm Visualizer.
Run with: python test_cases.py
"""
from algorithms.dda import DDALine
from algorithms.bresenham import BresenhamLine
from algorithms.midpoint_circle import MidpointCircle
from algorithms.cohen_sutherland import CohenSutherland

def run_tests():
    print("Running Algorithm Suite Tests...")
    assert len(DDALine(2, 2, 8, 5).generate_steps()) == 7
    assert BresenhamLine(2, 2, 8, 5).generate_steps()[-1]["pixel"] == (8, 5)
    assert len(MidpointCircle(5, 5, 4).generate_steps()) > 0
    assert CohenSutherland(1, 2, 8, 9, 3, 3, 7, 7).generate_steps()[-1]["action"] in ["ACCEPT", "REJECT"]
    print("All tests passed successfully!")

if __name__ == "__main__":
    run_tests()
`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Standalone Python + Tkinter Project Code</span>
          </div>
          <h1 className="text-xl font-black text-slate-100">
            Python Source Code & Project Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All files are pre-generated in your workspace under <code className="text-sky-300 font-mono">python_project/</code>. You can copy any file or run <code className="text-emerald-300 font-mono">python main.py</code> directly.
          </p>
        </div>

        {/* Local Run Tip */}
        <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-mono">
          <Play className="w-3.5 h-3.5" />
          <span>Local Run: python main.py</span>
        </div>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* File Tree Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-sky-400" />
            <span>Project Files</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {Object.keys(fileContents).map(fileName => {
              const isSelected = selectedFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors truncate ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{fileName}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Run on Your Computer:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
              <li>Export or copy files</li>
              <li>Ensure Python 3 is installed</li>
              <li>Execute: <code className="text-sky-300 font-mono">python main.py</code></li>
            </ol>
          </div>
        </div>

        {/* Code Editor View */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-sky-300 font-medium">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>python_project/{selectedFile}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text Area */}
          <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[520px] overflow-y-auto selection:bg-sky-500 selection:text-slate-950">
            <code>{fileContents[selectedFile]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
