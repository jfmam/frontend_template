import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";

import {
  clearTransformCache,
  transformModule,
} from "../src/mini-vite/transform.js";

const bundlerRoot = process.cwd();
const appRoot = path.resolve(bundlerRoot, "examples/basic-app");

describe("mini-vite transform", () => {
  it("상대 경로 import를 브라우저가 요청할 수 있는 URL로 바꾼다", () => {
    clearTransformCache();

    const result = transformModule({
      filePath: path.resolve(appRoot, "src/main.js"),
      appRoot,
    });

    assert.equal(result.url, "/src/main.js");
    assert.match(result.code, /from "\/src\/message\.js"/);
    assert.match(result.code, /from "\/src\/utils\/format\.js"/);
  });

  it("한 번 transform한 module은 메모리 cache에서 재사용한다", () => {
    clearTransformCache();

    const filePath = path.resolve(appRoot, "src/main.js");
    const firstResult = transformModule({ filePath, appRoot });
    const secondResult = transformModule({ filePath, appRoot });

    assert.equal(firstResult.fromCache, false);
    assert.equal(secondResult.fromCache, true);
    assert.equal(secondResult.code, firstResult.code);
  });
});
