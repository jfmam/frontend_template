import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  Canvas,
  FabricImage,
  FabricObject,
  Rect,
  Textbox
} from "fabric";
import {
  CircleIcon,
  Download,
  ImagePlus,
  Redo2,
  RotateCcw,
  Square,
  Trash2,
  Type,
  Undo2
} from "lucide-react";
import { createFabricFilters } from "./editor/fabricFilters";
import {
  DEFAULT_FILTER_SETTINGS,
  FILTER_CONTROLS,
  FilterKey,
  FilterSettings,
  buildFilterSummary,
  resetFilterSettings,
  updateFilterSetting
} from "./editor/filterState";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 640;
const HISTORY_LIMIT = 40;

type ExportFormat = "png" | "jpeg";

export function App() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const imageRef = useRef<FabricImage | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const restoringRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [selectionLabel, setSelectionLabel] = useState("No selection");
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const filterSummary = useMemo(() => buildFilterSummary(filterSettings), [filterSettings]);

  const updateHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const captureHistory = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || restoringRef.current) {
      return;
    }

    const snapshot = JSON.stringify(canvas.toJSON());
    const current = historyRef.current[historyIndexRef.current];

    if (snapshot === current) {
      return;
    }

    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(snapshot);

    if (nextHistory.length > HISTORY_LIMIT) {
      nextHistory.shift();
    }

    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    updateHistoryState();
  }, [updateHistoryState]);

  const refreshSelection = useCallback(() => {
    const active = canvasRef.current?.getActiveObject();

    if (!active) {
      setSelectionLabel("No selection");
      return;
    }

    const label = active.type ? active.type.charAt(0).toUpperCase() + active.type.slice(1) : "Object";
    setSelectionLabel(label);
  }, []);

  const syncCanvasState = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      setHasContent(false);
      setHasImage(false);
      return;
    }

    const objects = canvas.getObjects();
    const image = objects.find((object): object is FabricImage => object.type === "image") ?? null;

    imageRef.current = image;
    setHasContent(objects.length > 0);
    setHasImage(Boolean(image));
  }, []);

  const restoreHistory = useCallback(
    async (nextIndex: number) => {
      const canvas = canvasRef.current;
      const snapshot = historyRef.current[nextIndex];

      if (!canvas || !snapshot) {
        return;
      }

      restoringRef.current = true;
      await canvas.loadFromJSON(snapshot);
      canvas.renderAll();
      syncCanvasState();
      refreshSelection();
      restoringRef.current = false;
      historyIndexRef.current = nextIndex;
      updateHistoryState();
    },
    [refreshSelection, syncCanvasState, updateHistoryState]
  );

  useEffect(() => {
    if (!canvasElementRef.current) {
      return;
    }

    const canvas = new Canvas(canvasElementRef.current, {
      backgroundColor: "#f8fafc",
      preserveObjectStacking: true,
      selection: true,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    });

    canvasRef.current = canvas;
    setIsReady(true);
    captureHistory();

    const handleChanged = () => {
      refreshSelection();
      syncCanvasState();
      captureHistory();
    };

    canvas.on("object:added", handleChanged);
    canvas.on("object:modified", handleChanged);
    canvas.on("object:removed", handleChanged);
    canvas.on("selection:created", refreshSelection);
    canvas.on("selection:updated", refreshSelection);
    canvas.on("selection:cleared", refreshSelection);

    return () => {
      canvas.dispose();
      canvasRef.current = null;
      imageRef.current = null;
    };
  }, [captureHistory, refreshSelection, syncCanvasState]);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;

    if (!image || !canvas) {
      return;
    }

    image.filters = createFabricFilters(filterSettings);
    image.applyFilters();
    canvas.requestRenderAll();
    captureHistory();
  }, [captureHistory, filterSettings]);

  const fitObjectToCanvas = useCallback((object: FabricObject) => {
    const maxWidth = CANVAS_WIDTH * 0.82;
    const maxHeight = CANVAS_HEIGHT * 0.82;
    const width = object.width || maxWidth;
    const height = object.height || maxHeight;
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

    object.set({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      scaleX: scale,
      scaleY: scale
    });
  }, []);

  const loadImage = useCallback(
    (file: File) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const dataUrl = String(reader.result);
        const image = await FabricImage.fromURL(dataUrl, {}, { selectable: true });

        canvas.clear();
        canvas.backgroundColor = "#f8fafc";
        fitObjectToCanvas(image);
        image.filters = createFabricFilters(filterSettings);
        image.applyFilters();
        canvas.add(image);
        canvas.setActiveObject(image);
        imageRef.current = image;
        syncCanvasState();
        refreshSelection();
        captureHistory();
      };

      reader.readAsDataURL(file);
    },
    [captureHistory, filterSettings, fitObjectToCanvas, refreshSelection, syncCanvasState]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      loadImage(file);
    }

    event.target.value = "";
  };

  const addText = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const text = new Textbox("Edit text", {
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      width: 220,
      fill: "#111827",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 42,
      fontWeight: "700",
      textAlign: "center"
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    captureHistory();
  };

  const addRect = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = new Rect({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      width: 180,
      height: 120,
      rx: 8,
      ry: 8,
      fill: "rgba(20, 184, 166, 0.28)",
      stroke: "#0f766e",
      strokeWidth: 4
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
    captureHistory();
  };

  const addCircle = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const circle = new Circle({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      radius: 76,
      fill: "rgba(244, 114, 182, 0.3)",
      stroke: "#be185d",
      strokeWidth: 4
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
    captureHistory();
  };

  const deleteSelected = () => {
    const canvas = canvasRef.current;
    const active = canvas?.getActiveObject();

    if (!canvas || !active) {
      return;
    }

    canvas.remove(active);
    canvas.discardActiveObject();
    if (active === imageRef.current) {
      imageRef.current = null;
    }
    canvas.requestRenderAll();
    syncCanvasState();
    captureHistory();
    refreshSelection();
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      void restoreHistory(historyIndexRef.current - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      void restoreHistory(historyIndexRef.current + 1);
    }
  };

  const handleFilterChange = (key: FilterKey, value: number | boolean) => {
    setFilterSettings((current) => updateFilterSetting(current, key, value as never));
  };

  const handleResetFilters = () => {
    setFilterSettings((current) => resetFilterSettings(current));
  };

  const exportCanvas = (format: ExportFormat) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    const dataUrl = canvas.toDataURL({
      format,
      quality: format === "jpeg" ? 0.92 : 1,
      multiplier: 1
    });
    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = `image-editor-export.${format === "jpeg" ? "jpg" : "png"}`;
    link.click();
  };

  return (
    <main className="editor-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fabric Image Editor</p>
          <h1>Canvas workspace</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="icon-button" onClick={handleUndo} disabled={!canUndo} title="Undo">
            <Undo2 size={18} />
          </button>
          <button type="button" className="icon-button" onClick={handleRedo} disabled={!canRedo} title="Redo">
            <Redo2 size={18} />
          </button>
          <button type="button" className="command-button" onClick={() => exportCanvas("png")}>
            <Download size={18} />
            PNG
          </button>
          <button type="button" className="command-button" onClick={() => exportCanvas("jpeg")}>
            <Download size={18} />
            JPG
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel tools-panel" aria-label="Tools">
          <input
            ref={fileInputRef}
            className="hidden-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="button" className="tool-button primary-tool" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={19} />
            Upload image
          </button>

          <div className="tool-grid" aria-label="Add objects">
            <button type="button" className="tool-button" onClick={addText}>
              <Type size={18} />
              Text
            </button>
            <button type="button" className="tool-button" onClick={addRect}>
              <Square size={18} />
              Rect
            </button>
            <button type="button" className="tool-button" onClick={addCircle}>
              <CircleIcon size={18} />
              Circle
            </button>
            <button type="button" className="tool-button danger" onClick={deleteSelected}>
              <Trash2 size={18} />
              Delete
            </button>
          </div>

          <section className="filter-panel" aria-label="Filters">
            <div className="panel-heading">
              <div>
                <h2>Filters</h2>
                <p>{filterSummary}</p>
              </div>
              <button type="button" className="icon-button" onClick={handleResetFilters} title="Reset filters">
                <RotateCcw size={17} />
              </button>
            </div>

            {FILTER_CONTROLS.map((control) => {
              const value = filterSettings[control.key];

              if (typeof value === "boolean") {
                return (
                  <label className="toggle-row" key={control.key}>
                    <span>{control.label}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      disabled={!hasImage}
                      onChange={(event) => handleFilterChange(control.key, event.target.checked)}
                    />
                  </label>
                );
              }

              return (
                <label className="range-row" key={control.key}>
                  <span>
                    {control.label}
                    <strong>{value.toFixed(2)}</strong>
                  </span>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    disabled={!hasImage}
                    onChange={(event) => handleFilterChange(control.key, Number(event.target.value))}
                  />
                </label>
              );
            })}
          </section>
        </aside>

        <section className="canvas-stage" aria-label="Canvas">
          {!hasContent && (
            <div className="empty-state">
              <ImagePlus size={32} />
              <span>Upload an image to start editing</span>
            </div>
          )}
          <canvas ref={canvasElementRef} />
        </section>

        <aside className="panel inspector-panel" aria-label="Inspector">
          <section>
            <h2>Selection</h2>
            <p className="selection-chip">{selectionLabel}</p>
          </section>
          <section>
            <h2>Document</h2>
            <dl className="meta-list">
              <div>
                <dt>Status</dt>
                <dd>{isReady ? "Ready" : "Loading"}</dd>
              </div>
              <div>
                <dt>Canvas</dt>
                <dd>
                  {CANVAS_WIDTH} x {CANVAS_HEIGHT}
                </dd>
              </div>
              <div>
                <dt>WASM</dt>
                <dd>Filter engine boundary ready</dd>
              </div>
            </dl>
          </section>
        </aside>
      </section>
    </main>
  );
}
