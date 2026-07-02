import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import vm from "node:vm";

import { build } from "../src/mini-webpack/build.js";

const bundlerRoot = process.cwd();
const fixtureEntry = path.resolve(
  bundlerRoot,
  "examples/basic-app/src/main.js",
);

describe("mini-webpack build", () => {
  it("entry를 bundle 파일로 빌드한다", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mini-webpack-"));
    const outputFilePath = path.join(tempDir, "bundle.js");

    build({
      entryFilePath: fixtureEntry,
      outputFilePath,
      rootDir: bundlerRoot,
    });

    assert.equal(fs.existsSync(outputFilePath), true);

    const app = { textContent: "" };
    const bundle = fs.readFileSync(outputFilePath, "utf8");

    vm.runInNewContext(bundle, {
      document: {
        querySelector() {
          return app;
        },
      },
    });

    assert.equal(app.textContent, "Mini Webpack says: hello bundler");
  });
});
