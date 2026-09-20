# Graphics Algorithm Visualizer

An interactive educational platform designed for MCA and Computer Science students to explore and master fundamental 2D computer graphics algorithms step-by-step.

---

## 1. Project Overview

Rather than merely rendering a static final shape, this visualizer demonstrates internal state transitions, decision parameter updates, candidate pixel selections, and clipping region codes with real-time mathematical telemetry.

### Core Algorithms Implemented:
1. **DDA (Digital Differential Analyzer) Line Algorithm**
   - Calculates $dx, dy$, steps, and incremental floating coordinates $(x_{\text{inc}}, y_{\text{inc}})$.
   - Demonstrates round-off pixel quantization at each iteration.
2. **Bresenham's Line Algorithm**
   - Pure integer arithmetic without floating-point division.
   - Evaluates candidate pixels (e.g. East vs. North-East) based on the sign of decision parameter $p_k$.
   - Supports all 8 octants (shallow slopes $|m| \le 1$, steep slopes $|m| > 1$, negative slopes, horizontal, vertical).
3. **Midpoint Circle Drawing Algorithm**
   - Integer decision parameter $P_0 = 1 - R$.
   - Demonstrates 8-way circle symmetry by plotting symmetric reflections in all octants simultaneously.
4. **Cohen–Sutherland Line Clipping Algorithm**
   - 4-bit region outcodes (TOP, BOTTOM, RIGHT, LEFT: `1000`, `0100`, `0010`, `0001`).
   - Bitwise AND/OR operations for trivial acceptance/rejection and boundary intersection calculations.
5. **Future-Ready Extension: Liang–Barsky Parametric Clipping**
   - Parametric line formulation $P(u) = P_1 + u \Delta P$ using $p_k, q_k$ inequalities.

---

## 2. Directory Structure

```
graphics_algorithm_visualizer/
│
├── main.py                        # Application entry point
├── test_cases.py                  # Automated test verification suite
├── requirements.txt               # Dependencies (standard library)
├── README.md                      # Documentation & viva guide
│
├── algorithms/                    # Pure algorithmic state generators
│   ├── dda.py                     # DDA line rasterizer
│   ├── bresenham.py               # Bresenham integer line rasterizer
│   ├── midpoint_circle.py         # Midpoint circle with 8-way symmetry
│   └── cohen_sutherland.py        # 4-bit Cohen-Sutherland line clipper
│
├── visualization/                 # Graphics & animation layers
│   ├── grid.py                    # Coordinate grid & math space transformation
│   ├── renderer.py                # Pixel, candidate, and clipping box renderer
│   └── animation.py               # Step timer & playback controller
│
└── ui/                            # Tkinter user interface components
    ├── main_window.py             # 3-section layout manager
    ├── input_panel.py             # Dynamic parameter inputs with validation
    ├── control_panel.py           # Play, pause, step, speed, and timeline
    └── information_panel.py       # Live telemetry, formulas, and explanations
```

---

## 3. How to Run Locally

### Prerequisites:
- Python 3.8+ with standard `tkinter` package.

### Execution:
```bash
# Clone or navigate to the project directory:
cd python_project

# Launch the visualizer:
python main.py
```

### Running Unit Tests:
```bash
python test_cases.py
```

---

## 4. Key Academic & Viva Questions Answered

- **Why is Bresenham preferred over DDA?**
  DDA involves floating-point arithmetic and rounding at every step, which is computationally expensive on hardware. Bresenham uses only integer addition and bit-shifts with integer decision parameter $p_k$.
- **What is the significance of the 8-way circle symmetry?**
  Computing points for one octant ($0 \le x \le y$) and reflecting across the remaining 7 octants reduces computation by 87.5%.
- **How does Cohen-Sutherland avoid unnecessary intersection calculations?**
  Using 4-bit region outcodes, lines entirely inside ($(C_1 \mid C_2) == 0$) or entirely outside on one side ($(C_1 \ \& \ C_2) \ne 0$) are immediately accepted or rejected without solving linear equations.

---

## 5. License
MIT License. Built for educational demonstration and computer graphics laboratory coursework.
