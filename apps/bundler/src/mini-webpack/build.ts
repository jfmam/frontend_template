import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createBundler } from "./bundle.js";
import { createGraph } from "./graph.js";

type BuildOptions = {
  entryFilePath: string;
  outputFilePath: string;
  rootDir?: string;
};

type BuildResult = {
  entryId: string;
  outputFilePath: string;
  moduleCount: number;
};

export function build({
  entryFilePath,
  outputFilePath,
  rootDir = process.cwd(),
}: BuildOptions): BuildResult {
  const entryId = toModuleId(path.resolve(entryFilePath), rootDir);
  const graph = createGraph(entryFilePath, { rootDir });
  const bundle = createBundler(graph, { entryId });

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, bundle);

  return {
    entryId,
    outputFilePath,
    moduleCount: graph.length,
  };
}

function toModuleId(filePath: string, rootDir: string): string {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [, , entryFilePath, outputFilePath] = process.argv;

  if (!entryFilePath || !outputFilePath) {
    console.error(
      "Usage: node dist-ts/src/mini-webpack/build.js <entryFilePath> <outputFilePath>",
    );
    process.exit(1);
  }

  const result = build({
    entryFilePath: path.resolve(entryFilePath),
    outputFilePath: path.resolve(outputFilePath),
  });

  console.log(
    `Built ${result.moduleCount} modules into ${path.relative(
      process.cwd(),
      result.outputFilePath,
    )}`,
  );
}

