"""
Midpoint Circle Drawing Algorithm with 8-way symmetry.
Calculates coordinates for one octant and reflects across all 8 octants.
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
        if r == 0:
            return [{
                "step": 0,
                "total_steps": 0,
                "x": 0,
                "y": 0,
                "pk": 0,
                "symmetric_points": [(self.xc, self.yc)],
                "explanation": f"Radius is 0. Plotted center ({self.xc}, {self.yc}).",
                "pixels": [(self.xc, self.yc)]
            }]

        x = 0
        y = r
        pk = 1 - r

        # Count total steps
        sim_x, sim_y, sim_p = 0, r, 1 - r
        total_steps = 0
        while sim_x <= sim_y:
            total_steps += 1
            if sim_p < 0:
                sim_p += 2 * sim_x + 3
            else:
                sim_p += 2 * (sim_x - sim_y) + 5
                sim_y -= 1
            sim_x += 1
        total_steps -= 1

        step_records = []
        accumulated_pixels = set()
        step_idx = 0

        while x <= y:
            symm = self.get_symmetric_points(x, y)
            for pt in symm:
                accumulated_pixels.add(pt)

            if step_idx == 0:
                expl = f"Start at (0, R)=(0, {r}). Initial P0 = 1 - R = 1 - {r} = {pk}. Generated 8 symmetric points."
            elif pk < 0:
                next_pk = pk + 2 * x + 3
                expl = f"Step {step_idx}: P = {pk} < 0 (inside). Choose E (x+1, y)=({x+1}, {y}). Next P = P + 2x + 3 = {next_pk}."
            else:
                next_pk = pk + 2 * (x - y) + 5
                expl = f"Step {step_idx}: P = {pk} >= 0 (outside/on). Choose SE (x+1, y-1)=({x+1}, {y-1}). Next P = P + 2(x-y) + 5 = {next_pk}."

            if pk < 0:
                next_pk = pk + 2 * x + 3
                next_y = y
            else:
                next_pk = pk + 2 * (x - y) + 5
                next_y = y - 1

            step_records.append({
                "step": step_idx,
                "total_steps": total_steps,
                "x": x,
                "y": y,
                "pk": pk,
                "pk_next": next_pk,
                "symmetric_points": symm,
                "explanation": expl,
                "pixels": list(accumulated_pixels)
            })

            pk = next_pk
            x += 1
            y = next_y
            step_idx += 1

        return step_records
