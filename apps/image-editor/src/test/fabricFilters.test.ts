import { describe, expect, it } from "vitest";
import { filters } from "fabric";
import { createFabricFilters } from "../editor/fabricFilters";

describe("fabric filters", () => {
  it("creates fabric filters only for active settings", () => {
    const result = createFabricFilters({
      brightness: 0.2,
      contrast: 0,
      blur: 0.3,
      grayscale: true
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(filters.Brightness);
    expect(result[1]).toBeInstanceOf(filters.Blur);
    expect(result[2]).toBeInstanceOf(filters.Grayscale);
  });

  it("returns no filters when settings are at defaults", () => {
    expect(
      createFabricFilters({
        brightness: 0,
        contrast: 0,
        blur: 0,
        grayscale: false
      })
    ).toEqual([]);
  });
});
