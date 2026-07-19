import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTER_SETTINGS,
  FILTER_CONTROLS,
  buildFilterSummary,
  resetFilterSettings,
  updateFilterSetting
} from "../editor/filterState";

describe("filter state", () => {
  it("updates only the requested filter setting", () => {
    const next = updateFilterSetting(DEFAULT_FILTER_SETTINGS, "brightness", 0.35);

    expect(next.brightness).toBe(0.35);
    expect(next.contrast).toBe(DEFAULT_FILTER_SETTINGS.contrast);
    expect(next.blur).toBe(DEFAULT_FILTER_SETTINGS.blur);
    expect(next.grayscale).toBe(DEFAULT_FILTER_SETTINGS.grayscale);
  });

  it("clamps numeric filters to their configured ranges", () => {
    const high = updateFilterSetting(DEFAULT_FILTER_SETTINGS, "contrast", 9);
    const low = updateFilterSetting(DEFAULT_FILTER_SETTINGS, "brightness", -9);

    expect(high.contrast).toBe(1);
    expect(low.brightness).toBe(-1);
  });

  it("resets filters to defaults", () => {
    const changed = updateFilterSetting(DEFAULT_FILTER_SETTINGS, "blur", 0.8);

    expect(resetFilterSettings(changed)).toEqual(DEFAULT_FILTER_SETTINGS);
  });

  it("summarizes active filters for the toolbar", () => {
    const active = {
      ...DEFAULT_FILTER_SETTINGS,
      brightness: 0.2,
      grayscale: true
    };

    expect(buildFilterSummary(active)).toBe("Brightness + Grayscale");
  });

  it("keeps all controls mapped to a default value", () => {
    for (const control of FILTER_CONTROLS) {
      expect(DEFAULT_FILTER_SETTINGS).toHaveProperty(control.key);
    }
  });
});
