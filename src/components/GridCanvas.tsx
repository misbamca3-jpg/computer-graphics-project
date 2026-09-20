import React, { useRef, useEffect, useState, useMemo } from 'react';
import { AlgorithmId, AlgorithmStep, PixelCoord, Point2D } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

interface GridCanvasProps {
  algorithm: AlgorithmId;
  currentStepData: AlgorithmStep | null;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
  algorithm,
  currentStepData,
  minX = 0,
  maxX = 12,
  minY = 0,
  maxY = 12
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Auto calculate grid bounds based on data
  const bounds = useMemo(() => {
    let lowX = minX;
    let highX = maxX;
    let lowY = minY;
    let highY = maxY;

    if (currentStepData) {
      if (currentStepData.type === 'dda') {
        const history = currentStepData.data.historyPixels;
        if (history.length > 0) {
          history.forEach(p => {
            lowX = Math.min(lowX, p.x);
            highX = Math.max(highX, p.x);
            lowY = Math.min(lowY, p.y);
            highY = Math.max(highY, p.y);
          });
        }
      } else if (currentStepData.type === 'bresenham') {
        const history = currentStepData.data.historyPixels;
        if (history.length > 0) {
          history.forEach(p => {
            lowX = Math.min(lowX, p.x);
            highX = Math.max(highX, p.x);
            lowY = Math.min(lowY, p.y);
            highY = Math.max(highY, p.y);
          });
        }
      } else if (currentStepData.type === 'circle') {
        const { center, radius } = currentStepData.data;
        lowX = Math.min(lowX, center.x - radius - 2);
        highX = Math.max(highX, center.x + radius + 2);
        lowY = Math.min(lowY, center.y - radius - 2);
        highY = Math.max(highY, center.y + radius + 2);
      } else if (currentStepData.type === 'cohen_sutherland' || currentStepData.type === 'liang_barsky') {
        const clip = currentStepData.data.clippingWindow;
        const orig = currentStepData.data.originalLine;
        lowX = Math.min(lowX, clip.xmin - 2, orig.p1.x - 2, orig.p2.x - 2);
        highX = Math.max(highX, clip.xmax + 2, orig.p1.x + 2, orig.p2.x + 2);
        lowY = Math.min(lowY, clip.ymin - 2, orig.p1.y - 2, orig.p2.y - 2);
        highY = Math.max(highY, clip.ymax + 2, orig.p1.y + 2, orig.p2.y + 2);
      }
    }

    const pad = 2;
    return {
      minX: Math.floor(lowX) - pad,
      maxX: Math.ceil(highX) + pad,
      minY: Math.floor(lowY) - pad,
      maxY: Math.ceil(highY) + pad
    };
  }, [currentStepData, minX, maxX, minY, maxY]);

  // Reset zoom & pan when bounds change substantially
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas based on container
    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const spanX = Math.max(10, bounds.maxX - bounds.minX + 1);
    const spanY = Math.max(10, bounds.maxY - bounds.minY + 1);
    const baseCellSize = Math.max(20, Math.min(48, Math.min((width - 60) / spanX, (height - 60) / spanY)));
    const cellSize = baseCellSize * zoom;

    const midX = (bounds.minX + bounds.maxX) / 2;
    const midY = (bounds.minY + bounds.maxY) / 2;
    const originX = width / 2 - midX * cellSize + pan.x;
    const originY = height / 2 + midY * cellSize + pan.y;

    // Helper functions
    const toCanvas = (gx: number, gy: number): [number, number] => {
      return [originX + gx * cellSize, originY - gy * cellSize];
    };

    // 1. Clear background
    ctx.fillStyle = '#0b0f19'; // Deep slate darkroom background
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Grid Lines
    const startGridX = Math.floor((0 - originX) / cellSize) - 1;
    const endGridX = Math.ceil((width - originX) / cellSize) + 1;
    const startGridY = Math.floor((originY - height) / cellSize) - 1;
    const endGridY = Math.ceil((originY - 0) / cellSize) + 1;

    ctx.lineWidth = 1;
    for (let gx = startGridX; gx <= endGridX; gx++) {
      const [cx] = toCanvas(gx, 0);
      ctx.beginPath();
      ctx.strokeStyle = gx === 0 ? '#475569' : '#1e293b';
      ctx.lineWidth = gx === 0 ? 2 : 1;
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // X numeric labels
      if (cellSize > 18 || gx % 2 === 0) {
        ctx.fillStyle = gx === 0 ? '#94a3b8' : '#64748b';
        ctx.font = '10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(gx), cx, Math.min(height - 8, Math.max(20, originY + 14)));
      }
    }

