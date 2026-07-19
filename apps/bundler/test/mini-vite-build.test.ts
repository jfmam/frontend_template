import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import vm from "node:vm";

import { build } from "../src/mini-vite/build.js";

const bundlerRoot = process.cwd();
const appRoot = path.resolve(bundlerRoot, "examples/basic-app");
const entryFilePath = path.resolve(appRoot, "src/main.js");

describe("mini-vite production build", () => {
  it("dev server와 달리 entry부터 full graph를 만들고 dist asset을 출력한다", () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "mini-vite-build-"));

    const result = build({
      appRoot,
      entryFilePath,
      outDir,
    });

    assert.equal(result.moduleCount, 3);
    assert.equal(result.dependencyCount, 2);
    assert.deepEqual(result.circularComponents, []);
    assert.equal(fs.existsSync(path.join(outDir, "index.html")), true);
    assert.equal(fs.existsSync(path.join(outDir, "assets/index.js")), true);

    const html = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
    const bundle = fs.readFileSync(path.join(outDir, "assets/index.js"), "utf8");
    const app = { textContent: "" };

    assert.match(html, /<script type="module" src="\/assets\/index\.js"><\/script>/);
    assert.equal(bundle.includes("__bundle_require__"), false);

    vm.runInNewContext(bundle, {
      document: {
        querySelector() {
          return app;
        },
      },
    });

    assert.equal(app.textContent, "Mini Webpack says: hello bundler");
  });

  it("서로 다시 도달할 수 있는 module들을 하나의 circular SCC로 찾는다", () => {
    const circularAppRoot = path.resolve(bundlerRoot, "examples/circular-app");
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "mini-vite-scc-"));

    const result = build({
      appRoot: circularAppRoot,
      entryFilePath: path.resolve(circularAppRoot, "src/main.js"),
      outDir,
    });

    assert.equal(result.moduleCount, 3);
    assert.equal(result.dependencyCount, 3);
    assert.deepEqual(result.circularComponents, [
      {
        moduleIds: ["src/a.js", "src/b.js"],
        cyclic: true,
        internalEdgeCount: 2,
      },
    ]);
  });
});
