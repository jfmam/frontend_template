import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";

import { createGraph } from "../src/mini-webpack/graph.js";

const bundlerRoot = process.cwd();
const fixtureEntry = path.resolve(
  bundlerRoot,
  "examples/basic-app/src/main.js",
);

describe("mini-webpack dependency graph", () => {
  it("entry에서 시작해 상대 경로 import를 재귀적으로 수집한다", () => {
    const graph = createGraph(fixtureEntry, { rootDir: bundlerRoot });

    assert.deepEqual(
      graph.map((module) => path.relative(bundlerRoot, module.filePath)),
      [
        "examples/basic-app/src/main.js",
        "examples/basic-app/src/message.js",
        "examples/basic-app/src/utils/format.js",
      ],
    );
  });

  it("각 모듈의 import 경로를 실제 파일 경로 기반 module id로 매핑한다", () => {
    const graph = createGraph(fixtureEntry, { rootDir: bundlerRoot });
    const entryModule = graph[0];

    assert.equal(entryModule.id, "examples/basic-app/src/main.js");
    assert.deepEqual(entryModule.dependencies, {
      "./message.js": "examples/basic-app/src/message.js",
      "./utils/format.js": "examples/basic-app/src/utils/format.js",
    });
  });
});
