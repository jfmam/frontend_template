import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createBundler, createHotUpdate } from "./bundle.js";
import { createGraph } from "./graph.js";

type CreateDevServerResponseOptions = {
  url: string;
  entryFilePath: string;
  rootDir: string;
  bundleUrl: string;
};

type DevServerResponse = {
  statusCode: number;
  contentType: string;
  body: string;
};

type StartDevServerOptions = {
  entryFilePath: string;
  rootDir?: string;
  bundleUrl?: string;
  port?: number;
};

type CreateHotUpdateResponseOptions = {
  entryFilePath: string;
  rootDir: string;
  changedFilePath: string;
};

export function createDevServerResponse({
  url,
  entryFilePath,
  rootDir,
  bundleUrl,
}: CreateDevServerResponseOptions): DevServerResponse {
  if (url === "/") {
    return {
      statusCode: 200,
      contentType: "text/html",
      body: createHtml(bundleUrl),
    };
  }

  if (url === bundleUrl) {
    const entryId = toModuleId(path.resolve(entryFilePath), rootDir);
    const graph = createGraph(entryFilePath, { rootDir });

    return {
      statusCode: 200,
      contentType: "text/javascript",
      body: createBundler(graph, { entryId, enableHmr: true }),
    };
  }

  return {
    statusCode: 404,
    contentType: "text/plain",
    body: `Not found: ${url}`,
  };
}

export function createHotUpdateResponse({
  entryFilePath,
  rootDir,
  changedFilePath,
}: CreateHotUpdateResponseOptions): DevServerResponse {
  const graph = createGraph(entryFilePath, { rootDir });

  return {
    statusCode: 200,
    contentType: "text/javascript",
    body: createHotUpdate(graph, changedFilePath),
  };
}

export function startDevServer({
  entryFilePath,
  rootDir = process.cwd(),
  bundleUrl = "/bundle.js",
  port = 8080,
}: StartDevServerOptions): void {
  const hmrClients = new Set<import("node:http").ServerResponse>();
  const changedFilesByTimestamp = new Map<number, string>();
  const watchRoot = path.dirname(entryFilePath);

  fs.watch(watchRoot, { recursive: true }, (_eventType, changedPath) => {
    // 실제로는 js만 체크하지 않음
    if (!changedPath?.endsWith(".js")) {
      return;
    }

    const timestamp = Date.now();
    changedFilesByTimestamp.set(timestamp, path.resolve(watchRoot, changedPath));
    broadcastHmrUpdate(hmrClients, timestamp);
  });

  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://mini-webpack.local");

    if (requestUrl.pathname === "/__mini_webpack_hmr") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.write("retry: 1000\n\n");
      hmrClients.add(response);
      request.on("close", () => hmrClients.delete(response));
      return;
    }

    if (requestUrl.pathname === "/__mini_webpack_hot_update.js") {
      const timestamp = Number(requestUrl.searchParams.get("t"));
      const changedFilePath = changedFilesByTimestamp.get(timestamp);

      if (!changedFilePath) {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/plain");
        response.end("Unknown hot update");
        return;
      }

      const result = createHotUpdateResponse({
        entryFilePath,
        rootDir,
        changedFilePath,
      });
      response.statusCode = result.statusCode;
      response.setHeader("Content-Type", result.contentType);
      response.end(result.body);
      return;
    }

    const result = createDevServerResponse({
      url: request.url ?? "/",
      entryFilePath,
      rootDir,
      bundleUrl,
    });


    response.statusCode = result.statusCode;
    response.setHeader("Content-Type", result.contentType);
    response.end(result.body);
  });

  server.listen(port, () => {
    console.log(`Mini Webpack dev server: http://localhost:${port}`);
  });
}

function broadcastHmrUpdate(
  clients: Set<import("node:http").ServerResponse>,
  timestamp: number,
): void {
  const payload = {
    type: "update",
    path: `/__mini_webpack_hot_update.js?t=${timestamp}`,
  };
  const message = `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    client.write(message);
  }
}

function createHtml(bundleUrl: string): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>Mini Webpack Dev Server Example</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="${bundleUrl}"></script>
  </body>
</html>`;
}

function toModuleId(filePath: string, rootDir: string): string {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

// console.log(process.argv, import.meta)
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startDevServer({
    entryFilePath: path.resolve("examples/basic-app/src/main.js"),
    port: Number(process.argv[2] ?? 8080),
  });
}
