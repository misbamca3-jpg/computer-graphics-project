"""
Cohen-Sutherland Line Clipping Algorithm with 4-bit region outcodes.
"""

INSIDE = 0  # 0000
LEFT = 1    # 0001
RIGHT = 2   # 0010
BOTTOM = 4  # 0100
TOP = 8     # 1000

def compute_outcode(x, y, xmin, ymin, xmax, ymax):
    code = INSIDE
    if x < xmin:
        code |= LEFT
    elif x > xmax:
        code |= RIGHT
    if y < ymin:
        code |= BOTTOM
    elif y > ymax:
        code |= TOP
    return code

def to_binary4(code):
    return f"{code:04b}"

class CohenSutherland:
    def __init__(self, x1, y1, x2, y2, xmin, ymin, xmax, ymax):
        self.x1 = float(x1)
        self.y1 = float(y1)
        self.x2 = float(x2)
        self.y2 = float(y2)
        self.xmin = float(xmin)
        self.ymin = float(ymin)
        self.xmax = float(xmax)
        self.ymax = float(ymax)

    def generate_steps(self):
        steps = []
        cur_x1, cur_y1 = self.x1, self.y1
        cur_x2, cur_y2 = self.x2, self.y2

        code1 = compute_outcode(cur_x1, cur_y1, self.xmin, self.ymin, self.xmax, self.ymax)
        code2 = compute_outcode(cur_x2, cur_y2, self.xmin, self.ymin, self.xmax, self.ymax)

        step_idx = 0
        original_line = ((self.x1, self.y1), (self.x2, self.y2))
        window = (self.xmin, self.ymin, self.xmax, self.ymax)
        rejected_segments = []

        steps.append({
            "step": 0,
            "p1": (cur_x1, cur_y1),
            "p2": (cur_x2, cur_y2),
            "code1": to_binary4(code1),
            "code2": to_binary4(code2),
            "action": "EVALUATE",
            "explanation": f"Initial line P1({cur_x1}, {cur_y1}) [{to_binary4(code1)}] to P2({cur_x2}, {cur_y2}) [{to_binary4(code2)}]. Window: [{self.xmin}, {self.xmax}] x [{self.ymin}, {self.ymax}].",
            "original_line": original_line,
            "window": window,
            "accepted_segment": None,
            "rejected_segments": list(rejected_segments)
        })

        done = False
        max_iters = 8

        while not done and max_iters > 0:
            max_iters -= 1
            step_idx += 1

            if (code1 | code2) == 0:
                # Trivial accept
                done = True
                steps.append({
                    "step": step_idx,
                    "p1": (cur_x1, cur_y1),
                    "p2": (cur_x2, cur_y2),
                    "code1": to_binary4(code1),
                    "code2": to_binary4(code2),
                    "action": "ACCEPT",
                    "explanation": f"Trivial ACCEPT: Both codes are 0000. Line segment from ({cur_x1:.2f}, {cur_y1:.2f}) to ({cur_x2:.2f}, {cur_y2:.2f}) is visible.",
                    "original_line": original_line,
                    "window": window,
                    "accepted_segment": ((cur_x1, cur_y1), (cur_x2, cur_y2)),
                    "rejected_segments": list(rejected_segments)
                })
                break

            if (code1 & code2) != 0:
                # Trivial reject
                done = True
                rejected_segments.append(((cur_x1, cur_y1), (cur_x2, cur_y2)))
                steps.append({
                    "step": step_idx,
                    "p1": (cur_x1, cur_y1),
                    "p2": (cur_x2, cur_y2),
                    "code1": to_binary4(code1),
                    "code2": to_binary4(code2),
                    "action": "REJECT",
                    "explanation": f"Trivial REJECT: Logical AND ({to_binary4(code1 & code2)}) != 0. Both points share an exterior region.",
                    "original_line": original_line,
                    "window": window,
                    "accepted_segment": None,
                    "rejected_segments": list(rejected_segments)
                })
                break

            # Clip against boundary
            code_out = code1 if code1 != 0 else code2
            is_p1 = (code1 != 0)
            dx = cur_x2 - cur_x1
            dy = cur_y2 - cur_y1

            if code_out & TOP:
                boundary = "TOP"
                iy = self.ymax
                ix = cur_x1 + (dx * (self.ymax - cur_y1)) / dy
            elif code_out & BOTTOM:
                boundary = "BOTTOM"
                iy = self.ymin
                ix = cur_x1 + (dx * (self.ymin - cur_y1)) / dy
            elif code_out & RIGHT:
                boundary = "RIGHT"
                ix = self.xmax
                iy = cur_y1 + (dy * (self.xmax - cur_x1)) / dx
            elif code_out & LEFT:
                boundary = "LEFT"
                ix = self.xmin
                iy = cur_y1 + (dy * (self.xmin - cur_x1)) / dx

            old_pt = (cur_x1, cur_y1) if is_p1 else (cur_x2, cur_y2)
            new_pt = (round(ix, 2), round(iy, 2))
            rejected_segments.append((old_pt, new_pt))

            if is_p1:
                cur_x1, cur_y1 = new_pt
                code1 = compute_outcode(cur_x1, cur_y1, self.xmin, self.ymin, self.xmax, self.ymax)
            else:
                cur_x2, cur_y2 = new_pt
                code2 = compute_outcode(cur_x2, cur_y2, self.xmin, self.ymin, self.xmax, self.ymax)

            steps.append({
                "step": step_idx,
                "p1": (cur_x1, cur_y1),
                "p2": (cur_x2, cur_y2),
                "code1": to_binary4(code1),
                "code2": to_binary4(code2),
                "action": "CLIP",
                "boundary": boundary,
                "intersection": new_pt,
                "explanation": f"Clipped against {boundary} boundary. P{1 if is_p1 else 2} moved to intersection ({new_pt[0]}, {new_pt[1]}). New code: {to_binary4(code1 if is_p1 else code2)}.",
                "original_line": original_line,
                "window": window,
                "accepted_segment": None,
                "rejected_segments": list(rejected_segments)
            })

        total = len(steps) - 1
        for s in steps:
            s["total_steps"] = total
        return steps
