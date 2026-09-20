"""
Test Suite for Graphics Algorithm Implementations.
Tests DDA, Bresenham, Midpoint Circle, and Cohen-Sutherland algorithms.
Run with: python test_cases.py
"""
from algorithms.dda import DDALine
from algorithms.bresenham import BresenhamLine
from algorithms.midpoint_circle import MidpointCircle
from algorithms.cohen_sutherland import CohenSutherland

def test_dda():
    print("Testing DDA Line...")
    dda = DDALine(2, 2, 8, 5)
    steps = dda.generate_steps()
    assert len(steps) == 7, f"Expected 7 steps, got {len(steps)}"
    assert steps[0]["pixel"] == (2, 2)
    assert steps[-1]["pixel"] == (8, 5)
    print("✓ DDA Line Passed!")

def test_bresenham():
    print("Testing Bresenham Line...")
    b_shallow = BresenhamLine(2, 2, 8, 5)
    steps = b_shallow.generate_steps()
    assert steps[0]["pixel"] == (2, 2)
    assert steps[-1]["pixel"] == (8, 5)
    
    b_steep = BresenhamLine(2, 1, 5, 9)
    steep_steps = b_steep.generate_steps()
    assert steep_steps[-1]["pixel"] == (5, 9)
    print("✓ Bresenham Line Passed!")

def test_circle():
    print("Testing Midpoint Circle...")
    circ = MidpointCircle(5, 5, 4)
    steps = circ.generate_steps()
    assert len(steps) > 0
    assert steps[0]["x"] == 0 and steps[0]["y"] == 4
    print("✓ Midpoint Circle Passed!")

def test_cohen_sutherland():
    print("Testing Cohen-Sutherland...")
    cs = CohenSutherland(1, 2, 8, 9, 3, 3, 7, 7)
    steps = cs.generate_steps()
    assert steps[-1]["action"] in ["ACCEPT", "REJECT"]
    print("✓ Cohen-Sutherland Passed!")

if __name__ == "__main__":
    test_dda()
    test_bresenham()
    test_circle()
    test_cohen_sutherland()
    print("\nAll 4 Core Algorithm Unit Tests Passed Successfully!")
