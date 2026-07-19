import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";

import { createDevServerResponse } from "../src/mini-vite/dev-server.js";
import { ModuleGraph } from "../src/mini-vite/module-graph.js";

const bundlerRoot = process.cwd();
const appRoot = path.resolve(bundlerRoot, "examples/basic-app");

describe("mini-vite dev server", () => {
  it("root 요청에는 ESM entry를 로드하는 HTML을 응답한다", () => {
    const response = createDevServerResponse({
      url: "/",
      appRoot,
      entryUrl: "/src/main.js",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/html");
    assert.match(response.body, /<script type="module" src="\/src\/main\.js"><\/script>/);
  });

  it("module 요청에는 해당 파일만 on-demand transform해서 응답한다", () => {
    const moduleGraph = new ModuleGraph();
    const response = createDevServerResponse({
      url: "/src/main.js",
      appRoot,
      entryUrl: "/src/main.js",
      moduleGraph,
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/javascript");
    assert.match(response.body, /from "\/src\/message\.js"/);
    assert.match(response.body, /from "\/src\/utils\/format\.js"/);
    assert.equal(moduleGraph.getModule("/src/main.js")?.transformed, true);
    assert.equal(moduleGraph.getModule("/src/message.js")?.transformed, false);
  });

  it("query string을 제외하고 module 파일을 찾는다", () => {
    const response = createDevServerResponse({
      url: "/src/main.js?t=1234",
      appRoot,
      entryUrl: "/src/main.js",
    });

    assert.equal(response.statusCode, 200);
    assert.match(response.body, /from "\/src\/message\.js"/);
  });

  it("현재까지 발견된 module graph를 JSON으로 보여준다", () => {
    const moduleGraph = new ModuleGraph();
    createDevServerResponse({
      url: "/src/main.js",
      appRoot,
      entryUrl: "/src/main.js",
      moduleGraph,
    });

    const response = createDevServerResponse({
      url: "/__mini_vite_graph",
      appRoot,
      entryUrl: "/src/main.js",
      moduleGraph,
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "application/json");
    assert.match(response.body, /"url": "\/src\/main\.js"/);
    assert.match(response.body, /"transformed": false/);
  });
});
