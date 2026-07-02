import fs from "node:fs";
import path from "node:path";

const IMPORT_RE = /(import\s+(?:[^'"]+\s+from\s+)?["'])([^"']+)(["'];?)/g;

type TransformModuleOptions = {
  filePath: string;
  appRoot: string;
};

type TransformModuleResult = {
  url: string;
  code: string;
  fromCache: boolean;
};

const transformCache = new Map<string, TransformModuleResult>();

export function transformModule({
  filePath,
  appRoot,
}: TransformModuleOptions): TransformModuleResult {
  const cacheKey = path.resolve(filePath);
  const cached = transformCache.get(cacheKey);

  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  const code = fs.readFileSync(filePath, "utf8");
  const url = toBrowserUrl(filePath, appRoot);
  const result = {
    url,
    code: rewriteImports(code, filePath, appRoot),
    fromCache: false,
  };

  transformCache.set(cacheKey, result);

  return result;
}

export function clearTransformCache(): void {
  transformCache.clear();
}

function rewriteImports(code: string, importerFilePath: string, appRoot: string): string {
  const importerDir = path.dirname(importerFilePath);

  return code.replace(IMPORT_RE, (_statement, prefix: string, request: string, suffix: string) => {
    if (!request.startsWith(".")) {
      return `${prefix}${request}${suffix}`;
    }

    const resolvedFilePath = path.resolve(importerDir, request);
    return `${prefix}${toBrowserUrl(resolvedFilePath, appRoot)}${suffix}`;
  });
}

function toBrowserUrl(filePath: string, appRoot: string): string {
  return `/${path.relative(appRoot, filePath).split(path.sep).join("/")}`;
}
