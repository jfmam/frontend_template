import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";
import vm from "node:vm";

import { createBundler, createHotUpdate } from "../src/mini-webpack/bundle.js";
import {
  createDevServerResponse,
  createHotUpdateResponse,
} from "../src/mini-webpack/dev-server.js";
import { createGraph } from "../src/mini-webpack/graph.js";

const bundlerRoot = process.cwd();
const entryFilePath = path.resolve(
  bundlerRoot,
  "examples/basic-app/src/main.js",
);

describe("mini-webpack dev server", () => {
  it("root 요청에는 in-memory bundle을 로드하는 HTML을 응답한다", () => {
    const response = createDevServerResponse({
      url: "/",
      entryFilePath,
      rootDir: bundlerRoot,
      bundleUrl: "/bundle.js",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/html");
    assert.match(response.body, /<script src="\/bundle\.js"><\/script>/);
  });

  it("bundle 요청마다 entry부터 full graph를 만들고 bundle 문자열을 응답한다", () => {
    const response = createDevServerResponse({
      url: "/bundle.js",
      entryFilePath,
      rootDir: bundlerRoot,
      bundleUrl: "/bundle.js",
    });
    const app = { textContent: "" };

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/javascript");
    assert.match(response.body, /__bundle_require__/);

    vm.runInNewContext(response.body, {
      document: {
        querySelector() {
          return app;
        },
      },
    });

    assert.equal(app.textContent, "Mini Webpack says: hello bundler");
  });

  it("변경 module만 담긴 hot update script를 만든다", () => {
    const response = createHotUpdateResponse({
      entryFilePath,
      rootDir: bundlerRoot,
      changedFilePath: path.resolve(bundlerRoot, "examples/basic-app/src/message.js"),
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/javascript");
    assert.match(response.body, /__mini_webpack_apply_update__/);
    assert.match(response.body, /hello bundler/);
    assert.match(response.body, /examples\/basic-app\/src\/message\.js/);
  });

  it("hot update는 변경 module factory와 cache만 교체하고 accept callback을 호출한다", () => {
    const graph = createGraph(entryFilePath, { rootDir: bundlerRoot });
    const bundle = createBundler(graph, {
      entryId: "examples/basic-app/src/main.js",
      enableHmr: true,
    });
    const messageFilePath = path.resolve(bundlerRoot, "examples/basic-app/src/message.js");
    const changedGraph = graph.map((module) =>
      module.filePath === messageFilePath
        ? { ...module, code: 'export const message = "hello hot update";' }
        : module,
    );
    const hotUpdate = createHotUpdate(changedGraph, messageFilePath);
    const app = { textContent: "" };
    const context = {
      document: {
        querySelector() {
          return app;
        },
      },
    };

    vm.runInNewContext(bundle, context);
    vm.runInNewContext(hotUpdate, context);

    assert.equal(app.textContent, "Mini Webpack says: hello hot update");
  });
});
