import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createHotUpdateFromModules } from "../mini-webpack/bundle.js";
import { IncrementalCompiler } from "./compiler.js";

type StartDevServerOptions = {
  entryFilePath: string;
  rootDir?: string;
  bundleUrl?: string;
  port?: number;
};

export function startDevServer({
  entryFilePath,
  rootDir = process.cwd(),
  bundleUrl = "/bundle.js",
  port = 8082,
}: StartDevServerOptions): void {
  const compiler = new IncrementalCompiler({ entryFilePath, rootDir });
  const hmrClients = new Set<import("node:http").ServerResponse>();
  const hotUpdatesByTimestamp = new Map<number, string>();
  const watchRoot = path.dirname(entryFilePath);

  fs.watch(watchRoot, { recursive: true }, (_eventType, changedPath) => {
    if (!changedPath?.endsWith(".js")) {
      return;
    }

    const changedFilePath = path.resolve(watchRoot, changedPath);
    const compilation = compiler.compile();
    const changedModule = compilation.bundleModules.find(
      (module) => module.id === toModuleId(changedFilePath, rootDir),
    );
    const timestamp = Date.now();

    hotUpdatesByTimestamp.set(
      timestamp,
      createHotUpdateFromModules(changedModule ? [changedModule] : []),
    );
    broadcastHmrUpdate(hmrClients, timestamp);
  });

  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://mini-rsbuild.local");

    if (requestUrl.pathname === "/") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.end(createHtml(bundleUrl));
      return;
    }

    if (requestUrl.pathname === bundleUrl) {
      const compilation = compiler.getLatestCompilation() ?? compiler.compile();
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/javascript");
      response.end(compilation.bundle);
      return;
    }

    if (requestUrl.pathname === "/__mini_rsbuild_hmr") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.write("retry: 1000\n\n");
      hmrClients.add(response);
      request.on("close", () => hmrClients.delete(response));
      return;
    }

    if (requestUrl.pathname === "/__mini_rsbuild_hot_update.js") {
      const timestamp = Number(requestUrl.searchParams.get("t"));
      const hotUpdate = hotUpdatesByTimestamp.get(timestamp);

      if (!hotUpdate) {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/plain");
        response.end("Unknown hot update");
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/javascript");
      response.end(hotUpdate);
      return;
    }

    if (requestUrl.pathname === "/__mini_rsbuild_stats") {
      const compilation = compiler.getLatestCompilation() ?? compiler.compile();
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(compilation.stats, null, 2));
      return;
    }

    response.statusCode = 404;
    response.setHeader("Content-Type", "text/plain");
    response.end(`Not found: ${requestUrl.pathname}`);
  });

  server.listen(port, () => {
    console.log(`Mini Rsbuild dev server: http://localhost:${port}`);
  });
}

function broadcastHmrUpdate(
  clients: Set<import("node:http").ServerResponse>,
  timestamp: number,
): void {
  const payload = {
    type: "update",
    path: `/__mini_rsbuild_hot_update.js?t=${timestamp}`,
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
    <title>Mini Rsbuild Dev Server Example</title>
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

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startDevServer({
    entryFilePath: path.resolve("examples/basic-app/src/main.js"),
    port: Number(process.argv[2] ?? 8082),
  });
}
