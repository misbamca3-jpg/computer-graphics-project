export type AlgorithmId = 'dda' | 'bresenham' | 'circle' | 'cohen_sutherland' | 'liang_barsky';

export type ActiveView = 'home' | 'visualizer' | 'comparison' | 'guide' | 'python_code' | 'about';

export interface Point2D {
  x: number;
  y: number;
}

export interface PixelCoord {
  x: number;
  y: number;
  label?: string;
  color?: string;
  isCandidate?: boolean;
  symmetricGroup?: number;
}

export interface DDAStepState {
  step: number;
  totalSteps: number;
  xFloat: number;
  yFloat: number;
  xPixel: number;
  yPixel: number;
  dx: number;
  dy: number;
  xInc: number;
  yInc: number;
  slope: number | string;
  explanation: string;
  historyPixels: PixelCoord[];
}

export interface BresenhamStepState {
  step: number;
  totalSteps: number;
  x: number;
  y: number;
  pk: number;
  pkNext?: number;
  dx: number;
  dy: number;
  twoDy: number;
  twoDyMinusTwoDx: number;
  decisionCondition: string;
  chosenCandidate: 'East' | 'North-East' | 'Step-X' | 'Step-Y' | 'Diagonal' | 'Straight';
  candidate1: PixelCoord;
  candidate2: PixelCoord;
  explanation: string;
  historyPixels: PixelCoord[];
}

export interface CircleSymmetricPoints {
  octant1: Point2D; // (xc + x, yc + y)
  octant2: Point2D; // (xc - x, yc + y)
  octant3: Point2D; // (xc + x, yc - y)
  octant4: Point2D; // (xc - x, yc - y)
  octant5: Point2D; // (xc + y, yc + x)
  octant6: Point2D; // (xc - y, yc + x)
  octant7: Point2D; // (xc + y, yc - x)
  octant8: Point2D; // (xc - y, yc - x)
}

export interface CircleStepState {
  step: number;
  totalSteps: number;
  x: number;
  y: number;
  pk: number;
  pkNext?: number;
  center: Point2D;
  radius: number;
  symmetricPoints: CircleSymmetricPoints;
  explanation: string;
  historyPixels: PixelCoord[];
}

export interface ClippingRect {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface CohenSutherlandStepState {
  step: number;
  totalSteps: number;
  p1: Point2D;
  p2: Point2D;
  code1: string; // 4-bit binary
  code2: string;
  code1Val: number;
  code2Val: number;
  action: 'EVALUATE' | 'ACCEPT' | 'REJECT' | 'CLIP';
  clippedPointIndex?: 1 | 2;
  intersectionPoint?: Point2D;
  boundaryTested?: 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP';
  explanation: string;
  finalLine?: { p1: Point2D; p2: Point2D } | null;
  originalLine: { p1: Point2D; p2: Point2D };
  clippingWindow: ClippingRect;
  rejectedSegments: Array<{ p1: Point2D; p2: Point2D }>;
  acceptedSegment?: { p1: Point2D; p2: Point2D } | null;
}

export interface LiangBarskyStepState {
  step: number;
  totalSteps: number;
  p1: Point2D;
  p2: Point2D;
  dx: number;
  dy: number;
  currentEdge: 'LEFT' | 'RIGHT' | 'BOTTOM' | 'TOP' | 'FINAL';
  p: number;
  q: number;
  r: number;
  u1: number;
  u2: number;
  explanation: string;
  originalLine: { p1: Point2D; p2: Point2D };
  clippingWindow: ClippingRect;
  acceptedSegment?: { p1: Point2D; p2: Point2D } | null;
  rejected: boolean;
}

export type AlgorithmStep = 
  | { type: 'dda'; data: DDAStepState }
  | { type: 'bresenham'; data: BresenhamStepState }
  | { type: 'circle'; data: CircleStepState }
  | { type: 'cohen_sutherland'; data: CohenSutherlandStepState }
  | { type: 'liang_barsky'; data: LiangBarskyStepState };

export interface AlgorithmInputParams {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  radius: number;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface TestCasePreset {
  id: string;
  name: string;
  category: string;
  algorithm: AlgorithmId;
  description: string;
  params: Partial<AlgorithmInputParams>;
}
