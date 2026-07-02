import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  createGraph,
  type ModuleGraphNode,
} from "../mini-webpack/graph.js";

type BuildOptions = {
  appRoot: string;
  entryFilePath: string;
  outDir: string;
};

type BuildResult = {
  entryId: string;
  moduleCount: number;
  htmlFilePath: string;
  jsFilePath: string;
};

export function build({ appRoot, entryFilePath, outDir }: BuildOptions): BuildResult {
  const entryId = toModuleId(path.resolve(entryFilePath), appRoot);
  const graph = createGraph(entryFilePath, { rootDir: appRoot });
  const bundle = createProductionBundle(graph);
  const htmlFilePath = path.join(outDir, "index.html");
  const jsFilePath = path.join(outDir, "assets/index.js");

  fs.mkdirSync(path.dirname(jsFilePath), { recursive: true });
  fs.writeFileSync(jsFilePath, bundle);
  fs.writeFileSync(htmlFilePath, createHtml("/assets/index.js"));

  return {
    entryId,
    moduleCount: graph.length,
    htmlFilePath,
    jsFilePath,
  };
}

function createProductionBundle(graph: ModuleGraphNode[]): string {
  return [...graph]
    .reverse()
    .map((module) => {
      return `// ${module.id}\n${transformModuleForProduction(module.code)}`;
    })
    .join("\n\n");
}

function transformModuleForProduction(code: string): string {
  return code
    .replace(/import\s+.+?\s+from\s+["'][^"']+["'];?\n?/g, "")
    .replace(/import\s+["'][^"']+["'];?\n?/g, "")
    .replace(/export\s+(const|let|var)\s+/g, "$1 ")
    .replace(/export\s+function\s+/g, "function ");
}

function createHtml(entryUrl: string): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Mini Vite Production Build Example</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${entryUrl}"></script>
  </body>
</html>`;
}

function toModuleId(filePath: string, rootDir: string): string {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [, , entryFilePath = "examples/basic-app/src/main.js", outDir = "examples/basic-app/vite-dist"] =
    process.argv;
  const appRoot = path.resolve("examples/basic-app");
  const result = build({
    appRoot,
    entryFilePath: path.resolve(entryFilePath),
    outDir: path.resolve(outDir),
  });

  console.log(
    `Built ${result.moduleCount} modules into ${path.relative(
      process.cwd(),
      result.htmlFilePath,
    )} and ${path.relative(process.cwd(), result.jsFilePath)}`,
  );
}
