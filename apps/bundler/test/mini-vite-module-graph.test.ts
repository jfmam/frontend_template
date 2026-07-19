import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ModuleGraph } from "../src/mini-vite/module-graph.js";

describe("mini-vite module graph", () => {
  it("transform한 module과 발견했지만 아직 요청되지 않은 module을 구분한다", () => {
    const graph = new ModuleGraph();

    graph.updateModule({
      url: "/src/main.js",
      filePath: "/app/src/main.js",
      importedUrls: ["/src/message.js"],
    });

    assert.equal(graph.getModule("/src/main.js")?.transformed, true);
    assert.equal(graph.getModule("/src/message.js")?.transformed, false);
    assert.deepEqual(graph.toJSON(), [
      {
        url: "/src/main.js",
        transformed: true,
        importedUrls: ["/src/message.js"],
        importerUrls: [],
        acceptedHmrDeps: [],
        isSelfAccepting: false,
      },
      {
        url: "/src/message.js",
        transformed: false,
        importedUrls: [],
        importerUrls: ["/src/main.js"],
        acceptedHmrDeps: [],
        isSelfAccepting: false,
      },
    ]);
  });

  it("변경 module을 직접 accept한 importer를 HMR boundary로 찾는다", () => {
    const graph = new ModuleGraph();

    graph.updateModule({
      url: "/src/main.js",
      filePath: "/app/src/main.js",
      importedUrls: ["/src/message.js"],
      acceptedHmrDeps: ["/src/message.js"],
    });
    graph.updateModule({
      url: "/src/message.js",
      filePath: "/app/src/message.js",
      importedUrls: [],
    });

    assert.deepEqual(graph.createHmrPayload("/app/src/message.js", 1234), {
      type: "update",
      updates: [
        {
          type: "js-update",
          path: "/src/message.js",
          acceptedPath: "/src/main.js",
          timestamp: 1234,
        },
      ],
    });
  });

  it("accept boundary가 없으면 full reload를 요청한다", () => {
    const graph = new ModuleGraph();

    graph.updateModule({
      url: "/src/message.js",
      filePath: "/app/src/message.js",
      importedUrls: [],
    });

    assert.deepEqual(graph.createHmrPayload("/app/src/message.js", 1234), {
      type: "full-reload",
      path: "/src/message.js",
    });
  });

  it("module을 다시 transform하면 이전 dependency의 역방향 연결을 제거한다", () => {
    const graph = new ModuleGraph();

    graph.updateModule({
      url: "/src/main.js",
      filePath: "/app/src/main.js",
      importedUrls: ["/src/old.js"],
    });
    graph.updateModule({
      url: "/src/main.js",
      filePath: "/app/src/main.js",
      importedUrls: ["/src/new.js"],
    });

    assert.deepEqual(graph.getModule("/src/old.js")?.importers.size, 0);
    assert.deepEqual(graph.getModule("/src/new.js")?.importers.size, 1);
  });
});
