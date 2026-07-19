import type { ModuleGraphNode } from "../mini-webpack/graph.js";

export type StronglyConnectedComponent = {
  moduleIds: string[];
  cyclic: boolean;
  internalEdgeCount: number;
};

/**
 * Tarjan 알고리즘으로 서로 왕복해서 도달할 수 있는 모듈 묶음을 찾습니다.
 * SCC 탐색 자체는 O(moduleCount + dependencyCount)입니다.
 * 의존성 그래프를 서로 왕복가능한 모듈단위로 묶음
 * 순환이 없는경우는
 */
export function findStronglyConnectedComponents(
  graph: ModuleGraphNode[],
): StronglyConnectedComponent[] {
  const modulesById = new Map(graph.map((module) => [module.id, module]));
  const indexes = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: StronglyConnectedComponent[] = [];
  let nextIndex = 0;

  function visit(moduleId: string): void {
    indexes.set(moduleId, nextIndex); // 각 모듈을 몇번쨰로 처음 방문했는지 저장 index[ModuleA] = 0, index[ModuleB]= 1
    lowLinks.set(moduleId, nextIndex);// moduleId의 의존성을 따라갈 때 가장 오래된 모듈의 index ->
    nextIndex += 1;
    stack.push(moduleId);
    onStack.add(moduleId);

    const module = modulesById.get(moduleId);
    for (const dependencyId of Object.values(module?.dependencies ?? {})) {
      if (!modulesById.has(dependencyId)) {
        continue;
      }

      if (!indexes.has(dependencyId)) {
        visit(dependencyId);
        lowLinks.set(
          moduleId,
          Math.min(lowLinks.get(moduleId)!, lowLinks.get(dependencyId)!),
        );
      } else if (onStack.has(dependencyId)) {
        lowLinks.set(
          moduleId,
          Math.min(lowLinks.get(moduleId)!, indexes.get(dependencyId)!),
        );
      }
    }

    if (lowLinks.get(moduleId) !== indexes.get(moduleId)) {
      return;
    }

    const moduleIds: string[] = [];
    let poppedModuleId: string;
    do {
      poppedModuleId = stack.pop()!;
      onStack.delete(poppedModuleId);
      moduleIds.push(poppedModuleId);
    } while (poppedModuleId !== moduleId);

    const moduleIdSet = new Set(moduleIds);
    const internalEdgeCount = moduleIds.reduce((count, currentModuleId) => {
      const currentModule = modulesById.get(currentModuleId);
      return (
        count +
        Object.values(currentModule?.dependencies ?? {}).filter((dependencyId) =>
          moduleIdSet.has(dependencyId),
        ).length
      );
    }, 0);

    components.push({
      moduleIds: moduleIds.sort(),
      cyclic: moduleIds.length > 1 || internalEdgeCount > 0,
      internalEdgeCount,
    });
  }

  for (const module of graph) {
    if (!indexes.has(module.id)) {
      visit(module.id);
    }
  }

  return components;
}

