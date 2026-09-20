"""
Graphics Algorithm Visualizer
Entry Point for Python Tkinter Desktop Application.
Usage:
    python main.py
"""
import sys
import os

# Ensure python_project root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ui.main_window import MainWindow

def main():
    try:
        app = MainWindow()
        app.mainloop()
    except Exception as e:
        print(f"Error launching application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
