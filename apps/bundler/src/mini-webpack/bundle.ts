import type { ModuleGraphNode } from "./graph.js";

type CreateBundleOptions = {
  entryId: string;
};

export function createBundle(
  graph: ModuleGraphNode[],
  options: CreateBundleOptions,
): string {
  const modules = graph
    .map((module) => {
      return `${JSON.stringify(module.id)}: [
        function(__bundle_require__, __bundle_exports__, __bundle_dependencies__) {
          ${transformModule(module)}
        },
        ${JSON.stringify(module.dependencies)}
      ]`;
    })
    .join(",\n");

  return `(function(modules) {
  const cache = {};

  function __bundle_require__(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId];
    }

    const moduleRecord = modules[moduleId];
    if (!moduleRecord) {
      throw new Error("Cannot find module: " + moduleId);
    }

    const [factory, dependencies] = moduleRecord;
    const exports = {};
    cache[moduleId] = exports;
    factory(__bundle_require__, exports, dependencies);
    return exports;
  }

  __bundle_require__(${JSON.stringify(options.entryId)});
})({
${modules}
});`;
}

function transformModule(module: ModuleGraphNode): string {
  const exportedNames: string[] = [];
  let code = module.code;

  code = code.replace(
    /import\s+(.+?)\s+from\s+["']([^"']+)["'];?/g,
    (_statement, importClause: string, request: string) => {
      return `const ${importClause.trim()} = __bundle_require__(__bundle_dependencies__[${JSON.stringify(
        request,
      )}]);`;
    },
  );

  code = code.replace(/import\s+["']([^"']+)["'];?/g, (_statement, request: string) => {
    return `__bundle_require__(__bundle_dependencies__[${JSON.stringify(request)}]);`;
  });

  code = code.replace(
    /export\s+(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g,
    (_statement, declarationKind: string, name: string) => {
      exportedNames.push(name);
      return `${declarationKind} ${name} =`;
    },
  );

  code = code.replace(
    /export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    (_statement, name: string) => {
      exportedNames.push(name);
      return `function ${name}(`;
    },
  );

  const exportAssignments = exportedNames
    .map((name) => `__bundle_exports__.${name} = ${name};`)
    .join("\n");

  return `${code}\n${exportAssignments}`;
}

