import path from "node:path";

import {
  createBundleModule,
  createBundlerFromModules,
  type BundleModule,
} from "../mini-webpack/bundle.js";
import {
  createGraph,
  type ModuleGraphNode,
} from "../mini-webpack/graph.js";

type IncrementalCompilerOptions = {
  entryFilePath: string;
  rootDir: string;
};

export type CompilationStats = {
  moduleCount: number;
  rebuiltModuleCount: number;
  reusedModuleCount: number;
};

export type CompilationResult = {
  bundle: string;
  graph: ModuleGraphNode[];
  bundleModules: BundleModule[];
  stats: CompilationStats;
};

type CachedModule = {
  fingerprint: string;
  bundleModule: BundleModule;
};

export class IncrementalCompiler {
  private readonly entryFilePath: string;
  private readonly rootDir: string;
  private readonly cachedModules = new Map<string, CachedModule>();
  private latestCompilation?: CompilationResult;

  constructor({ entryFilePath, rootDir }: IncrementalCompilerOptions) {
    this.entryFilePath = path.resolve(entryFilePath);
    this.rootDir = path.resolve(rootDir);
  }

  compile(): CompilationResult {
    const graph = createGraph(this.entryFilePath, { rootDir: this.rootDir });
    let rebuiltModuleCount = 0;
    let reusedModuleCount = 0;
    const activeFilePaths = new Set<string>();
    const bundleModules = graph.map((module) => {
      activeFilePaths.add(module.filePath);
      const fingerprint = createFingerprint(module);
      const cached = this.cachedModules.get(module.filePath);

      if (cached?.fingerprint === fingerprint) {
        reusedModuleCount += 1;
        return cached.bundleModule;
      }

      const bundleModule = createBundleModule(module);
      this.cachedModules.set(module.filePath, { fingerprint, bundleModule });
      rebuiltModuleCount += 1;
      return bundleModule;
    });

    for (const filePath of this.cachedModules.keys()) {
      if (!activeFilePaths.has(filePath)) {
        this.cachedModules.delete(filePath);
      }
    }

    const entryId = toModuleId(this.entryFilePath, this.rootDir);
    const compilation: CompilationResult = {
      bundle: createBundlerFromModules(bundleModules, {
        entryId,
        enableHmr: true,
        hmrEndpoint: "/__mini_rsbuild_hmr",
      }),
      graph,
      bundleModules,
      stats: {
        moduleCount: graph.length,
        rebuiltModuleCount,
        reusedModuleCount,
      },
    };

    this.latestCompilation = compilation;
    return compilation;
  }

  getLatestCompilation(): CompilationResult | undefined {
    return this.latestCompilation;
  }
}

function createFingerprint(module: ModuleGraphNode): string {
  return `${module.code}\u0000${JSON.stringify(module.dependencies)}`;
}

function toModuleId(filePath: string, rootDir: string): string {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}
