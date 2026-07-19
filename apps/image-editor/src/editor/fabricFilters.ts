import { filters } from "fabric";
import type { FilterSettings } from "./filterState";

export type FabricFilter =
  | filters.Brightness
  | filters.Contrast
  | filters.Blur
  | filters.Grayscale;

export function createFabricFilters(settings: FilterSettings): FabricFilter[] {
  const nextFilters: FabricFilter[] = [];

  if (settings.brightness !== 0) {
    nextFilters.push(new filters.Brightness({ brightness: settings.brightness }));
  }

  if (settings.contrast !== 0) {
    nextFilters.push(new filters.Contrast({ contrast: settings.contrast }));
  }

  if (settings.blur !== 0) {
    nextFilters.push(new filters.Blur({ blur: settings.blur }));
  }

  if (settings.grayscale) {
    nextFilters.push(new filters.Grayscale());
  }

  return nextFilters;
}
