declare const process: {
  argv: string[];
  cwd(): string;
  exit(code?: number): never;
};

declare const console: {
  error(...values: unknown[]): void;
  log(...values: unknown[]): void;
};

declare module "node:assert/strict" {
  const assert: {
    equal(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    match(actual: string, expected: RegExp, message?: string): void;
  };
  export default assert;
}

declare module "node:fs" {
  const fs: {
    existsSync(path: string): boolean;
    mkdirSync(path: string, options?: { recursive?: boolean }): void;
    mkdtempSync(prefix: string): string;
    readFileSync(path: string, encoding: "utf8"): string;
    writeFileSync(path: string, data: string): void;
  };
  export default fs;
}

declare module "node:http" {
  export type IncomingMessage = {
    url?: string;
  };

  export type ServerResponse = {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(body?: string): void;
  };

  export type Server = {
    listen(port: number, callback?: () => void): void;
  };

  export function createServer(
    handler: (request: IncomingMessage, response: ServerResponse) => void,
  ): Server;
}

declare module "node:os" {
  const os: {
    tmpdir(): string;
  };
  export default os;
}

declare module "node:path" {
  const path: {
    dirname(filePath: string): string;
    join(...paths: string[]): string;
    relative(from: string, to: string): string;
    resolve(...paths: string[]): string;
    sep: string;
  };
  export default path;
}

declare module "node:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
}

declare module "node:url" {
  export function fileURLToPath(url: string): string;
  export function pathToFileURL(path: string): { href: string };
}

declare module "node:vm" {
  const vm: {
    runInNewContext(code: string, context: Record<string, unknown>): void;
  };
  export default vm;
}
