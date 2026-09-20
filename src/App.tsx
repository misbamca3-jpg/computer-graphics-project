import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlgorithmId, ActiveView, AlgorithmInputParams, AlgorithmStep } from './types';
import { generateDDASteps } from './algorithms/dda';
import { generateBresenhamSteps } from './algorithms/bresenham';
import { generateMidpointCircleSteps } from './algorithms/midpointCircle';
import { generateCohenSutherlandSteps } from './algorithms/cohenSutherland';
import { generateLiangBarskySteps } from './algorithms/liangBarsky';

import { Sidebar } from './components/Sidebar';
import { GridCanvas } from './components/GridCanvas';
import { ControlPanel } from './components/ControlPanel';
import { InputPanel } from './components/InputPanel';
import { InfoPanel } from './components/InfoPanel';
import { ComparisonView } from './components/ComparisonView';
import { AlgorithmGuide } from './components/AlgorithmGuide';
import { PythonProjectViewer } from './components/PythonProjectViewer';
import { HomeDashboard } from './components/HomeDashboard';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmId>('dda');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Input Parameters State
  const [params, setParams] = useState<AlgorithmInputParams>({
    x1: 2,
    y1: 2,
    x2: 9,
    y2: 6,
    cx: 5,
    cy: 5,
    radius: 4,
    xmin: 3,
    ymin: 3,
    xmax: 8,
    ymax: 8
  });

  const [error, setError] = useState<string | null>(null);

  // Animation & Stepping State
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

  // Input validation & Step calculation generator
  const computeSteps = useCallback((algo: AlgorithmId, p: AlgorithmInputParams): AlgorithmStep[] => {
    setError(null);

    if (algo === 'dda' || algo === 'bresenham') {
      if (p.x1 === p.x2 && p.y1 === p.y2) {
        setError('Notice: Start point and end point are identical (single pixel).');
      }
      if (algo === 'dda') {
        const ddaList = generateDDASteps(p.x1, p.y1, p.x2, p.y2);
        return ddaList.map(item => ({ type: 'dda' as const, data: item }));
      } else {
        const bresList = generateBresenhamSteps(p.x1, p.y1, p.x2, p.y2);
        return bresList.map(item => ({ type: 'bresenham' as const, data: item }));
      }
    } else if (algo === 'circle') {
      if (p.radius <= 0) {
        setError('Error: Circle radius must be a positive integer greater than 0.');
        return [];
      }
      const circList = generateMidpointCircleSteps(p.cx, p.cy, p.radius);
      return circList.map(item => ({ type: 'circle' as const, data: item }));
    } else if (algo === 'cohen_sutherland') {
      if (p.xmin >= p.xmax || p.ymin >= p.ymax) {
        setError('Error: Invalid clipping window. Ensure Xmin < Xmax and Ymin < Ymax.');
        return [];
      }
      const clipRect = { xmin: p.xmin, ymin: p.ymin, xmax: p.xmax, ymax: p.ymax };
      const csList = generateCohenSutherlandSteps(p.x1, p.y1, p.x2, p.y2, clipRect);
      return csList.map(item => ({ type: 'cohen_sutherland' as const, data: item }));
    } else if (algo === 'liang_barsky') {
      if (p.xmin >= p.xmax || p.ymin >= p.ymax) {
        setError('Error: Invalid clipping window. Ensure Xmin < Xmax and Ymin < Ymax.');
        return [];
      }
      const clipRect = { xmin: p.xmin, ymin: p.ymin, xmax: p.xmax, ymax: p.ymax };
      const lbList = generateLiangBarskySteps(p.x1, p.y1, p.x2, p.y2, clipRect);
      return lbList.map(item => ({ type: 'liang_barsky' as const, data: item }));
    }
    return [];
  }, []);

  // Regenerate steps whenever algorithm changes or initial load
  useEffect(() => {
    const generated = computeSteps(selectedAlgorithm, params);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedAlgorithm, computeSteps]);

  // Handle manual "Generate & Compute Steps" button click
  const handleGenerate = () => {
    const generated = computeSteps(selectedAlgorithm, params);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Playback Timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMap = {
      slow: 800,
      medium: 400,
      fast: 150
    };

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMap[speed]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Stepping actions
  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSeek = (step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(step, steps.length - 1)));
  };

  const currentStepData = steps[currentStepIndex] || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeView={activeView}
        selectedAlgorithm={selectedAlgorithm}
        onSelectView={view => {
          if (view === 'about') {
            setIsAboutOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onSelectAlgorithm={algo => {
          setSelectedAlgorithm(algo);
          setActiveView('visualizer');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {activeView === 'home' && (
          <HomeDashboard
            onSelectAlgorithm={algo => {
              setSelectedAlgorithm(algo);
              setActiveView('visualizer');
            }}
            onSelectView={view => setActiveView(view)}
          />
        )}

        {activeView === 'comparison' && <ComparisonView />}

        {activeView === 'guide' && <AlgorithmGuide />}

        {activeView === 'python_code' && <PythonProjectViewer />}

        {activeView === 'visualizer' && (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3.5 p-3.5 h-full overflow-hidden">
            {/* Left 8 Columns: Interactive Grid Canvas + Playback Controls + Inputs */}
            <div className="xl:col-span-8 flex flex-col gap-3 h-full min-h-0">
              {/* Center Coordinate Grid */}
              <div className="flex-1 min-h-[360px] relative">
                <GridCanvas
                  algorithm={selectedAlgorithm}
                  currentStepData={currentStepData}
                />
              </div>

              {/* Playback Controls Panel */}
              <ControlPanel
                currentStep={currentStepIndex}
                totalSteps={Math.max(0, steps.length - 1)}
                isPlaying={isPlaying}
                speed={speed}
                onPlay={handlePlay}
                onPause={handlePause}
                onNext={handleNext}
                onPrev={handlePrev}
                onReset={handleReset}
                onSpeedChange={setSpeed}
                onSeek={handleSeek}
              />

              {/* Input Parameters Box */}
              <InputPanel
                algorithm={selectedAlgorithm}
                params={params}
                onParamsChange={setParams}
                onGenerate={handleGenerate}
                error={error}
              />
            </div>

            {/* Right 4 Columns: Information & Telemetry Panel */}
            <div className="xl:col-span-4 h-full min-h-0 flex flex-col">
              <InfoPanel
                algorithm={selectedAlgorithm}
                currentStepData={currentStepData}
                allSteps={steps}
                currentStepIndex={currentStepIndex}
                onSelectStep={handleSeek}
              />
            </div>
          </div>
        )}
      </main>

      {/* About Project Dialog */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
