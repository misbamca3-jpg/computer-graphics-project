"""
Information and Educational Math Panel for Tkinter.
Displays current step, coordinates, decision parameters, intermediate equations, and status explanations.
"""
import tkinter as tk

class InformationPanel(tk.LabelFrame):
    def __init__(self, parent):
        super().__init__(parent, text="Algorithm Telemetry & State", bg="#1e293b", fg="#e2e8f0", font=("Segoe UI", 10, "bold"), padx=12, pady=10)
        self._build_ui()

    def _build_ui(self):
        lbl_style = {"bg": "#1e293b", "fg": "#94a3b8", "font": ("Segoe UI", 9)}
        val_style = {"bg": "#1e293b", "fg": "#38bdf8", "font": ("Consolas", 10, "bold")}

        # Algorithm Name
        self.lbl_algo_title = tk.Label(self, text="DDA Line Drawing Algorithm", bg="#1e293b", fg="#f8fafc", font=("Segoe UI", 11, "bold"), anchor="w")
        self.lbl_algo_title.pack(fill="x", pady=(0, 6))

        # Status Banner
        self.status_box = tk.Label(self, text="Status: Ready", bg="#0f172a", fg="#10b981", font=("Segoe UI", 9, "italic"),
                                   padx=8, pady=4, anchor="w", relief="sunken")
        self.status_box.pack(fill="x", pady=4)

        # Math Grid
        grid_frame = tk.Frame(self, bg="#1e293b")
        grid_frame.pack(fill="x", pady=6)

        tk.Label(grid_frame, text="Current Step:", **lbl_style).grid(row=0, column=0, sticky="w", pady=2)
        self.val_step = tk.Label(grid_frame, text="-", **val_style)
        self.val_step.grid(row=0, column=1, sticky="w", padx=10)

        tk.Label(grid_frame, text="Current Coordinates:", **lbl_style).grid(row=1, column=0, sticky="w", pady=2)
        self.val_coords = tk.Label(grid_frame, text="-", **val_style)
        self.val_coords.grid(row=1, column=1, sticky="w", padx=10)

        tk.Label(grid_frame, text="Intermediate Values:", **lbl_style).grid(row=2, column=0, sticky="w", pady=2)
        self.val_intermediate = tk.Label(grid_frame, text="-", **val_style)
        self.val_intermediate.grid(row=2, column=1, sticky="w", padx=10)

        tk.Label(grid_frame, text="Decision Parameter:", **lbl_style).grid(row=3, column=0, sticky="w", pady=2)
        self.val_decision = tk.Label(grid_frame, text="-", **val_style)
        self.val_decision.grid(row=3, column=1, sticky="w", padx=10)

        # Detailed step explanation
        tk.Label(self, text="Step Explanation:", **lbl_style).pack(anchor="w", pady=(8, 2))
        self.txt_explanation = tk.Text(self, height=5, width=32, bg="#0f172a", fg="#cbd5e1", font=("Consolas", 9),
                                       wrap="word", relief="flat", padx=6, pady=6)
        self.txt_explanation.pack(fill="both", expand=True)

    def update_info(self, algo_name, step_data):
        self.lbl_algo_title.config(text=algo_name)
        step = step_data.get("step", 0)
        total = step_data.get("total_steps", 0)
        self.val_step.config(text=f"{step} / {total}")

        # Coordinates
        if "pixel" in step_data:
            px, py = step_data["pixel"]
            self.val_coords.config(text=f"x = {px}, y = {py}")
        elif "p1" in step_data and "p2" in step_data:
            p1 = step_data["p1"]
            p2 = step_data["p2"]
            self.val_coords.config(text=f"P1({p1[0]:.1f},{p1[1]:.1f}) P2({p2[0]:.1f},{p2[1]:.1f})")
        else:
            self.val_coords.config(text="-")

        # Intermediate values
        if "dx" in step_data and "dy" in step_data:
            dx = step_data["dx"]
            dy = step_data["dy"]
            x_inc = step_data.get("x_inc", "-")
            y_inc = step_data.get("y_inc", "-")
            self.val_intermediate.config(text=f"dx={dx}, dy={dy} | inc=({x_inc}, {y_inc})")
        elif "code1" in step_data:
            self.val_intermediate.config(text=f"Code1={step_data['code1']} | Code2={step_data['code2']}")
        else:
            self.val_intermediate.config(text="-")

        # Decision parameter
        if "pk" in step_data:
            pk = step_data["pk"]
            pk_next = step_data.get("pk_next", "-")
            self.val_decision.config(text=f"p = {pk} (next: {pk_next})")
        elif "action" in step_data:
            self.val_decision.config(text=f"Action: {step_data['action']}")
        else:
            self.val_decision.config(text="N/A (Rounding)")

        # Status & Explanation
        expl = step_data.get("explanation", "Processing step...")
        self.status_box.config(text=f"Status: Step {step} Active")
        self.txt_explanation.delete("1.0", tk.END)
        self.txt_explanation.insert(tk.END, expl)
