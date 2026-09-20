"""
Playback and Step Control Panel for Tkinter.
Includes: Start, Pause, Previous, Next, Reset, Speed selector, and Step Slider.
"""
import tkinter as tk
from tkinter import ttk

class ControlPanel(tk.Frame):
    def __init__(self, parent, on_start, on_pause, on_prev, on_next, on_reset, on_speed_change, on_seek):
        super().__init__(parent, bg="#1e293b", padx=10, pady=8)
        self.on_start = on_start
        self.on_pause = on_pause
        self.on_prev = on_prev
        self.on_next = on_next
        self.on_reset = on_reset
        self.on_speed_change = on_speed_change
        self.on_seek = on_seek

        self._build_ui()

    def _build_ui(self):
        btn_style = {"font": ("Segoe UI", 9, "bold"), "padx": 8, "pady": 4, "relief": "flat", "cursor": "hand2"}

        # Buttons row
        btn_frame = tk.Frame(self, bg="#1e293b")
        btn_frame.pack(side="left", fill="y")

        self.btn_start = tk.Button(btn_frame, text="▶ Start", bg="#0284c7", fg="white", command=self.on_start, **btn_style)
        self.btn_start.pack(side="left", padx=3)

        self.btn_pause = tk.Button(btn_frame, text="⏸ Pause", bg="#475569", fg="white", command=self.on_pause, **btn_style)
        self.btn_pause.pack(side="left", padx=3)

        self.btn_prev = tk.Button(btn_frame, text="⏮ Prev", bg="#334155", fg="white", command=self.on_prev, **btn_style)
        self.btn_prev.pack(side="left", padx=3)

        self.btn_next = tk.Button(btn_frame, text="⏭ Next", bg="#0284c7", fg="white", command=self.on_next, **btn_style)
        self.btn_next.pack(side="left", padx=3)

        self.btn_reset = tk.Button(btn_frame, text="↻ Reset", bg="#ef4444", fg="white", command=self.on_reset, **btn_style)
        self.btn_reset.pack(side="left", padx=3)

        # Speed Dropdown
        speed_frame = tk.Frame(self, bg="#1e293b")
        speed_frame.pack(side="left", padx=15)
        tk.Label(speed_frame, text="Speed:", bg="#1e293b", fg="#94a3b8", font=("Segoe UI", 9)).pack(side="left", padx=2)

        self.speed_var = tk.StringVar(value="Medium")
        self.speed_combo = ttk.Combobox(speed_frame, textvariable=self.speed_var, values=["Slow", "Medium", "Fast"], width=7, state="readonly")
        self.speed_combo.pack(side="left")
        self.speed_combo.bind("<<ComboboxSelected>>", lambda e: self.on_speed_change(self.speed_var.get()))

        # Timeline Slider & Step indicator
        timeline_frame = tk.Frame(self, bg="#1e293b")
        timeline_frame.pack(side="right", fill="x", expand=True, padx=10)

        self.step_label = tk.Label(timeline_frame, text="Step: 0 / 0", bg="#1e293b", fg="#38bdf8", font=("Consolas", 10, "bold"), width=14)
        self.step_label.pack(side="right", padx=5)

        self.slider = tk.Scale(timeline_frame, from_=0, to=10, orient="horizontal", bg="#1e293b", fg="#e2e8f0",
                               highlightthickness=0, troughcolor="#334155", activebackground="#38bdf8", command=self._slider_moved)
        self.slider.pack(side="right", fill="x", expand=True)

    def _slider_moved(self, val):
        self.on_seek(int(val))

    def update_timeline(self, current_step, total_steps):
        self.slider.config(to=max(1, total_steps))
        self.slider.set(current_step)
        self.step_label.config(text=f"Step: {current_step} / {total_steps}")
