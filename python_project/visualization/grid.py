"""
Coordinate Grid Manager for Tkinter Canvas.
Translates logical cartesian coordinates (math space) to physical canvas pixels.
"""

class CoordinateGrid:
    def __init__(self, canvas, width=640, height=540, cell_size=28):
        self.canvas = canvas
        self.width = width
        self.height = height
        self.cell_size = cell_size
        self.origin_x = width // 2
        self.origin_y = height // 2

    def set_bounds(self, min_x, max_x, min_y, max_y):
        """Auto-scales and centers the grid around user points."""
        span_x = max(10, max_x - min_x + 4)
        span_y = max(10, max_y - min_y + 4)
        self.cell_size = max(16, min(42, int(min(self.width / span_x, self.height / span_y))))
        mid_x = (min_x + max_x) / 2
        mid_y = (min_y + max_y) / 2
        self.origin_x = int(self.width / 2 - mid_x * self.cell_size)
        self.origin_y = int(self.height / 2 + mid_y * self.cell_size)

    def to_canvas(self, math_x, math_y):
        """Converts math (x, y) to canvas (px, py). Math Y goes up, canvas Y goes down."""
        cx = self.origin_x + math_x * self.cell_size
        cy = self.origin_y - math_y * self.cell_size
        return cx, cy

    def draw_grid(self):
        self.canvas.delete("all")
        # Draw background
        self.canvas.create_rectangle(0, 0, self.width, self.height, fill="#0f172a", outline="")

        # Compute range of visible grid lines
        start_x = int(-self.origin_x // self.cell_size) - 1
        end_x = int((self.width - self.origin_x) // self.cell_size) + 2
        start_y = int((self.origin_y - self.height) // self.cell_size) - 1
        end_y = int(self.origin_y // self.cell_size) + 2

        # Vertical grid lines
        for gx in range(start_x, end_x):
            cx, _ = self.to_canvas(gx, 0)
            color = "#334155" if gx == 0 else "#1e293b"
            width = 2 if gx == 0 else 1
            self.canvas.create_line(cx, 0, cx, self.height, fill=color, width=width)
            if gx % 2 == 0 and gx != 0:
                self.canvas.create_text(cx, self.origin_y + 12, text=str(gx), fill="#64748b", font=("Consolas", 8))

        # Horizontal grid lines
        for gy in range(start_y, end_y):
            _, cy = self.to_canvas(0, gy)
            color = "#334155" if gy == 0 else "#1e293b"
            width = 2 if gy == 0 else 1
            self.canvas.create_line(0, cy, self.width, cy, fill=color, width=width)
            if gy % 2 == 0 and gy != 0:
                self.canvas.create_text(self.origin_x - 12, cy, text=str(gy), fill="#64748b", font=("Consolas", 8))

        # Axes arrows & Origin text
        self.canvas.create_text(self.origin_x - 10, self.origin_y + 12, text="(0,0)", fill="#94a3b8", font=("Consolas", 9, "bold"))
        self.canvas.create_text(self.width - 20, self.origin_y - 12, text="X →", fill="#38bdf8", font=("Consolas", 10, "bold"))
        self.canvas.create_text(self.origin_x + 16, 20, text="Y ↑", fill="#38bdf8", font=("Consolas", 10, "bold"))
