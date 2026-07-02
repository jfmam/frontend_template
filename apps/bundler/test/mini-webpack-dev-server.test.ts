import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";
import vm from "node:vm";

import { createDevServerResponse } from "../src/mini-webpack/dev-server.js";

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
});

