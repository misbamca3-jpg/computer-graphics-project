"""
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
        """
        Calculates line points using the DDA formula:
        dx = x2 - x1
        dy = y2 - y1
        steps = max(|dx|, |dy|)
        x_inc = dx / steps
        y_inc = dy / steps
        """
        dx = self.x2 - self.x1
        dy = self.y2 - self.y1
        steps = max(abs(dx), abs(dy))

        if steps == 0:
            return [{
                "step": 0,
                "total_steps": 1,
                "x_float": self.x1,
                "y_float": self.y1,
                "pixel": (self.x1, self.y1),
                "dx": 0,
                "dy": 0,
                "x_inc": 0,
                "y_inc": 0,
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

            if i == 0:
                expl = f"Initial pixel ({px}, {py}). Total steps = {steps}, x_inc = {x_inc:.3f}, y_inc = {y_inc:.3f}"
            elif i == steps:
                expl = f"Endpoint ({px}, {py}) reached. Rasterization complete."
            else:
                expl = f"Step {i}: (x={cur_x:.2f}, y={cur_y:.2f}) rounded to ({px}, {py})"

            step_records.append({
                "step": i,
                "total_steps": steps,
                "x_float": round(cur_x, 3),
                "y_float": round(cur_y, 3),
                "pixel": (px, py),
                "dx": dx,
                "dy": dy,
                "x_inc": round(x_inc, 4),
                "y_inc": round(y_inc, 4),
                "explanation": expl,
                "pixels": list(accumulated_pixels)
            })

            cur_x += x_inc
            cur_y += y_inc

        return step_records
