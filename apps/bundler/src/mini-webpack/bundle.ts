import type { ModuleGraphNode } from "./graph.js";

type CreateBundleOptions = {
  entryId: string;
  enableHmr?: boolean;
  hmrEndpoint?: string;
};

export type BundleModule = {
  id: string;
  dependencies: Record<string, string>;
  factoryCode: string;
};

export function createBundler(
  graph: ModuleGraphNode[],
  options: CreateBundleOptions,
): string {
  return createBundlerFromModules(graph.map(createBundleModule), options);
}

export function createBundleModule(module: ModuleGraphNode): BundleModule {
  return {
    id: module.id,
    dependencies: module.dependencies,
    factoryCode: transformModule(module),
  };
}

export function createBundlerFromModules(
  bundleModules: BundleModule[],
  options: CreateBundleOptions,
): string {
  const modules = bundleModules
    .map((module) => {
      return `${JSON.stringify(module.id)}: [
        function(__bundle_require__, __bundle_exports__, __bundle_dependencies__, __bundle_hot__) {
          ${module.factoryCode}
        },
        ${JSON.stringify(module.dependencies)}
      ]`;
    })
    .join(",\n");

  return `(function(modules) {
  const cache = {};
  const hotCallbacks = {};
  const hmrEnabled = ${options.enableHmr === true};

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
    factory(
      __bundle_require__,
      exports,
      dependencies,
      hmrEnabled ? __bundle_create_hot_context__(moduleId, dependencies) : undefined,
    );
    return exports;
  }

  function __bundle_create_hot_context__(moduleId, dependencies) {
    return {
      accept: function(request, callback) {
        const callbacks = hotCallbacks[moduleId] || (hotCallbacks[moduleId] = {});

        if (typeof request === "function" || request === undefined) {
          callbacks[moduleId] = typeof request === "function" ? request : function() {};
          return;
        }

        const dependencyId = dependencies[request];
        if (!dependencyId) {
          throw new Error("Cannot accept unknown dependency: " + request);
        }

        callbacks[dependencyId] = callback || function() {};
      },
    };
  }

  function __bundle_apply_update__(updatedModules) {
    const moduleIds = Object.keys(updatedModules);
    const callbacksByModuleId = {};

    for (const moduleId of moduleIds) {
      const ownCallback = hotCallbacks[moduleId] && hotCallbacks[moduleId][moduleId];
      const callbacks = ownCallback ? [ownCallback] : [];

      if (!ownCallback) {
        for (const importerId of Object.keys(hotCallbacks)) {
          const callback = hotCallbacks[importerId][moduleId];
          if (callback) {
            callbacks.push(callback);
          }
        }
      }

      if (callbacks.length === 0) {
        __bundle_full_reload__();
        return;
      }

      callbacksByModuleId[moduleId] = callbacks;
    }

    for (const moduleId of moduleIds) {
      modules[moduleId] = updatedModules[moduleId];
      delete cache[moduleId];
      delete hotCallbacks[moduleId];
    }

    for (const moduleId of moduleIds) {
      const updatedExports = __bundle_require__(moduleId);
      for (const callback of callbacksByModuleId[moduleId]) {
        callback(updatedExports);
      }
    }
  }

  function __bundle_full_reload__() {
    if (typeof location !== "undefined") {
      location.reload();
    }
  }

  globalThis.__mini_webpack_apply_update__ = __bundle_apply_update__;
  globalThis.__mini_webpack_full_reload__ = __bundle_full_reload__;

  __bundle_require__(${JSON.stringify(options.entryId)});

  if (hmrEnabled && typeof EventSource !== "undefined") {
    const eventSource = new EventSource(${JSON.stringify(
      options.hmrEndpoint ?? "/__mini_webpack_hmr",
    )});
    eventSource.onmessage = function(event) {
      const payload = JSON.parse(event.data);
      const script = document.createElement("script");
      script.src = payload.path;
      document.head.appendChild(script);
    };
  }
})({
${modules}
});`;
}

export function transformModule(module: ModuleGraphNode): string {
  const exportedNames: string[] = [];
  let code = module.code.replace(/import\.meta\.hot/g, "__bundle_hot__");

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

export function createHotUpdate(
  graph: ModuleGraphNode[],
  changedFilePath: string,
): string {
  const changedModule = graph.find((module) => module.filePath === changedFilePath);

  if (!changedModule) {
    return "globalThis.__mini_webpack_full_reload__();";
  }

  return createHotUpdateFromModules([createBundleModule(changedModule)]);
}

export function createHotUpdateFromModules(bundleModules: BundleModule[]): string {
  if (bundleModules.length === 0) {
    return "globalThis.__mini_webpack_full_reload__();";
  }

  const modules = bundleModules
    .map((module) => `${JSON.stringify(module.id)}: [
    function(__bundle_require__, __bundle_exports__, __bundle_dependencies__, __bundle_hot__) {
      ${module.factoryCode}
    },
    ${JSON.stringify(module.dependencies)}
  ]`)
    .join(",\n");

  return `globalThis.__mini_webpack_apply_update__({
${modules}
});`;
}
