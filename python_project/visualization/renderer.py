"""
Graphics Renderer for algorithm steps on coordinate grid.
Renders raster pixels, candidates, symmetry octants, clipping boxes, and guide lines.
"""

class Renderer:
    def __init__(self, grid):
        self.grid = grid
        self.canvas = grid.canvas

    def draw_pixel_box(self, x, y, fill_color="#38bdf8", outline_color="#0284c7", tag="pixels"):
        """Draws a rasterized pixel as a filled cell with centered label."""
        cx, cy = self.grid.to_canvas(x, y)
        half = self.grid.cell_size / 2 - 1.5
        item = self.canvas.create_rectangle(
            cx - half, cy - half, cx + half, cy + half,
            fill=fill_color, outline=outline_color, width=1.5, tags=tag
        )
        # Pixel center indicator
        dot = self.canvas.create_oval(cx - 2, cy - 2, cx + 2, cy + 2, fill="#ffffff", outline="", tags=tag)
        return item

    def draw_candidate_pixel(self, x, y, label="C"):
        cx, cy = self.grid.to_canvas(x, y)
        half = self.grid.cell_size / 2 - 2
        self.canvas.create_rectangle(
            cx - half, cy - half, cx + half, cy + half,
            fill="", outline="#f59e0b", width=2, dash=(3, 3), tags="candidates"
        )
        self.canvas.create_text(cx, cy, text=label, fill="#f59e0b", font=("Consolas", 8, "bold"), tags="candidates")

    def draw_endpoint(self, x, y, label="P", color="#ef4444"):
        cx, cy = self.grid.to_canvas(x, y)
        self.canvas.create_oval(cx - 6, cy - 6, cx + 6, cy + 6, fill=color, outline="#ffffff", width=2, tags="endpoints")
        self.canvas.create_text(cx + 12, cy - 10, text=f"{label}({x},{y})", fill="#f8fafc", font=("Consolas", 9, "bold"), tags="endpoints")

    def draw_ideal_line(self, x1, y1, x2, y2, color="#475569"):
        cx1, cy1 = self.grid.to_canvas(x1, y1)
        cx2, cy2 = self.grid.to_canvas(x2, y2)
        self.canvas.create_line(cx1, cy1, cx2, cy2, fill=color, width=2, dash=(4, 4), tags="ideal_line")

    def draw_clipping_window(self, xmin, ymin, xmax, ymax):
        c_tl_x, c_tl_y = self.grid.to_canvas(xmin, ymax)
        c_br_x, c_br_y = self.grid.to_canvas(xmax, ymin)
        # Window fill and border
        self.canvas.create_rectangle(
            c_tl_x, c_tl_y, c_br_x, c_br_y,
            fill="#1e293b", stipple="gray25", outline="#10b981", width=2.5, tags="clip_window"
        )
        # Corner labels
        self.canvas.create_text(c_tl_x + 10, c_tl_y + 10, text=f"({xmin},{ymax})", fill="#10b981", font=("Consolas", 8), tags="clip_window")
        self.canvas.create_text(c_br_x - 10, c_br_y - 10, text=f"({xmax},{ymin})", fill="#10b981", font=("Consolas", 8), tags="clip_window")

    def render_dda_step(self, step_data):
        self.canvas.delete("pixels")
        self.canvas.delete("candidates")
        for px, py in step_data.get("pixels", []):
            self.draw_pixel_box(px, py, fill_color="#0284c7", outline_color="#38bdf8")
        cur_px, cur_py = step_data.get("pixel", (0, 0))
        self.draw_pixel_box(cur_px, cur_py, fill_color="#38bdf8", outline_color="#ffffff")

    def render_bresenham_step(self, step_data):
        self.canvas.delete("pixels")
        self.canvas.delete("candidates")
        for px, py in step_data.get("pixels", []):
            self.draw_pixel_box(px, py, fill_color="#059669", outline_color="#34d399")
        cur_px, cur_py = step_data.get("pixel", (0, 0))
        self.draw_pixel_box(cur_px, cur_py, fill_color="#10b981", outline_color="#ffffff")

        # Render candidates if available
        c1 = step_data.get("candidate1")
        c2 = step_data.get("candidate2")
        if c1 and c1 != (cur_px, cur_py):
            self.draw_candidate_pixel(c1[0], c1[1], "C1")
        if c2 and c2 != (cur_px, cur_py):
            self.draw_candidate_pixel(c2[0], c2[1], "C2")

    def render_circle_step(self, step_data):
        self.canvas.delete("pixels")
        for px, py in step_data.get("pixels", []):
            self.draw_pixel_box(px, py, fill_color="#7c3aed", outline_color="#a78bfa")
        for px, py in step_data.get("symmetric_points", []):
            self.draw_pixel_box(px, py, fill_color="#c084fc", outline_color="#ffffff")

    def render_clipping_step(self, step_data):
        self.canvas.delete("clipping_lines")
        orig = step_data.get("original_line")
        if orig:
            c1x, c1y = self.grid.to_canvas(orig[0][0], orig[0][1])
            c2x, c2y = self.grid.to_canvas(orig[1][0], orig[1][1])
            self.canvas.create_line(c1x, c1y, c2x, c2y, fill="#475569", width=2, dash=(4, 4), tags="clipping_lines")

        # Rejected segments (Red)
        for seg in step_data.get("rejected_segments", []):
            s1x, s1y = self.grid.to_canvas(seg[0][0], seg[0][1])
            s2x, s2y = self.grid.to_canvas(seg[1][0], seg[1][1])
            self.canvas.create_line(s1x, s1y, s2x, s2y, fill="#ef4444", width=3, dash=(2, 2), tags="clipping_lines")

        # Current or accepted segment
        p1 = step_data.get("p1")
        p2 = step_data.get("p2")
        acc = step_data.get("accepted_segment")
        if acc:
            ax1, ay1 = self.grid.to_canvas(acc[0][0], acc[0][1])
            ax2, ay2 = self.grid.to_canvas(acc[1][0], acc[1][1])
            self.canvas.create_line(ax1, ay1, ax2, ay2, fill="#10b981", width=5, tags="clipping_lines")
        elif p1 and p2:
            s1x, s1y = self.grid.to_canvas(p1[0], p1[1])
            s2x, s2y = self.grid.to_canvas(p2[0], p2[1])
            self.canvas.create_line(s1x, s1y, s2x, s2y, fill="#f59e0b", width=3, tags="clipping_lines")