    for (let gy = startGridY; gy <= endGridY; gy++) {
      const [, cy] = toCanvas(0, gy);
      ctx.beginPath();
      ctx.strokeStyle = gy === 0 ? '#475569' : '#1e293b';
      ctx.lineWidth = gy === 0 ? 2 : 1;
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Y numeric labels
      if (cellSize > 18 || gy % 2 === 0) {
        ctx.fillStyle = gy === 0 ? '#94a3b8' : '#64748b';
        ctx.font = '10px ui-monospace, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(String(gy), Math.min(width - 10, Math.max(24, originX - 6)), cy + 3);
      }
    }

    // Origin label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px ui-monospace, monospace';
    ctx.fillText('(0,0)', originX - 8, originY + 16);

    // 3. Draw Cohen-Sutherland / Liang-Barsky Clipping Window
    if (currentStepData && (currentStepData.type === 'cohen_sutherland' || currentStepData.type === 'liang_barsky')) {
      const clip = currentStepData.data.clippingWindow;
      const [tlX, tlY] = toCanvas(clip.xmin, clip.ymax);
      const [brX, brY] = toCanvas(clip.xmax, clip.ymin);
      const w = brX - tlX;
      const h = brY - tlY;

      // Fill window interior
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(tlX, tlY, w, h);

      // Window border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(tlX, tlY, w, h);
      ctx.setLineDash([]);

      // 9-region code overlay annotations
      if (currentStepData.type === 'cohen_sutherland') {
        const regions = [
          { name: 'TOP-LEFT\n1001', gx: clip.xmin - 2, gy: clip.ymax + 1 },
          { name: 'TOP\n1000', gx: (clip.xmin + clip.xmax) / 2, gy: clip.ymax + 1 },
          { name: 'TOP-RIGHT\n1010', gx: clip.xmax + 2, gy: clip.ymax + 1 },
          { name: 'LEFT\n0001', gx: clip.xmin - 2, gy: (clip.ymin + clip.ymax) / 2 },
          { name: 'INSIDE\n0000', gx: (clip.xmin + clip.xmax) / 2, gy: (clip.ymin + clip.ymax) / 2 },
          { name: 'RIGHT\n0010', gx: clip.xmax + 2, gy: (clip.ymin + clip.ymax) / 2 },
          { name: 'BTM-LEFT\n0101', gx: clip.xmin - 2, gy: clip.ymin - 1 },
          { name: 'BOTTOM\n0100', gx: (clip.xmin + clip.xmax) / 2, gy: clip.ymin - 1 },
          { name: 'BTM-RIGHT\n0110', gx: clip.xmax + 2, gy: clip.ymin - 1 }
        ];

        ctx.font = '9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        regions.forEach(r => {
          const [rcx, rcy] = toCanvas(r.gx, r.gy);
          ctx.fillStyle = r.name.includes('0000') ? '#34d399' : '#64748b';
          const lines = r.name.split('\n');
          ctx.fillText(lines[0], rcx, rcy - 4);
          ctx.fillText(lines[1], rcx, rcy + 8);
        });
      }
    }

    // 4. Draw Ideal Continuous Guide Line (for DDA / Bresenham / Clipping)
    if (currentStepData) {
      let p1: Point2D | null = null;
      let p2: Point2D | null = null;

      if (currentStepData.type === 'dda') {
        const hist = currentStepData.data.historyPixels;
        if (hist.length > 0) {
          p1 = hist[0];
          p2 = { x: currentStepData.data.historyPixels[currentStepData.data.historyPixels.length - 1].x, y: currentStepData.data.historyPixels[currentStepData.data.historyPixels.length - 1].y };
        }
      } else if (currentStepData.type === 'bresenham') {
        const hist = currentStepData.data.historyPixels;
        if (hist.length > 0) {
          p1 = hist[0];
          p2 = hist[hist.length - 1];
        }
      } else if (currentStepData.type === 'cohen_sutherland' || currentStepData.type === 'liang_barsky') {
        p1 = currentStepData.data.originalLine.p1;
        p2 = currentStepData.data.originalLine.p2;
      }

      if (p1 && p2) {
        const [c1x, c1y] = toCanvas(p1.x, p1.y);
        const [c2x, c2y] = toCanvas(p2.x, p2.y);
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(c1x, c1y);
        ctx.lineTo(c2x, c2y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 5. Draw Rasterized Pixels
    const drawPixelCell = (
      px: number,
      py: number,
      fillColor: string,
      strokeColor: string,
      label?: string,
      isCandidate = false
    ) => {
      const [cx, cy] = toCanvas(px, py);
      const half = cellSize / 2 - 1.5;

      if (isCandidate) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(cx - half, cy - half, half * 2, half * 2);
        ctx.setLineDash([]);
      } else {
        ctx.fillStyle = fillColor;
        ctx.fillRect(cx - half, cy - half, half * 2, half * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - half, cy - half, half * 2, half * 2);
      }

      // Small center dot
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1.5, cellSize * 0.08), 0, Math.PI * 2);
      ctx.fillStyle = isCandidate ? '#f59e0b' : '#ffffff';
      ctx.fill();

      // Pixel text label
      if (cellSize >= 24 && label) {
        ctx.fillStyle = isCandidate ? '#f59e0b' : '#ffffff';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, cy + half - 3);
      }
    };

    // Draw algorithm-specific elements
    if (currentStepData) {
      if (currentStepData.type === 'dda') {
        const data = currentStepData.data;
        data.historyPixels.forEach(p => {
          drawPixelCell(p.x, p.y, 'rgba(2, 132, 199, 0.75)', '#38bdf8');
        });
        // Current pixel highlighted
        drawPixelCell(data.xPixel, data.yPixel, '#0284c7', '#ffffff', `(${data.xPixel},${data.yPixel})`);
      } else if (currentStepData.type === 'bresenham') {
        const data = currentStepData.data;
        data.historyPixels.forEach(p => {
          drawPixelCell(p.x, p.y, 'rgba(16, 185, 129, 0.75)', '#34d399');
        });
        // Candidates evaluated
        if (data.candidate1) {
          drawPixelCell(data.candidate1.x, data.candidate1.y, '', '#f59e0b', data.candidate1.label || 'C1', true);
        }
        if (data.candidate2) {
          drawPixelCell(data.candidate2.x, data.candidate2.y, '', '#f59e0b', data.candidate2.label || 'C2', true);
        }
        // Current selected pixel
        drawPixelCell(data.x, data.y, '#10b981', '#ffffff', `(${data.x},${data.y})`);
      } else if (currentStepData.type === 'circle') {
        const data = currentStepData.data;
        const octantColors = [
          '#60a5fa', '#38bdf8', '#34d399', '#4ade80',
          '#a78bfa', '#c084fc', '#f472b6', '#fb7185'
        ];
        data.historyPixels.forEach(p => {
          const color = p.symmetricGroup ? octantColors[(p.symmetricGroup - 1) % 8] : '#818cf8';
          drawPixelCell(p.x, p.y, color, '#ffffff');
        });

        // Center point
        const [ccx, ccy] = toCanvas(data.center.x, data.center.y);
        ctx.beginPath();
        ctx.arc(ccx, ccy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ec4899';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fbcfe8';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Center (${data.center.x},${data.center.y})`, ccx + 10, ccy - 8);

        // Circle ideal radius outline
        ctx.beginPath();
        ctx.arc(ccx, ccy, data.radius * cellSize, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (currentStepData.type === 'cohen_sutherland') {
        const data = currentStepData.data;

        // Rejected segments (Red dashed)
        data.rejectedSegments.forEach(seg => {
          const [s1x, s1y] = toCanvas(seg.p1.x, seg.p1.y);
          const [s2x, s2y] = toCanvas(seg.p2.x, seg.p2.y);
          ctx.beginPath();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 4]);
          ctx.moveTo(s1x, s1y);
          ctx.lineTo(s2x, s2y);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Current line or accepted line
        if (data.acceptedSegment) {
          const [ax1, ay1] = toCanvas(data.acceptedSegment.p1.x, data.acceptedSegment.p1.y);
          const [ax2, ay2] = toCanvas(data.acceptedSegment.p2.x, data.acceptedSegment.p2.y);
          ctx.beginPath();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 5;
          ctx.moveTo(ax1, ay1);
          ctx.lineTo(ax2, ay2);
          ctx.stroke();
        } else {
          const [lx1, ly1] = toCanvas(data.p1.x, data.p1.y);
          const [lx2, ly2] = toCanvas(data.p2.x, data.p2.y);
          ctx.beginPath();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3.5;
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.stroke();
        }

        // Endpoints with outcodes
        const [p1x, p1y] = toCanvas(data.p1.x, data.p1.y);
        const [p2x, p2y] = toCanvas(data.p2.x, data.p2.y);

        const drawEndpointBadge = (x: number, y: number, name: string, code: string, color: string) => {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px ui-monospace, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`${name} [${code}]`, x + 10, y - 6);
        };

        drawEndpointBadge(p1x, p1y, 'P1', data.code1, data.code1Val === 0 ? '#10b981' : '#f59e0b');
        drawEndpointBadge(p2x, p2y, 'P2', data.code2, data.code2Val === 0 ? '#10b981' : '#f59e0b');

        // Intersection point highlight
        if (data.intersectionPoint) {
          const [ix, iy] = toCanvas(data.intersectionPoint.x, data.intersectionPoint.y);
          ctx.beginPath();
          ctx.arc(ix, iy, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillText(`Intersection (${data.intersectionPoint.x}, ${data.intersectionPoint.y})`, ix + 10, iy + 14);
        }
      } else if (currentStepData.type === 'liang_barsky') {
        const data = currentStepData.data;
        if (data.acceptedSegment) {
          const [ax1, ay1] = toCanvas(data.acceptedSegment.p1.x, data.acceptedSegment.p1.y);
          const [ax2, ay2] = toCanvas(data.acceptedSegment.p2.x, data.acceptedSegment.p2.y);
          ctx.beginPath();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 5;
          ctx.moveTo(ax1, ay1);
          ctx.lineTo(ax2, ay2);
          ctx.stroke();
        } else if (!data.rejected) {
          const [lx1, ly1] = toCanvas(data.p1.x, data.p1.y);
          const [lx2, ly2] = toCanvas(data.p2.x, data.p2.y);
          ctx.beginPath();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.stroke();
        }
      }
    }

    // 6. Draw start/end pins for DDA / Bresenham
    if (currentStepData && (currentStepData.type === 'dda' || currentStepData.type === 'bresenham')) {
      const hist = currentStepData.data.historyPixels;
      if (hist.length > 0) {
        const start = hist[0];
        const [sx, sy] = toCanvas(start.x, start.y);
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 7. Hover cursor crosshair
    if (hoverCoord) {
      const [hx, hy] = toCanvas(hoverCoord.x, hoverCoord.y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hx - cellSize / 2, hy - cellSize / 2, cellSize, cellSize);
    }

  }, [algorithm, currentStepData, bounds, zoom, pan, hoverCoord]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Calculate hover coordinate
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const spanX = Math.max(10, bounds.maxX - bounds.minX + 1);
    const spanY = Math.max(10, bounds.maxY - bounds.minY + 1);
    const baseCellSize = Math.max(20, Math.min(48, Math.min((canvas.clientWidth - 60) / spanX, (canvas.clientHeight - 60) / spanY)));
    const cellSize = baseCellSize * zoom;

    const midX = (bounds.minX + bounds.maxX) / 2;
    const midY = (bounds.minY + bounds.maxY) / 2;
    const originX = canvas.clientWidth / 2 - midX * cellSize + pan.x;
    const originY = canvas.clientHeight / 2 + midY * cellSize + pan.y;

    const mathX = Math.round((clientX - originX) / cellSize);
    const mathY = Math.round((originY - clientY) / cellSize);
    setHoverCoord({ x: mathX, y: mathY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[460px] flex flex-col bg-[#0b0f19] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Floating View Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/60 shadow-lg text-xs text-slate-300">
        <button
          onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={resetView}
          className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Reset Zoom & Pan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Reset View</span>
        </button>
        <span className="text-[11px] text-slate-400 font-mono pl-1">
          {(zoom * 100).toFixed(0)}%
        </span>
      </div>

      {/* Hover Coordinate Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/60 shadow-lg text-xs font-mono text-sky-400">
        <Crosshair className="w-3.5 h-3.5 text-sky-400" />
        <span>Grid: {hoverCoord ? `(${hoverCoord.x}, ${hoverCoord.y})` : '--'}</span>
      </div>

      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoverCoord(null);
        }}
      />
    </div>
  );
};
