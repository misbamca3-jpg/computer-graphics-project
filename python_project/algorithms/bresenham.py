"""
Bresenham's Line Drawing Algorithm.
Uses integer-only decision parameters and supports all 8 octants.
"""

class BresenhamLine:
    def __init__(self, x1: int, y1: int, x2: int, y2: int):
        self.x1 = int(x1)
        self.y1 = int(y1)
        self.x2 = int(x2)
        self.y2 = int(y2)

    def generate_steps(self):
        dx = abs(self.x2 - self.x1)
        dy = abs(self.y2 - self.y1)
        sx = 1 if self.x1 < self.x2 else -1
        sy = 1 if self.y1 < self.y2 else -1

        is_steep = dy > dx
        num_steps = dy if is_steep else dx

        if num_steps == 0:
            return [{
                "step": 0,
                "total_steps": 0,
                "pixel": (self.x1, self.y1),
                "pk": 0,
                "candidate1": (self.x1, self.y1),
                "candidate2": (self.x1, self.y1),
                "selected": (self.x1, self.y1),
                "decision_cond": "Single Point",
                "explanation": f"Start and end points coincide at ({self.x1}, {self.y1}).",
                "pixels": [(self.x1, self.y1)]
            }]

        cur_x = self.x1
        cur_y = self.y1
        history = [(cur_x, cur_y)]
        step_records = []

        if not is_steep:
            # Shallow slope |m| <= 1: X is driving axis
            pk = 2 * dy - dx
            two_dy = 2 * dy
            two_dy_minus_two_dx = 2 * dy - 2 * dx

            step_records.append({
                "step": 0,
                "total_steps": num_steps,
                "pixel": (cur_x, cur_y),
                "pk": pk,
                "candidate1": (cur_x + sx, cur_y),
                "candidate2": (cur_x + sx, cur_y + sy),
                "selected": (cur_x, cur_y),
                "decision_cond": f"Initial p0 = 2*dy - dx = 2({dy}) - {dx} = {pk}",
                "explanation": f"Initial pixel plotted at ({cur_x}, {cur_y}). Driving axis is X. p0 = {pk}.",
                "pixels": list(history)
            })

            for i in range(1, num_steps + 1):
                cand_straight = (cur_x + sx, cur_y)
                cand_diagonal = (cur_x + sx, cur_y + sy)

                if pk < 0:
                    chosen = cand_straight
                    next_pk = pk + two_dy
                    cond_str = f"p_{i-1} = {pk} < 0 -> Select ({chosen[0]}, {chosen[1]})"
                    expl = f"pk is negative (< 0) -> Select horizontal neighbor. pk+1 = pk + 2dy = {pk} + {two_dy} = {next_pk}."
                else:
                    chosen = cand_diagonal
                    next_pk = pk + two_dy_minus_two_dx
                    cond_str = f"p_{i-1} = {pk} >= 0 -> Select ({chosen[0]}, {chosen[1]})"
                    expl = f"pk is >= 0 -> Select diagonal neighbor. pk+1 = pk + 2dy - 2dx = {pk} + ({two_dy_minus_two_dx}) = {next_pk}."

                cur_x, cur_y = chosen
                history.append((cur_x, cur_y))

                step_records.append({
                    "step": i,
                    "total_steps": num_steps,
                    "pixel": (cur_x, cur_y),
                    "pk": pk,
                    "pk_next": next_pk,
                    "candidate1": cand_straight,
                    "candidate2": cand_diagonal,
                    "selected": chosen,
                    "decision_cond": cond_str,
                    "explanation": expl,
                    "pixels": list(history)
                })
                pk = next_pk
        else:
            # Steep slope |m| > 1: Y is driving axis
            pk = 2 * dx - dy
            two_dx = 2 * dx
            two_dx_minus_two_dy = 2 * dx - 2 * dy

            step_records.append({
                "step": 0,
                "total_steps": num_steps,
                "pixel": (cur_x, cur_y),
                "pk": pk,
                "candidate1": (cur_x, cur_y + sy),
                "candidate2": (cur_x + sx, cur_y + sy),
                "selected": (cur_x, cur_y),
                "decision_cond": f"Initial p0 = 2*dx - dy = 2({dx}) - {dy} = {pk}",
                "explanation": f"Initial pixel plotted at ({cur_x}, {cur_y}). Driving axis is Y (steep). p0 = {pk}.",
                "pixels": list(history)
            })

            for i in range(1, num_steps + 1):
                cand_straight = (cur_x, cur_y + sy)
                cand_diagonal = (cur_x + sx, cur_y + sy)

                if pk < 0:
                    chosen = cand_straight
                    next_pk = pk + two_dx
                    cond_str = f"p_{i-1} = {pk} < 0 -> Select ({chosen[0]}, {chosen[1]})"
                    expl = f"pk is negative (< 0) -> Select vertical neighbor. pk+1 = pk + 2dx = {pk} + {two_dx} = {next_pk}."
                else:
                    chosen = cand_diagonal
                    next_pk = pk + two_dx_minus_two_dy
                    cond_str = f"p_{i-1} = {pk} >= 0 -> Select ({chosen[0]}, {chosen[1]})"
                    expl = f"pk is >= 0 -> Select diagonal neighbor. pk+1 = pk + 2dx - 2dy = {pk} + ({two_dx_minus_two_dy}) = {next_pk}."

                cur_x, cur_y = chosen
                history.append((cur_x, cur_y))

                step_records.append({
                    "step": i,
                    "total_steps": num_steps,
                    "pixel": (cur_x, cur_y),
                    "pk": pk,
                    "pk_next": next_pk,
                    "candidate1": cand_straight,
                    "candidate2": cand_diagonal,
                    "selected": chosen,
                    "decision_cond": cond_str,
                    "explanation": expl,
                    "pixels": list(history)
                })
                pk = next_pk

        return step_records
