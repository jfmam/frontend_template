import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { transformModule } from "./transform.js";

type CreateDevServerResponseOptions = {
  url: string;
  appRoot: string;
  entryUrl: string;
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
}: CreateDevServerResponseOptions): DevServerResponse {
  if (url === "/") {
    return {
      statusCode: 200,
      contentType: "text/html",
      body: createHtml(entryUrl),
    };
  }

  const filePath = path.resolve(appRoot, url.slice(1));

  if (!filePath.startsWith(appRoot) || !fs.existsSync(filePath)) {
    return {
      statusCode: 404,
      contentType: "text/plain",
      body: `Not found: ${url}`,
    };
  }

  if (filePath.endsWith(".js")) {
    return {
      statusCode: 200,
      contentType: "text/javascript",
      body: transformModule({ filePath, appRoot }).code,
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
  const server = createServer((request, response) => {
    const result = createDevServerResponse({
      url: request.url ?? "/",
      appRoot,
      entryUrl,
    });

    response.statusCode = result.statusCode;
    response.setHeader("Content-Type", result.contentType);
    response.end(result.body);
  });

  server.listen(port, () => {
    console.log(`Mini Vite dev server: http://localhost:${port}`);
  });
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

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startDevServer({
    appRoot: path.resolve("examples/basic-app"),
    port: Number(process.argv[2] ?? 5173),
  });
}

