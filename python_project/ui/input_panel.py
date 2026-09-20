"""
Dynamic Input Panel for Tkinter.
Renders inputs corresponding to the active algorithm with error validation.
"""
import tkinter as tk
from tkinter import messagebox

class InputPanel(tk.LabelFrame):
    def __init__(self, parent, on_generate_callback):
        super().__init__(parent, text="Algorithm Parameters", bg="#1e293b", fg="#e2e8f0", font=("Segoe UI", 10, "bold"), padx=10, pady=8)
        self.on_generate_callback = on_generate_callback
        self.current_algo = "dda"
        self.entries = {}
        self.container = tk.Frame(self, bg="#1e293b")
        self.container.pack(fill="both", expand=True)
        self.rebuild_inputs("dda")

    def rebuild_inputs(self, algo_id):
        self.current_algo = algo_id
        for widget in self.container.winfo_children():
            widget.destroy()
        self.entries.clear()

        lbl_style = {"bg": "#1e293b", "fg": "#94a3b8", "font": ("Segoe UI", 9)}
        entry_style = {"bg": "#0f172a", "fg": "#f8fafc", "insertbackground": "white", "width": 6, "font": ("Consolas", 10)}

        if algo_id in ["dda", "bresenham"]:
            row1 = tk.Frame(self.container, bg="#1e293b")
            row1.pack(fill="x", pady=2)
            tk.Label(row1, text="Start Point (X1, Y1):", **lbl_style).pack(side="left")
            self.entries["x1"] = tk.Entry(row1, **entry_style)
            self.entries["x1"].insert(0, "2")
            self.entries["x1"].pack(side="left", padx=4)
            self.entries["y1"] = tk.Entry(row1, **entry_style)
            self.entries["y1"].insert(0, "2")
            self.entries["y1"].pack(side="left", padx=4)

            row2 = tk.Frame(self.container, bg="#1e293b")
            row2.pack(fill="x", pady=2)
            tk.Label(row2, text="End Point (X2, Y2):  ", **lbl_style).pack(side="left")
            self.entries["x2"] = tk.Entry(row2, **entry_style)
            self.entries["x2"].insert(0, "8")
            self.entries["x2"].pack(side="left", padx=4)
            self.entries["y2"] = tk.Entry(row2, **entry_style)
            self.entries["y2"].insert(0, "5")
            self.entries["y2"].pack(side="left", padx=4)

        elif algo_id == "circle":
            row1 = tk.Frame(self.container, bg="#1e293b")
            row1.pack(fill="x", pady=2)
            tk.Label(row1, text="Center (Xc, Yc):", **lbl_style).pack(side="left")
            self.entries["cx"] = tk.Entry(row1, **entry_style)
            self.entries["cx"].insert(0, "5")
            self.entries["cx"].pack(side="left", padx=4)
            self.entries["cy"] = tk.Entry(row1, **entry_style)
            self.entries["cy"].insert(0, "5")
            self.entries["cy"].pack(side="left", padx=4)

            row2 = tk.Frame(self.container, bg="#1e293b")
            row2.pack(fill="x", pady=2)
            tk.Label(row2, text="Radius (R):       ", **lbl_style).pack(side="left")
            self.entries["radius"] = tk.Entry(row2, **entry_style)
            self.entries["radius"].insert(0, "4")
            self.entries["radius"].pack(side="left", padx=4)

        elif algo_id == "cohen_sutherland":
            row1 = tk.Frame(self.container, bg="#1e293b")
            row1.pack(fill="x", pady=2)
            tk.Label(row1, text="Line (X1,Y1) - (X2,Y2):", **lbl_style).pack(side="left")
            for k, val in [("x1", "1"), ("y1", "2"), ("x2", "8"), ("y2", "9")]:
                self.entries[k] = tk.Entry(row1, **entry_style)
                self.entries[k].insert(0, val)
                self.entries[k].pack(side="left", padx=2)

            row2 = tk.Frame(self.container, bg="#1e293b")
            row2.pack(fill="x", pady=2)
            tk.Label(row2, text="Window [Xmin,Ymin,Xmax,Ymax]:", **lbl_style).pack(side="left")
            for k, val in [("xmin", "3"), ("ymin", "3"), ("xmax", "7"), ("ymax", "7")]:
                self.entries[k] = tk.Entry(row2, **entry_style)
                self.entries[k].insert(0, val)
                self.entries[k].pack(side="left", padx=2)

        # Generate Button
        btn_frame = tk.Frame(self.container, bg="#1e293b")
        btn_frame.pack(fill="x", pady=6)
        tk.Button(btn_frame, text="⚡ Generate Steps", bg="#0284c7", fg="white", font=("Segoe UI", 9, "bold"),
                  command=self.validate_and_generate, cursor="hand2").pack(side="right", padx=4)

    def validate_and_generate(self):
        try:
            params = {}
            for k, entry in self.entries.items():
                val = entry.get().strip()
                if val == "":
                    messagebox.showerror("Invalid Input", f"Field '{k}' cannot be empty.")
                    return
                params[k] = float(val)

            # Specific domain validations
            if self.current_algo == "circle":
                if params["radius"] <= 0:
                    messagebox.showerror("Invalid Input", "Circle radius must be greater than 0.")
                    return
            elif self.current_algo == "cohen_sutherland":
                if params["xmin"] >= params["xmax"] or params["ymin"] >= params["ymax"]:
                    messagebox.showerror("Invalid Input", "Invalid clipping window: ensure Xmin < Xmax and Ymin < Ymax.")
                    return

            self.on_generate_callback(self.current_algo, params)
        except ValueError:
            messagebox.showerror("Invalid Input", "Please enter valid numeric coordinates.")
