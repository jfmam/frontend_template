import fs from "node:fs";
import path from "node:path";

const IMPORT_RE = /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["'];?/g;

export type ModuleGraphNode = {
  id: string;
  filePath: string;
  code: string;
  dependencies: Record<string, string>;
};

type CreateGraphOptions = {
  rootDir?: string;
};

type GraphContext = {
  rootDir: string;
};

export function createGraph(
  entryFilePath: string,
  options: CreateGraphOptions = {},
): ModuleGraphNode[] {
  const graph: ModuleGraphNode[] = [];
  const visited = new Set<string>();
  const context: GraphContext = {
    rootDir: options.rootDir ?? process.cwd(),
  };

  collectModule(path.resolve(entryFilePath), graph, visited, context);

  return graph;
}

function collectModule(
  filePath: string,
  graph: ModuleGraphNode[],
  visited: Set<string>,
  context: GraphContext,
): void {
  if (visited.has(filePath)) {
    return;
  }

  visited.add(filePath);

  const code = fs.readFileSync(filePath, "utf8");
  const dependencies = findDependencies(filePath, code, context);

  graph.push({
    id: toModuleId(filePath, context),
    filePath,
    code,
    dependencies,
  });

  for (const dependencyFilePath of Object.values(dependencies)) {
    collectModule(
      path.resolve(context.rootDir, dependencyFilePath),
      graph,
      visited,
      context,
    );
  }
}

function findDependencies(
  filePath: string,
  code: string,
  context: GraphContext,
): Record<string, string> {
  const dependencies: Record<string, string> = {};
  const dirname = path.dirname(filePath);

  for (const match of code.matchAll(IMPORT_RE)) {
    const request = match[1];

    if (!request.startsWith(".")) {
      continue;
    }

    const dependencyFilePath = path.resolve(dirname, request);
    dependencies[request] = toModuleId(dependencyFilePath, context);
  }

  return dependencies;
}

function toModuleId(filePath: string, context: GraphContext): string {
  return path.relative(context.rootDir, filePath).split(path.sep).join("/");
}

