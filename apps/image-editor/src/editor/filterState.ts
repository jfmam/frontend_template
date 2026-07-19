export type NumericFilterKey = "brightness" | "contrast" | "blur";
export type BooleanFilterKey = "grayscale";
export type FilterKey = NumericFilterKey | BooleanFilterKey;

export type FilterSettings = {
  brightness: number;
  contrast: number;
  blur: number;
  grayscale: boolean;
};

export type FilterControl = {
  key: FilterKey;
  label: string;
  min?: number;
  max?: number;
  step?: number;
};

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  brightness: 0,
  contrast: 0,
  blur: 0,
  grayscale: false
};

export const FILTER_CONTROLS: FilterControl[] = [
  { key: "brightness", label: "Brightness", min: -1, max: 1, step: 0.05 },
  { key: "contrast", label: "Contrast", min: -1, max: 1, step: 0.05 },
  { key: "blur", label: "Blur", min: 0, max: 1, step: 0.05 },
  { key: "grayscale", label: "Grayscale" }
];

export function updateFilterSetting<K extends FilterKey>(
  settings: FilterSettings,
  key: K,
  value: FilterSettings[K]
): FilterSettings {
  const control = FILTER_CONTROLS.find((item) => item.key === key);

  if (typeof value === "number") {
    const min = control?.min ?? Number.NEGATIVE_INFINITY;
    const max = control?.max ?? Number.POSITIVE_INFINITY;

    return {
      ...settings,
      [key]: Math.min(max, Math.max(min, value))
    };
  }

  return {
    ...settings,
    [key]: value
  };
}

export function resetFilterSettings(_: FilterSettings): FilterSettings {
  return { ...DEFAULT_FILTER_SETTINGS };
}

export function buildFilterSummary(settings: FilterSettings): string {
  const active = FILTER_CONTROLS.filter((control) => {
    const value = settings[control.key];
    const defaultValue = DEFAULT_FILTER_SETTINGS[control.key];

    return value !== defaultValue;
  }).map((control) => control.label);

  return active.length > 0 ? active.join(" + ") : "No filters";
}
