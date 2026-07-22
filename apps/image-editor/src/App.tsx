import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Canvas, FabricImage, FabricObject, Rect, Textbox, StaticCanvas, FabricText } from 'fabric';
import { CircleIcon, Download, ImagePlus, Redo2, RotateCcw, Square, Trash2, Type, Undo2 } from 'lucide-react';
import { createFabricFilters } from './editor/fabricFilters';
import {
  DEFAULT_FILTER_SETTINGS,
  FILTER_CONTROLS,
  FilterKey,
  FilterSettings,
  buildFilterSummary,
  resetFilterSettings,
  updateFilterSetting,
} from './editor/filterState';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const HISTORY_LIMIT = 40;

type ExportFormat = 'png' | 'jpeg';

export function App() {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas>(null);
  const rectDrawingCleanupRef = useRef<VoidFunction | null>(null);

  useEffect(function initializeSetupCanvas() {
    const canvasElement = canvasElementRef.current;

    if (!canvasElement || canvasRef.current) {
      return;
    }

    const canvas = new Canvas(canvasElement, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      enableRetinaScaling: true, //
    });
    const fabricText = new FabricText('Hello world!');

    canvas.add(fabricText);
    canvas.centerObject(fabricText);
    canvas.requestRenderAll();
    canvasRef.current = canvas;

    return () => {
      rectDrawingCleanupRef.current?.();
      rectDrawingCleanupRef.current = null;
      canvasRef.current = null;
      void canvas.dispose();
    };
  }, []);

  const createRect = (canvas: Canvas): VoidFunction => {
    let startPoint: { x: number; y: number } | null = null;
    let draftRect: Rect | null = null;

    canvas.discardActiveObject();
    canvas.selection = false;
    canvas.skipTargetFind = true;
    canvas.defaultCursor = 'crosshair';
    canvas.requestRenderAll();

    const disposeMouseDown = canvas.on('mouse:down', ({ scenePoint }) => {
      // 하나의 사각형만 생성
      if (draftRect) {
        return;
      }

      startPoint = {
        x: scenePoint.x,
        y: scenePoint.y,
      };

      draftRect = new Rect({
        left: scenePoint.x,
        top: scenePoint.y,
        width: 0,
        height: 0,
        originX: 'left',
        originY: 'top',
        fill: 'rgba(2, 3, 5, 0.2)',
        stroke: '#2563eb',
        strokeWidth: 2,

        // 드래그 중에는 선택되지 않도록 설정
        selectable: false,
        evented: false,
      });

      canvas.add(draftRect);
    });

    const disposeMouseMove = canvas.on('mouse:move', ({ scenePoint }) => {
      if (!startPoint || !draftRect) {
        return;
      }

      const width = Math.abs(scenePoint.x - startPoint.x);
      const height = Math.abs(scenePoint.y - startPoint.y);

      draftRect.set({
        left: Math.min(scenePoint.x, startPoint.x),
        top: Math.min(scenePoint.y, startPoint.y),
        width,
        height,
      });

      canvas.requestRenderAll();
    });

    const disposeMouseUp = canvas.on('mouse:up', () => {
      if (!draftRect) {
        return;
      }

      const completedRect = draftRect;
      const isTooSmall = completedRect.width < 3 || completedRect.height < 3;

      cleanup();
      rectDrawingCleanupRef.current = null;

      if (isTooSmall) {
        canvas.remove(completedRect);
      } else {
        completedRect.set({
          selectable: true,
          evented: true,
        });
        completedRect.setCoords();
        canvas.setActiveObject(completedRect);
      }

      canvas.requestRenderAll();
    });

    const cleanup = () => {
      disposeMouseDown();
      disposeMouseMove();
      disposeMouseUp();

      canvas.selection = true;
      canvas.skipTargetFind = false;
      canvas.defaultCursor = 'default';
      startPoint = null;
      draftRect = null;
    };

    return cleanup;
  };

  const handleCreateRect = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    rectDrawingCleanupRef.current?.();
    rectDrawingCleanupRef.current = createRect(canvas);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <canvas ref={canvasElementRef} />
      <div style={{ background: '#f0f0f0', width: 300, padding: '8px 16px' }}>
        <button type="button" onClick={handleCreateRect}>
          사각형 만들기
        </button>
      </div>
    </div>
  );
}
