"""
Main Application Window for Graphics Algorithm Visualizer (Tkinter).
Coordinates Sidebar, Coordinate Grid Canvas, Controls, Input Panel, and Information Panel.
"""
import tkinter as tk
from tkinter import ttk

from visualization.grid import CoordinateGrid
from visualization.renderer import Renderer
from visualization.animation import AnimationController
from ui.input_panel import InputPanel
from ui.control_panel import ControlPanel
from ui.information_panel import InformationPanel

from algorithms.dda import DDALine
from algorithms.bresenham import BresenhamLine
from algorithms.midpoint_circle import MidpointCircle
from algorithms.cohen_sutherland import CohenSutherland

class MainWindow(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Graphics Algorithm Visualizer — Computer Graphics Learning Tool")
        self.geometry("1240 directed to 820")
        self.minsize(1100, 720)
        self.configure(bg="#090d16")

        self.current_algo = "dda"
        self.step_data_list = []

        self._build_layout()
        self.animation = AnimationController(self, self.on_step_change)

        # Initialize with default DDA
        self.on_algorithm_select("dda")

    def _build_layout(self):
        # Header Banner
        header = tk.Frame(self, bg="#0f172a", padx=16, pady=10, relief="flat")
        header.pack(side="top", fill="x")

        tk.Label(header, text="GRAPHICS ALGORITHM VISUALIZER", font=("Segoe UI", 13, "bold"), fg="#38bdf8", bg="#0f172a").pack(side="left")
        tk.Label(header, text=" |  Interactive MCA / CS Graphics Engine", font=("Segoe UI", 10), fg="#94a3b8", bg="#0f172a").pack(side="left")

        # Main 3-section container
        main_container = tk.Frame(self, bg="#090d16")
        main_container.pack(fill="both", expand=True, padx=10, pady=10)

        # 1. LEFT SIDEBAR
        sidebar = tk.Frame(main_container, bg="#1e293b", width=220, padx=10, pady=10)
        sidebar.pack(side="left", fill="y", padx=(0, 10))
        sidebar.pack_propagate(False)

        tk.Label(sidebar, text="ALGORITHMS", fg="#38bdf8", bg="#1e293b", font=("Segoe UI", 10, "bold")).pack(anchor="w", pady=(0, 8))

        algo_buttons = [
            ("DDA Line", "dda"),
            ("Bresenham Line", "bresenham"),
            ("Midpoint Circle", "circle"),
            ("Cohen-Sutherland", "cohen_sutherland")
        ]

        self.sidebar_btns = {}
        for text, algo_id in algo_buttons:
            btn = tk.Button(sidebar, text=text, font=("Segoe UI", 10), bg="#334155", fg="#f8fafc",
                            anchor="w", padx=10, pady=6, relief="flat", cursor="hand2",
                            command=lambda a=algo_id: self.on_algorithm_select(a))
            btn.pack(fill="x", pady=3)
            self.sidebar_btns[algo_id] = btn

        # Separator & Presets
        ttk.Separator(sidebar, orient="horizontal").pack(fill="x", pady=12)
        tk.Label(sidebar, text="PRESET TEST CASES", fg="#94a3b8", bg="#1e293b", font=("Segoe UI", 9, "bold")).pack(anchor="w", pady=(0, 6))

        presets = [
            ("Shallow Line (2,2)-(8,5)", "dda", {"x1": 2, "y1": 2, "x2": 8, "y2": 5}),
            ("Steep Line (2,1)-(5,9)", "bresenham", {"x1": 2, "y1": 1, "x2": 5, "y2": 9}),
            ("Circle (5,5) R=4", "circle", {"cx": 5, "cy": 5, "radius": 4}),
            ("Clipped Line (1,2)-(8,9)", "cohen_sutherland", {"x1": 1, "y1": 2, "x2": 8, "y2": 9, "xmin": 3, "ymin": 3, "xmax": 7, "ymax": 7}),
        ]
        for name, algo_id, p in presets:
            tk.Button(sidebar, text=f"• {name}", font=("Segoe UI", 8), bg="#1e293b", fg="#cbd5e1",
                      anchor="w", padx=4, pady=3, relief="flat", cursor="hand2",
                      command=lambda a=algo_id, params=p: self.load_preset(a, params)).pack(fill="x")

        # 2. CENTER VISUALIZATION CANVAS & CONTROLS
        center_frame = tk.Frame(main_container, bg="#090d16")
        center_frame.pack(side="left", fill="both", expand=True)

        canvas_wrapper = tk.Frame(center_frame, bg="#0f172a", bd=1, relief="solid")
        canvas_wrapper.pack(fill="both", expand=True)

        self.canvas = tk.Canvas(canvas_wrapper, bg="#0f172a", highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)

        self.grid = CoordinateGrid(self.canvas, width=640, height=480, cell_size=28)
        self.renderer = Renderer(self.grid)

        # Legend Bar
        legend_bar = tk.Frame(center_frame, bg="#0f172a", padx=10, pady=6)
        legend_bar.pack(fill="x", pady=(6, 0))

        legends = [
            ("● Start/End", "#ef4444"),
            ("■ Pixel", "#0284c7"),
            ("■ Current", "#38bdf8"),
            ("▢ Candidate", "#f59e0b"),
            ("□ Window", "#10b981"),
            ("━ Clipped Line", "#10b981")
        ]
        for text, color in legends:
            tk.Label(legend_bar, text=text, fg=color, bg="#0f172a", font=("Segoe UI", 8, "bold")).pack(side="left", padx=8)

        # Step Controls
        self.ctrl_panel = ControlPanel(
            center_frame,
            on_start=self.on_start,
            on_pause=self.on_pause,
            on_prev=self.on_prev,
            on_next=self.on_next,
            on_reset=self.on_reset,
            on_speed_change=self.on_speed_change,
            on_seek=self.on_seek
        )
        self.ctrl_panel.pack(fill="x", pady=(6, 0))

        # 3. RIGHT PANEL
        right_frame = tk.Frame(main_container, bg="#090d16", width=340)
        right_frame.pack(side="left", fill="both", padx=(10, 0))
        right_frame.pack_propagate(False)

        self.input_panel = InputPanel(right_frame, self.generate_steps)
        self.input_panel.pack(fill="x", pady=(0, 10))

        self.info_panel = InformationPanel(right_frame)
        self.info_panel.pack(fill="both", expand=True)

    def on_algorithm_select(self, algo_id):
        self.current_algo = algo_id
        for k, btn in self.sidebar_btns.items():
            btn.config(bg="#0284c7" if k == algo_id else "#334155")

        self.input_panel.rebuild_inputs(algo_id)
        self.input_panel.validate_and_generate()

    def load_preset(self, algo_id, params):
        self.on_algorithm_select(algo_id)
        for k, v in params.items():
            if k in self.input_panel.entries:
                self.input_panel.entries[k].delete(0, tk.END)
                self.input_panel.entries[k].insert(0, str(v))
        self.generate_steps(algo_id, params)

    def generate_steps(self, algo_id, params):
        self.animation.pause()

        if algo_id == "dda":
            gen = DDALine(params["x1"], params["y1"], params["x2"], params["y2"])
            self.step_data_list = gen.generate_steps()
            self.grid.set_bounds(min(params["x1"], params["x2"]), max(params["x1"], params["x2"]),
                                 min(params["y1"], params["y2"]), max(params["y1"], params["y2"]))
        elif algo_id == "bresenham":
            gen = BresenhamLine(params["x1"], params["y1"], params["x2"], params["y2"])
            self.step_data_list = gen.generate_steps()
            self.grid.set_bounds(min(params["x1"], params["x2"]), max(params["x1"], params["x2"]),
                                 min(params["y1"], params["y2"]), max(params["y1"], params["y2"]))
        elif algo_id == "circle":
            gen = MidpointCircle(params["cx"], params["cy"], params["radius"])
            self.step_data_list = gen.generate_steps()
            cx, cy, r = params["cx"], params["cy"], params["radius"]
            self.grid.set_bounds(cx - r, cx + r, cy - r, cy + r)
        elif algo_id == "cohen_sutherland":
            gen = CohenSutherland(params["x1"], params["y1"], params["x2"], params["y2"],
                                  params["xmin"], params["ymin"], params["xmax"], params["ymax"])
            self.step_data_list = gen.generate_steps()
            min_x = min(params["x1"], params["x2"], params["xmin"])
            max_x = max(params["x1"], params["x2"], params["xmax"])
            min_y = min(params["y1"], params["y2"], params["ymin"])
            max_y = max(params["y1"], params["y2"], params["ymax"])
            self.grid.set_bounds(min_x, max_x, min_y, max_y)

        self.animation.load_steps(self.step_data_list)
        total = len(self.step_data_list) - 1 if self.step_data_list else 0
        self.ctrl_panel.update_timeline(0, total)

    def on_step_change(self, step_data):
        self.grid.draw_grid()

        names = {
            "dda": "DDA Line Drawing",
            "bresenham": "Bresenham Line Drawing",
            "circle": "Midpoint Circle Drawing",
            "cohen_sutherland": "Cohen-Sutherland Line Clipping"
        }
        self.info_panel.update_info(names.get(self.current_algo, ""), step_data)
        self.ctrl_panel.update_timeline(step_data.get("step", 0), step_data.get("total_steps", 0))

        if self.current_algo == "dda":
            orig = self.step_data_list[0]
            last = self.step_data_list[-1]
            self.renderer.draw_ideal_line(orig["pixel"][0], orig["pixel"][1], last["pixel"][0], last["pixel"][1])
            self.renderer.render_dda_step(step_data)
            self.renderer.draw_endpoint(orig["pixel"][0], orig["pixel"][1], "P1")
            self.renderer.draw_endpoint(last["pixel"][0], last["pixel"][1], "P2")

        elif self.current_algo == "bresenham":
            orig = self.step_data_list[0]
            last = self.step_data_list[-1]
            self.renderer.draw_ideal_line(orig["pixel"][0], orig["pixel"][1], last["pixel"][0], last["pixel"][1])
            self.renderer.render_bresenham_step(step_data)
            self.renderer.draw_endpoint(orig["pixel"][0], orig["pixel"][1], "P1")
            self.renderer.draw_endpoint(last["pixel"][0], last["pixel"][1], "P2")

        elif self.current_algo == "circle":
            self.renderer.render_circle_step(step_data)
            if self.step_data_list:
                first = self.step_data_list[0]
                self.renderer.draw_endpoint(first.get("center", (0, 0))[0] if isinstance(first.get("center"), tuple) else 5, 5, "C", "#a855f7")

        elif self.current_algo == "cohen_sutherland":
            win = step_data.get("window", (0, 0, 10, 10))
            self.renderer.draw_clipping_window(win[0], win[1], win[2], win[3])
            self.renderer.render_clipping_step(step_data)

    def on_start(self):
        self.animation.start()

    def on_pause(self):
        self.animation.pause()

    def on_prev(self):
        self.animation.prev_step()

    def on_next(self):
        self.animation.next_step()

    def on_reset(self):
        self.animation.reset()

    def on_speed_change(self, val):
        self.animation.set_speed(val)

    def on_seek(self, step_idx):
        if 0 <= step_idx < len(self.step_data_list):
            self.animation.current_step = step_idx
            self.on_step_change(self.step_data_list[step_idx])
