import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import { describe, it } from "node:test";
import path from "node:path";
import vm from "node:vm";

import { IncrementalCompiler } from "../src/mini-rsbuild/compiler.js";

const bundlerRoot = process.cwd();
const entryFilePath = path.resolve(
  bundlerRoot,
  "examples/basic-app/src/main.js",
);

describe("mini-rsbuild incremental compiler", () => {
  it("첫 compilation은 모든 module factory를 만들고, 다음 compilation은 cache를 재사용한다", () => {
    const compiler = new IncrementalCompiler({
      entryFilePath,
      rootDir: bundlerRoot,
    });
    const first = compiler.compile();
    const second = compiler.compile();

    assert.deepEqual(first.stats, {
      moduleCount: 3,
      rebuiltModuleCount: 3,
      reusedModuleCount: 0,
    });
    assert.deepEqual(second.stats, {
      moduleCount: 3,
      rebuiltModuleCount: 0,
      reusedModuleCount: 3,
    });
  });

  it("cache된 factory로 만든 bundle도 Webpack식 runtime에서 실행된다", () => {
    const compiler = new IncrementalCompiler({
      entryFilePath,
      rootDir: bundlerRoot,
    });
    const compilation = compiler.compile();
    const app = { textContent: "" };

    vm.runInNewContext(compilation.bundle, {
      document: {
        querySelector() {
          return app;
        },
      },
    });

    assert.equal(app.textContent, "Mini Webpack says: hello bundler");
  });

  it("변경된 module만 factory를 다시 만들고 나머지는 재사용한다", () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "mini-rsbuild-"));
    const sourceDir = path.join(rootDir, "src");
    const temporaryEntry = path.join(sourceDir, "main.js");
    const messageFilePath = path.join(sourceDir, "message.js");

    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(
      temporaryEntry,
      'import { message } from "./message.js";\ndocument.querySelector("#app").textContent = message;\n',
    );
    fs.writeFileSync(messageFilePath, 'export const message = "before";\n');

    const compiler = new IncrementalCompiler({
      entryFilePath: temporaryEntry,
      rootDir,
    });

    compiler.compile();
    fs.writeFileSync(messageFilePath, 'export const message = "after";\n');
    const changed = compiler.compile();

    assert.deepEqual(changed.stats, {
      moduleCount: 2,
      rebuiltModuleCount: 1,
      reusedModuleCount: 1,
    });
  });
});
