import { TestCasePreset } from '../types';

export const TEST_CASE_PRESETS: TestCasePreset[] = [
  // DDA & Bresenham Line Presets
  {
    id: 'line-shallow-pos',
    name: 'Shallow Slope (0 < m < 1)',
    category: 'Line',
    algorithm: 'dda',
    description: 'Standard textbook case from (2, 2) to (8, 5) with slope m = 0.5.',
    params: { x1: 2, y1: 2, x2: 8, y2: 5 }
  },
  {
    id: 'line-steep-pos',
    name: 'Steep Slope (m > 1)',
    category: 'Line',
    algorithm: 'dda',
    description: 'Steep line from (2, 1) to (6, 10) with slope m = 2.25 where Y is driving axis.',
    params: { x1: 2, y1: 1, x2: 6, y2: 10 }
  },
  {
    id: 'line-horizontal',
    name: 'Horizontal Line (m = 0)',
    category: 'Line',
    algorithm: 'dda',
    description: 'Line from (1, 5) to (11, 5) with dx=10, dy=0, slope=0.',
    params: { x1: 1, y1: 5, x2: 11, y2: 5 }
  },
  {
    id: 'line-vertical',
    name: 'Vertical Line (m = ∞)',
    category: 'Line',
    algorithm: 'dda',
    description: 'Vertical line from (4, 1) to (4, 9) with dx=0, dy=8, undefined slope.',
    params: { x1: 4, y1: 1, x2: 4, y2: 9 }
  },
  {
    id: 'line-diagonal',
    name: 'Diagonal 45° (m = 1)',
    category: 'Line',
    algorithm: 'bresenham',
    description: 'Perfect diagonal from (1, 1) to (8, 8) where dx=dy and pk stays constant.',
    params: { x1: 1, y1: 1, x2: 8, y2: 8 }
  },
  {
    id: 'line-negative-shallow',
    name: 'Negative Shallow Slope (-1 < m < 0)',
    category: 'Line',
    algorithm: 'bresenham',
    description: 'Downward slope from (1, 8) to (9, 4) with dx=8, dy=-4.',
    params: { x1: 1, y1: 8, x2: 9, y2: 4 }
  },
  {
    id: 'line-negative-steep',
    name: 'Negative Steep Slope (m < -1)',
    category: 'Line',
    algorithm: 'bresenham',
    description: 'Steep downward line from (2, 10) to (5, 2) testing negative Y-stepping.',
    params: { x1: 2, y1: 10, x2: 5, y2: 2 }
  },

  // Circle Presets
  {
    id: 'circle-standard',
    name: 'Standard Circle (R = 4)',
    category: 'Circle',
    algorithm: 'circle',
    description: 'Classic university syllabus example: Center (5, 5), Radius 4.',
    params: { cx: 5, cy: 5, radius: 4 }
  },
  {
    id: 'circle-origin',
    name: 'Origin Centered (R = 6)',
    category: 'Circle',
    algorithm: 'circle',
    description: 'Centered at origin (0, 0), Radius 6 showing all 4 quadrants clearly.',
    params: { cx: 0, cy: 0, radius: 6 }
  },
  {
    id: 'circle-small',
    name: 'Small Compact Radius (R = 2)',
    category: 'Circle',
    algorithm: 'circle',
    description: 'Demonstrates quantization behavior on coarse pixel grids.',
    params: { cx: 4, cy: 4, radius: 2 }
  },
  {
    id: 'circle-large',
    name: 'High Precision Radius (R = 8)',
    category: 'Circle',
    algorithm: 'circle',
    description: 'Detailed 8-octant symmetric curve generation with 8 unit radius.',
    params: { cx: 8, cy: 8, radius: 8 }
  },

  // Cohen-Sutherland Clipping Presets
  {
    id: 'clip-partial',
    name: 'Partial Clip (Enters Left & Top)',
    category: 'Clipping',
    algorithm: 'cohen_sutherland',
    description: 'Line from (1, 2) to (8, 9) crossing window [3, 7] × [3, 7].',
    params: { x1: 1, y1: 2, x2: 8, y2: 9, xmin: 3, ymin: 3, xmax: 7, ymax: 7 }
  },
  {
    id: 'clip-trivial-accept',
    name: 'Trivial Accept (Completely Inside)',
    category: 'Clipping',
    algorithm: 'cohen_sutherland',
    description: 'Line from (3, 4) to (6, 6) inside window [2, 8] × [2, 8] (both codes 0000).',
    params: { x1: 3, y1: 4, x2: 6, y2: 6, xmin: 2, ymin: 2, xmax: 8, ymax: 8 }
  },
  {
    id: 'clip-trivial-reject',
    name: 'Trivial Reject (Completely Outside)',
    category: 'Clipping',
    algorithm: 'cohen_sutherland',
    description: 'Line from (1, 8) to (2, 10) above window [3, 7] × [2, 6] (codes share TOP bit).',
    params: { x1: 1, y1: 8, x2: 2, y2: 10, xmin: 3, ymin: 2, xmax: 7, ymax: 6 }
  },
  {
    id: 'clip-cross-corner',
    name: 'Diagonal Crossing All Boundaries',
    category: 'Clipping',
    algorithm: 'cohen_sutherland',
    description: 'Line from (0, 0) to (10, 10) through center window [3, 7] × [3, 7].',
    params: { x1: 0, y1: 0, x2: 10, y2: 10, xmin: 3, ymin: 3, xmax: 7, ymax: 7 }
  },
  {
    id: 'clip-boundary-touch',
    name: 'Boundary Touch',
    category: 'Clipping',
    algorithm: 'cohen_sutherland',
    description: 'Line segment touching the exact boundary edges at xmin and xmax.',
    params: { x1: 2, y1: 3, x2: 8, y2: 7, xmin: 2, ymin: 2, xmax: 8, ymax: 8 }
  }
];
