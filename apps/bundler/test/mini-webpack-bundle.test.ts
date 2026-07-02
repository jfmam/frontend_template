import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";
import vm from "node:vm";

import { createBundle } from "../src/mini-webpack/bundle.js";
import { createGraph } from "../src/mini-webpack/graph.js";

const bundlerRoot = process.cwd();
const fixtureEntry = path.resolve(
  bundlerRoot,
  "examples/basic-app/src/main.js",
);

describe("mini-webpack bundle runtime", () => {
  it("graph를 브라우저에서 실행 가능한 bundle 문자열로 변환한다", () => {
    const graph = createGraph(fixtureEntry, { rootDir: bundlerRoot });
    const bundle = createBundle(graph, {
      entryId: "examples/basic-app/src/main.js",
    });
    const app = { textContent: "" };

    vm.runInNewContext(bundle, {
      document: {
        querySelector(selector: string) {
          assert.equal(selector, "#app");
          return app;
        },
      },
    });

    assert.equal(app.textContent, "Mini Webpack says: hello bundler");
  });
});
