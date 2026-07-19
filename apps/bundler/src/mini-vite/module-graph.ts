export type ModuleGraphNode = {
  url: string;
  filePath?: string;
  transformed: boolean;
  importedModules: Set<ModuleGraphNode>;
  importers: Set<ModuleGraphNode>;
  acceptedHmrDeps: Set<string>;
  isSelfAccepting: boolean;
};

export type ModuleGraphSnapshot = {
  url: string;
  transformed: boolean;
  importedUrls: string[];
  importerUrls: string[];
  acceptedHmrDeps: string[];
  isSelfAccepting: boolean;
};

export type HmrPayload =
  | {
      type: "update";
      updates: Array<{
        type: "js-update";
        path: string;
        acceptedPath: string;
        timestamp: number;
      }>;
    }
  | {
      type: "full-reload";
      path: string;
    };

export class ModuleGraph {
  private readonly modulesByUrl = new Map<string, ModuleGraphNode>();

  updateModule({
    url,
    filePath,
    importedUrls,
    acceptedHmrDeps = [],
    isSelfAccepting = false,
  }: {
    url: string;
    filePath: string;
    importedUrls: string[];
    acceptedHmrDeps?: string[];
    isSelfAccepting?: boolean;
  }): ModuleGraphNode {
    const module = this.ensureModule(url);

    for (const previousDependency of module.importedModules) {
      previousDependency.importers.delete(module);
    }

    module.filePath = filePath;
    module.transformed = true;
    module.acceptedHmrDeps = new Set(acceptedHmrDeps);
    module.isSelfAccepting = isSelfAccepting;
    module.importedModules = new Set(
      importedUrls.map((importedUrl) => {
        const dependency = this.ensureModule(importedUrl);
        dependency.importers.add(module);
        return dependency;
      }),
    );

    return module;
  }

  getModule(url: string): ModuleGraphNode | undefined {
    return this.modulesByUrl.get(url);
  }

  createHmrPayload(filePath: string, timestamp = Date.now()): HmrPayload {
    const changedModule = [...this.modulesByUrl.values()].find(
      (module) => module.filePath === filePath,
    );

    if (!changedModule) {
      return { type: "full-reload", path: "*" };
    }

    if (changedModule.isSelfAccepting) {
      return {
        type: "update",
        updates: [
          {
            type: "js-update",
            path: changedModule.url,
            acceptedPath: changedModule.url,
            timestamp,
          },
        ],
      };
    }

    const updates = [...changedModule.importers]
      .filter((importer) => importer.acceptedHmrDeps.has(changedModule.url))
      .map((importer) => ({
        type: "js-update" as const,
        path: changedModule.url,
        acceptedPath: importer.url,
        timestamp,
      }));

    if (updates.length > 0) {
      return { type: "update", updates };
    }

    return { type: "full-reload", path: changedModule.url };
  }

  toJSON(): ModuleGraphSnapshot[] {
    return [...this.modulesByUrl.values()]
      .sort((left, right) => left.url.localeCompare(right.url))
      .map((module) => ({
        url: module.url,
        transformed: module.transformed,
        importedUrls: [...module.importedModules].map((dependency) => dependency.url).sort(),
        importerUrls: [...module.importers].map((importer) => importer.url).sort(),
        acceptedHmrDeps: [...module.acceptedHmrDeps].sort(),
        isSelfAccepting: module.isSelfAccepting,
      }));
  }

  private ensureModule(url: string): ModuleGraphNode {
    const existingModule = this.modulesByUrl.get(url);
    if (existingModule) {
      return existingModule;
    }

    const module: ModuleGraphNode = {
      url,
      transformed: false,
      importedModules: new Set(),
      importers: new Set(),
      acceptedHmrDeps: new Set(),
      isSelfAccepting: false,
    };
    this.modulesByUrl.set(url, module);
    return module;
  }
}
