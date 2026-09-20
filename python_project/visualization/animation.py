"""
Animation Controller for stepping through precomputed algorithm states.
"""

class AnimationController:
    def __init__(self, root, on_step_callback):
        self.root = root
        self.on_step_callback = on_step_callback
        self.steps = []
        self.current_step = 0
        self.is_running = False
        self.delay_ms = 400
        self._timer_id = None

    def load_steps(self, steps):
        self.pause()
        self.steps = steps
        self.current_step = 0
        if self.steps:
            self.on_step_callback(self.steps[0])

    def set_speed(self, mode):
        speeds = {"Slow": 800, "Medium": 400, "Fast": 150}
        self.delay_ms = speeds.get(mode, 400)

    def start(self):
        if not self.steps:
            return
        self.is_running = True
        self._schedule_next()

    def pause(self):
        self.is_running = False
        if self._timer_id:
            self.root.after_cancel(self._timer_id)
            self._timer_id = None

    def next_step(self):
        if not self.steps:
            return
        if self.current_step < len(self.steps) - 1:
            self.current_step += 1
            self.on_step_callback(self.steps[self.current_step])
        else:
            self.pause()

    def prev_step(self):
        if not self.steps:
            return
        if self.current_step > 0:
            self.current_step -= 1
            self.on_step_callback(self.steps[self.current_step])

    def reset(self):
        self.pause()
        self.current_step = 0
        if self.steps:
            self.on_step_callback(self.steps[0])

    def _schedule_next(self):
        if not self.is_running:
            return
        if self.current_step < len(self.steps) - 1:
            self.current_step += 1
            self.on_step_callback(self.steps[self.current_step])
            self._timer_id = self.root.after(self.delay_ms, self._schedule_next)
        else:
            self.pause()
