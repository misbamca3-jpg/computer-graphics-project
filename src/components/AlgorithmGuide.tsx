import React, { useState } from 'react';
import { BookOpen, Check, HelpCircle, Layers, Scissors, CircleDot, Spline, ArrowRight } from 'lucide-react';

export const AlgorithmGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dda' | 'bresenham' | 'circle' | 'clipping' | 'viva'>('dda');

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950 text-slate-100 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Computer Graphics Theory & Curriculum Guide</span>
        </div>
        <h1 className="text-2xl font-black text-slate-100">
          2D Rasterization & Clipping Reference
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive textbook explanations, mathematical derivations, advantages, limitations, and university viva exam preparation.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'dda', label: '1. DDA Line', icon: Spline },
          { id: 'bresenham', label: '2. Bresenham Line', icon: Layers },
          { id: 'circle', label: '3. Midpoint Circle', icon: CircleDot },
          { id: 'clipping', label: '4. Cohen–Sutherland', icon: Scissors },
          { id: 'viva', label: '🎓 MCA Viva Q&A (10 Questions)', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DDA */}
      {activeTab === 'dda' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-bold text-sky-400 flex items-center gap-2">
              <Spline className="w-5 h-5" />
              Digital Differential Analyzer (DDA) Line Algorithm
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> A scan-conversion line drawing algorithm based on calculating either $\Delta y$ or $\Delta x$ using differential increments along the driving coordinate axis.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Basic Idea:</strong> A line segment is sampled at unit intervals in one coordinate, and corresponding values in the other coordinate are computed by adding the incremental slope step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Formula & Derivation</h3>
              <div className="bg-slate-950 p-3 rounded font-mono text-xs text-sky-300 space-y-1">
                <div>dx = x2 - x1</div>
                <div>dy = y2 - y1</div>
                <div>steps = max(|dx|, |dy|)</div>
                <div>x_increment = dx / steps</div>
                <div>y_increment = dy / steps</div>
                <div>Next point: (x + x_inc, y + y_inc)</div>
                <div>Pixel: (round(x), round(y))</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Step-by-Step Procedure</h3>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>Input endpoints (x1, y1) and (x2, y2).</li>
                <li>Compute differences: dx = x2 - x1 and dy = y2 - y1.</li>
                <li>Find driving axis length: steps = max(|dx|, |dy|).</li>
                <li>Calculate increments per step: x_inc = dx / steps, y_inc = dy / steps.</li>
                <li>Set initial values: x = x1, y = y1, plot (round(x), round(y)).</li>
                <li>For i = 1 to steps: update x = x + x_inc, y = y + y_inc, and plot rounded coordinates.</li>
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-emerald-400">Advantages</h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Simple conceptual understanding and straightforward implementation.</li>
                <li>Avoids calculating multiplication inside the main loop.</li>
                <li>Faster than directly calculating $y = mx + c$ at each step.</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-rose-400">Limitations</h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Requires floating-point operations (<code className="font-mono">float</code> increments).</li>
                <li>Requires expensive <code className="font-mono">round()</code> function calls at each iteration.</li>
                <li>Accumulation of round-off errors over long lines leads to visual drift.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BRESENHAM */}
      {activeTab === 'bresenham' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Bresenham's Integer Line Drawing Algorithm
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> An accurate, highly efficient scan-conversion algorithm for lines that performs all calculations entirely with integer arithmetic, eliminating floating-point math and round-off errors.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Basic Idea:</strong> At each step along the driving axis, tests whether the ideal line is closer to the horizontal candidate (East) or the diagonal candidate (North-East) by inspecting the sign of an integer decision parameter $p_k$.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Decision Parameter Derivation</h3>
              <div className="bg-slate-950 p-3 rounded font-mono text-xs text-emerald-300 space-y-1">
                <div>Initial parameter:</div>
                <div className="font-bold text-amber-300">p₀ = 2Δy - Δx</div>
                <div className="pt-2 text-slate-400">If p_k &lt; 0:</div>
                <div>• Choose East pixel (x + 1, y)</div>
                <div>• p_(k+1) = p_k + 2Δy</div>
                <div className="pt-2 text-slate-400">If p_k ≥ 0:</div>
                <div>• Choose North-East pixel (x + 1, y + 1)</div>
                <div>• p_(k+1) = p_k + 2Δy - 2Δx</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Handling All 8 Octants</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When slope $|m| &gt; 1$ (steep lines), the roles of X and Y are swapped:
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-mono">
                <li>Y is the driving axis (increments by 1).</li>
                <li>p₀ = 2Δx - Δy</li>
                <li>If p_k &lt; 0: choose vertical neighbor (x, y + 1), next p = p + 2Δx.</li>
                <li>If p_k ≥ 0: choose diagonal neighbor (x + 1, y + 1), next p = p + 2Δx - 2Δy.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-emerald-400">Advantages</h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Pure integer arithmetic (addition, subtraction, and bitwise shift for $\times 2$).</li>
                <li>Zero floating-point operations: extremely fast on microcontrollers and GPUs.</li>
                <li>Mathematically exact: no cumulative round-off error or endpoint drift.</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-rose-400">Limitations</h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Slightly more complex control logic when supporting all 8 octants.</li>
                <li>Only rasterizes simple 1-pixel wide lines (requires antialiasing like Wu's for smooth lines).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MIDPOINT CIRCLE */}
      {activeTab === 'circle' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
              <CircleDot className="w-5 h-5" />
              Midpoint Circle Drawing Algorithm & 8-Way Symmetry
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> Rasterizes a circle with center $(x_c, y_c)$ and radius $R$ by calculating pixel positions for just the first octant ($0 \le x \le y$) and reflecting them symmetrically to the remaining 7 octants.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Midpoint Concept:</strong> The algorithm evaluates the circle function $f(x, y) = x^2 + y^2 - R^2$ at the midpoint between the East pixel $(x+1, y)$ and Southeast pixel $(x+1, y-1)$. If the midpoint is inside the circle ($P_k &lt; 0$), East is chosen; otherwise, Southeast is chosen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Initial Parameter & Updates</h3>
              <div className="bg-slate-950 p-3 rounded font-mono text-xs text-purple-300 space-y-1">
                <div>Start at: (0, R)</div>
                <div className="font-bold text-amber-300">P₀ = 1 - R (or 5/4 - R)</div>
                <div className="pt-2 text-slate-400">While x ≤ y:</div>
                <div>If P_k &lt; 0:</div>
                <div>• Next point: (x + 1, y)</div>
                <div>• P_(k+1) = P_k + 2(x + 1) + 1</div>
                <div className="pt-2 text-slate-400">If P_k ≥ 0:</div>
                <div>• Next point: (x + 1, y - 1)</div>
                <div>• P_(k+1) = P_k + 2(x + 1) + 1 - 2(y - 1)</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">The 8 Symmetric Octant Points</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For every calculated point $(x, y)$ relative to center $(x_c, y_c)$, 8 pixels are simultaneously plotted:
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-slate-950 p-2 rounded text-slate-300">
                <div>1. (xc + x, yc + y)</div>
                <div>2. (xc - x, yc + y)</div>
                <div>3. (xc + x, yc - y)</div>
                <div>4. (xc - x, yc - y)</div>
                <div>5. (xc + y, yc + x)</div>
                <div>6. (xc - y, yc + x)</div>
                <div>7. (xc + y, yc - x)</div>
                <div>8. (xc - y, yc - x)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COHEN-SUTHERLAND */}
      {activeTab === 'clipping' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Cohen–Sutherland Line Clipping Algorithm
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> Clips arbitrary 2D straight line segments against a rectangular viewport window [Xmin, Xmax] &times; [Ymin, Ymax], discarding portions outside the window.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>4-Bit Region Outcodes:</strong> Divides the 2D plane into 9 regions using 4-bit binary codes: <strong>Bit 4 (TOP: 1000)</strong>, <strong>Bit 3 (BOTTOM: 0100)</strong>, <strong>Bit 2 (RIGHT: 0010)</strong>, and <strong>Bit 1 (LEFT: 0001)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Top-Left</div>
              <div className="text-amber-300 text-base font-bold">1001</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Top Center</div>
              <div className="text-amber-300 text-base font-bold">1000</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Top-Right</div>
              <div className="text-amber-300 text-base font-bold">1010</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Left Center</div>
              <div className="text-amber-300 text-base font-bold">0001</div>
            </div>
            <div className="bg-slate-900 border border-emerald-800/80 rounded-xl p-3 text-center bg-emerald-950/20">
              <div className="text-emerald-400 text-[10px] uppercase font-bold">WINDOW (INSIDE)</div>
              <div className="text-emerald-300 text-base font-bold">0000</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Right Center</div>
              <div className="text-amber-300 text-base font-bold">0010</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Bottom-Left</div>
              <div className="text-amber-300 text-base font-bold">0101</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Bottom Center</div>
              <div className="text-amber-300 text-base font-bold">0100</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-[10px] uppercase">Bottom-Right</div>
              <div className="text-amber-300 text-base font-bold">0110</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Bitwise Acceptance / Rejection</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>
                  <span className="text-emerald-400 font-bold font-mono">Trivial ACCEPT:</span> If <code className="font-mono">(C1 | C2) == 0</code>, both endpoints are inside the window. Entire segment is visible.
                </li>
                <li>
                  <span className="text-rose-400 font-bold font-mono">Trivial REJECT:</span> If <code className="font-mono">(C1 & C2) != 0</code>, both endpoints share a common outside boundary. Segment is completely outside.
                </li>
                <li>
                  <span className="text-amber-400 font-bold font-mono">Partial Clip:</span> If neither holds, select the outside endpoint, compute intersection with the violated boundary edge, replace endpoint, and repeat.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider">Intersection Formulas</h3>
              <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 space-y-1">
                <div>Top edge (y = ymax): x = x1 + (x2-x1)*(ymax-y1)/(y2-y1)</div>
                <div>Btm edge (y = ymin): x = x1 + (x2-x1)*(ymin-y1)/(y2-y1)</div>
                <div>Rgt edge (x = xmax): y = y1 + (y2-y1)*(xmax-x1)/(x2-x1)</div>
                <div>Lft edge (x = xmin): y = y1 + (y2-y1)*(xmin-x1)/(x2-x1)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VIVA Q&A */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-bold text-sky-400 mb-1">
              Top 10 University / MCA Viva Examination Questions & Answers
            </h2>
            <p className="text-xs text-slate-400">
              Frequently asked viva questions during Computer Graphics practical lab exams.
            </p>
          </div>

          {[
            {
              q: '1. What is scan conversion (rasterization)?',
              a: 'Scan conversion is the process of digitizing continuous mathematical geometric primitives (lines, circles, polygons) into a discrete collection of pixels on a 2D raster grid.'
            },
            {
              q: '2. Why is Bresenham’s algorithm preferred over the DDA algorithm in computer graphics hardware?',
              a: 'DDA requires floating-point division and explicit rounding functions at every single step, which are slow and accumulate round-off error. Bresenham uses exclusively integer additions, subtractions, and bit shifts, making it significantly faster and hardware-friendly.'
            },
            {
              q: '3. What is the initial decision parameter for Bresenham’s line algorithm when slope |m| ≤ 1?',
              a: 'The initial decision parameter is p₀ = 2Δy - Δx. If p₀ < 0, the horizontal (East) pixel is selected; if p₀ ≥ 0, the diagonal (North-East) pixel is selected.'
            },
            {
              q: '4. How does circle symmetry reduce the workload in Midpoint Circle generation?',
              a: 'A circle possesses 8-way symmetry across the horizontal, vertical, and diagonal axes. By computing points only for one octant (45 degrees, where 0 ≤ x ≤ y), the remaining 7 octants are obtained by simple sign and coordinate reflections, reducing calculation cost by 87.5%.'
            },
            {
              q: '5. What is the initial decision parameter for the Midpoint Circle drawing algorithm?',
              a: 'The initial decision parameter is P₀ = 1 - R (derived from 5/4 - R by integer truncation, which gives identical integer decisions).'
            },
            {
              q: '6. Explain the 4-bit region code used in Cohen–Sutherland line clipping.',
              a: 'The 4 bits represent the boundaries relative to the clipping window in the order TOP-BOTTOM-RIGHT-LEFT (TBRL). Bit 4 is set if y > ymax; Bit 3 if y < ymin; Bit 2 if x > xmax; Bit 1 if x < xmin.'
            },
            {
              q: '7. What condition confirms a line is trivially accepted in Cohen–Sutherland?',
              a: 'When the bitwise OR of both endpoint region codes is 0: (Code1 | Code2) == 0. This proves both endpoints reside strictly inside the clipping window.'
            },
            {
              q: '8. What condition confirms a line is trivially rejected in Cohen–Sutherland?',
              a: 'When the bitwise AND of both endpoint region codes is non-zero: (Code1 & Code2) != 0. This proves both endpoints share at least one outside half-space (e.g. both are above TOP).'
            },
            {
              q: '9. How does Liang–Barsky clipping differ from Cohen–Sutherland clipping?',
              a: 'Cohen–Sutherland performs iterative linear equation solving against one boundary at a time. Liang–Barsky uses a parametric line formulation P(u) = P1 + u·ΔP and computes the maximum entry parameter u1 and minimum exit parameter u2 using simple inequalities, making it more efficient.'
            },
            {
              q: '10. What is aliasing or the jaggies phenomenon in raster graphics?',
              a: 'Aliasing is the staircase-like visual artifact caused by approximating continuous smooth lines or curves on a discrete pixel grid with finite resolution. Antialiasing techniques (e.g., supersampling or Wu\'s algorithm) blend boundary pixels with intermediate intensity values to reduce jaggies.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-sky-300">{item.q}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
