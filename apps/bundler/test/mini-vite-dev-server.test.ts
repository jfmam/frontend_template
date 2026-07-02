import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";

import { createDevServerResponse } from "../src/mini-vite/dev-server.js";

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
    const response = createDevServerResponse({
      url: "/src/main.js",
      appRoot,
      entryUrl: "/src/main.js",
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.contentType, "text/javascript");
    assert.match(response.body, /from "\/src\/message\.js"/);
    assert.match(response.body, /from "\/src\/utils\/format\.js"/);
  });
});

