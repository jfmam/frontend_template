import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createBundle } from "./bundle.js";
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
      body: createBundle(graph, { entryId }),
    };
  }

  return {
    statusCode: 404,
    contentType: "text/plain",
    body: `Not found: ${url}`,
  };
}

export function startDevServer({
  entryFilePath,
  rootDir = process.cwd(),
  bundleUrl = "/bundle.js",
  port = 8080,
}: StartDevServerOptions): void {
  const server = createServer((request, response) => {
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

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startDevServer({
    entryFilePath: path.resolve("examples/basic-app/src/main.js"),
    port: Number(process.argv[2] ?? 8080),
  });
}

