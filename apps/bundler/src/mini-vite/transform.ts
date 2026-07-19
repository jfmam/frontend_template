import fs from "node:fs";
import path from "node:path";

const IMPORT_RE = /(import\s+(?:[^'"]+\s+from\s+)?["'])([^"']+)(["'];?)/g;
const SELF_ACCEPT_RE = /import\.meta\.hot\.accept\s*\(\s*(?:\(\s*[^)]*\s*\)\s*=>|function\s*\(|\))/;
const DEPENDENCY_ACCEPT_RE = /import\.meta\.hot\.accept\s*\(\s*["']([^"']+)["']/g;

type TransformModuleOptions = {
  filePath: string;
  appRoot: string;
};

export type TransformModuleResult = {
  url: string;
  code: string;
  importedUrls: string[];
  bareImports: string[];
  acceptedHmrDeps: string[];
  isSelfAccepting: boolean;
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
  const transformed = rewriteImports(code, filePath, appRoot);
  const hmr = findHmrAccepts(code, filePath, appRoot);
  const result = {
    url,
    code: injectHmrContext(transformed.code, url),
    importedUrls: transformed.importedUrls,
    bareImports: transformed.bareImports,
    acceptedHmrDeps: hmr.acceptedHmrDeps,
    isSelfAccepting: hmr.isSelfAccepting,
    fromCache: false,
  };

  transformCache.set(cacheKey, result);

  return result;
}

export function clearTransformCache(): void {
  transformCache.clear();
}

export function invalidateTransform(filePath: string): void {
  transformCache.delete(path.resolve(filePath));
}

function rewriteImports(
  code: string,
  importerFilePath: string,
  appRoot: string,
): Pick<TransformModuleResult, "code" | "importedUrls" | "bareImports"> {
  const importerDir = path.dirname(importerFilePath);
  const importedUrls: string[] = [];
  const bareImports: string[] = [];

  const transformedCode = code.replace(
    IMPORT_RE,
    (_statement, prefix: string, request: string, suffix: string) => {
      if (!request.startsWith(".")) {
        bareImports.push(request);
        return `${prefix}${request}${suffix}`;
      }

      const resolvedFilePath = path.resolve(importerDir, request);
      const importedUrl = toBrowserUrl(resolvedFilePath, appRoot);
      importedUrls.push(importedUrl);
      return `${prefix}${importedUrl}${suffix}`;
    },
  );

  return {
    code: transformedCode,
    importedUrls,
    bareImports,
  };
}

function toBrowserUrl(filePath: string, appRoot: string): string {
  return `/${path.relative(appRoot, filePath).split(path.sep).join("/")}`;
}

function findHmrAccepts(
  code: string,
  importerFilePath: string,
  appRoot: string,
): Pick<TransformModuleResult, "acceptedHmrDeps" | "isSelfAccepting"> {
  const importerDir = path.dirname(importerFilePath);
  const acceptedHmrDeps: string[] = [];

  for (const match of code.matchAll(DEPENDENCY_ACCEPT_RE)) {
    const request = match[1];
    if (request.startsWith(".")) {
      acceptedHmrDeps.push(toBrowserUrl(path.resolve(importerDir, request), appRoot));
    }
  }

  return {
    acceptedHmrDeps,
    isSelfAccepting: SELF_ACCEPT_RE.test(code),
  };
}

function injectHmrContext(code: string, url: string): string {
  return `import { createHotContext as __mini_vite_create_hot_context__ } from "/@mini-vite/client";
import.meta.hot = __mini_vite_create_hot_context__(${JSON.stringify(url)});
${code}`;
}
