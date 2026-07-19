import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { ModuleGraph, type HmrPayload } from "./module-graph.js";
import { invalidateTransform, transformModule } from "./transform.js";

type CreateDevServerResponseOptions = {
  url: string;
  appRoot: string;
  entryUrl: string;
  moduleGraph?: ModuleGraph;
};

type DevServerResponse = {
  statusCode: number;
  contentType: string;
  body: string;
};

type StartDevServerOptions = {
  appRoot: string;
  entryUrl?: string;
  port?: number;
};

export function createDevServerResponse({
  url,
  appRoot,
  entryUrl,
  moduleGraph,
}: CreateDevServerResponseOptions): DevServerResponse {
  const requestUrl = new URL(url, "http://mini-vite.local");

  if (requestUrl.pathname === "/") {
    return {
      statusCode: 200,
      contentType: "text/html",
      body: createHtml(entryUrl),
    };
  }

  if (requestUrl.pathname === "/__mini_vite_graph") {
    return {
      statusCode: 200,
      contentType: "application/json",
      body: JSON.stringify(moduleGraph?.toJSON() ?? [], null, 2),
    };
  }

  if (requestUrl.pathname === "/@mini-vite/client") {
    return {
      statusCode: 200,
      contentType: "text/javascript",
      body: createHmrClientCode(),
    };
  }

  const filePath = path.resolve(appRoot, requestUrl.pathname.slice(1));
  const relativeFilePath = path.relative(appRoot, filePath);
  const isOutsideAppRoot =
    relativeFilePath.startsWith("..") || path.isAbsolute(relativeFilePath);

  if (isOutsideAppRoot || !fs.existsSync(filePath)) {
    return {
      statusCode: 404,
      contentType: "text/plain",
      body: `Not found: ${requestUrl.pathname}`,
    };
  }

  if (filePath.endsWith(".js")) {
    const transformed = transformModule({ filePath, appRoot });
    moduleGraph?.updateModule({
      url: transformed.url,
      filePath,
      importedUrls: transformed.importedUrls,
      acceptedHmrDeps: transformed.acceptedHmrDeps,
      isSelfAccepting: transformed.isSelfAccepting,
    });

    return {
      statusCode: 200,
      contentType: "text/javascript",
      body: transformed.code,
    };
  }

  return {
    statusCode: 200,
    contentType: "text/plain",
    body: fs.readFileSync(filePath, "utf8"),
  };
}

export function startDevServer({
  appRoot,
  entryUrl = "/src/main.js",
  port = 5173,
}: StartDevServerOptions): void {
  const moduleGraph = new ModuleGraph();
  const hmrClients = new Set<import("node:http").ServerResponse>();

  fs.watch(appRoot, { recursive: true }, (_eventType, changedPath) => {
    if (!changedPath?.endsWith(".js")) {
      return;
    }

    const filePath = path.resolve(appRoot, changedPath);
    invalidateTransform(filePath);
    broadcastHmrPayload(hmrClients, moduleGraph.createHmrPayload(filePath));
  });

  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://mini-vite.local");

    if (requestUrl.pathname === "/__mini_vite_hmr") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.write("retry: 1000\n\n");
      hmrClients.add(response);
      request.on("close", () => hmrClients.delete(response));
      return;
    }

    const result = createDevServerResponse({
      url: request.url ?? "/",
      appRoot,
      entryUrl,
      moduleGraph,
    });

    response.statusCode = result.statusCode;
    response.setHeader("Content-Type", result.contentType);
    response.end(result.body);
  });

  server.listen(port, () => {
    console.log(`Mini Vite dev server: http://localhost:${port}`);
  });
}

function broadcastHmrPayload(
  clients: Set<import("node:http").ServerResponse>,
  payload: HmrPayload,
): void {
  const message = `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    client.write(message);
  }
}

function createHtml(entryUrl: string): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Mini Vite Example</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${entryUrl}"></script>
  </body>
</html>`;
}

function createHmrClientCode(): string {
  return `const callbacks = new Map();

export function createHotContext(ownerPath) {
  return {
  // accept 함수 정의, 상위 모듈에서 변경 된 하위모듈로 바꾸기 위한 작업 실행 함수
    accept(dependency, callback) {
      if (typeof dependency === "function" || dependency === undefined) {
        callbacks.set(ownerPath + ":" + ownerPath, typeof dependency === "function" ? dependency : () => {});
        return;
      }

      const acceptedPath = new URL(dependency, new URL(ownerPath, window.location.origin)).pathname;
      callbacks.set(ownerPath + ":" + acceptedPath, callback ?? (() => {}));
    },
  };
}

const eventSource = new EventSource("/__mini_vite_hmr");
eventSource.onmessage = async (event) => {
  const payload = JSON.parse(event.data);

  if (payload.type === "full-reload") {
    window.location.reload();
    return;
  }

  for (const update of payload.updates) {
    const callback = callbacks.get(update.acceptedPath + ":" + update.path);
    const separator = update.path.includes("?") ? "&" : "?";
    const updatedModule = await import(update.path + separator + "t=" + update.timestamp);
    callback?.(updatedModule);
  }
};`;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startDevServer({
    appRoot: path.resolve("examples/basic-app"),
    port: Number(process.argv[2] ?? 5173),
  });
}
