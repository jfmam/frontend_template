import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  createGraph,
  type ModuleGraphNode,
} from "../mini-webpack/graph.js";
import {
  findStronglyConnectedComponents,
  type StronglyConnectedComponent,
} from "./scc.js";

type BuildOptions = {
  appRoot: string;
  entryFilePath: string;
  outDir: string;
};

type BuildResult = {
  entryId: string;
  moduleCount: number;
  dependencyCount: number;
  circularComponents: StronglyConnectedComponent[];
  timings: {
    graphMs: number;
    sccMs: number;
    transformMs: number;
    emitMs: number;
    totalMs: number;
  };
  htmlFilePath: string;
  jsFilePath: string;
};

export function build({ appRoot, entryFilePath, outDir }: BuildOptions): BuildResult {
  const buildStartedAt = performance.now();
  const entryId = toModuleId(path.resolve(entryFilePath), appRoot);

  // 1. Rollup 계열 build도 entry부터 배포에 필요한 전체 module graph를 만듭니다.
  const graphStartedAt = performance.now();
  const graph = createGraph(entryFilePath, { rootDir: appRoot });
  const graphMs = performance.now() - graphStartedAt;

  // 2. 순환 참조 모듈은 서로 독립적인 위상 정렬이 불가능하므로 SCC로 묶어 봅니다.
  const sccStartedAt = performance.now();
  const components = findStronglyConnectedComponents(graph);
  const sccMs = performance.now() - sccStartedAt;

  // 3. 실제 Rollup은 이 단계에서 AST 분석, tree shaking, chunking, name deconflict 등을 수행합니다.
  const transformStartedAt = performance.now();
  const bundle = createProductionBundle(graph);
  const transformMs = performance.now() - transformStartedAt;
  const htmlFilePath = path.join(outDir, "index.html");
  const jsFilePath = path.join(outDir, "assets/index.js");

  // 4. 최종 asset을 파일로 출력합니다.
  const emitStartedAt = performance.now();
  fs.mkdirSync(path.dirname(jsFilePath), { recursive: true });
  fs.writeFileSync(jsFilePath, bundle);
  fs.writeFileSync(htmlFilePath, createHtml("/assets/index.js"));
  const emitMs = performance.now() - emitStartedAt;

  return {
    entryId,
    moduleCount: graph.length,
    dependencyCount: graph.reduce(
      (count, module) => count + Object.keys(module.dependencies).length,
      0,
    ),
    circularComponents: components.filter((component) => component.cyclic),
    timings: {
      graphMs,
      sccMs,
      transformMs,
      emitMs,
      totalMs: performance.now() - buildStartedAt,
    },
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
  return stripHmrBlocks(code)
    .replace(/import\s+.+?\s+from\s+["'][^"']+["'];?\n?/g, "")
    .replace(/import\s+["'][^"']+["'];?\n?/g, "")
    .replace(/export\s+(const|let|var)\s+/g, "$1 ")
    .replace(/export\s+function\s+/g, "function ");
}

function stripHmrBlocks(code: string): string {
  const marker = "if (import.meta.hot) {";
  let result = code;
  let start = result.indexOf(marker);

  while (start >= 0) {
    let depth = 1;
    let cursor = start + marker.length;

    while (cursor < result.length && depth > 0) {
      if (result[cursor] === "{") {
        depth += 1;
      } else if (result[cursor] === "}") {
        depth -= 1;
      }
      cursor += 1;
    }

    result = `${result.slice(0, start)}${result.slice(cursor)}`;
    start = result.indexOf(marker);
  }

  return result;
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
  const [
    ,
    ,
    entryFilePath = "examples/basic-app/src/main.js",
    outDir = "examples/basic-app/vite-dist",
    appRootPath = "examples/basic-app",
  ] = process.argv;
  const appRoot = path.resolve(appRootPath);
  const result = build({
    appRoot,
    entryFilePath: path.resolve(entryFilePath),
    outDir: path.resolve(outDir),
  });

  console.log(`\n[Mini Vite build report]`);
  console.log(`entry: ${result.entryId}`);
  console.log(
    `graph: ${result.moduleCount} modules, ${result.dependencyCount} dependencies`,
  );
  console.log(`circular SCC: ${result.circularComponents.length}`);
  for (const component of result.circularComponents) {
    console.log(
      `  - ${component.moduleIds.join(" <-> ")} (${component.internalEdgeCount} internal edges)`,
    );
  }
  console.log(
    `timings: graph=${result.timings.graphMs.toFixed(2)}ms, ` +
      `scc=${result.timings.sccMs.toFixed(2)}ms, ` +
      `transform=${result.timings.transformMs.toFixed(2)}ms, ` +
      `emit=${result.timings.emitMs.toFixed(2)}ms, ` +
      `total=${result.timings.totalMs.toFixed(2)}ms`,
  );
  console.log(
    `output: ${path.relative(process.cwd(), result.htmlFilePath)}, ${path.relative(
      process.cwd(),
      result.jsFilePath,
    )}`,
  );
}
