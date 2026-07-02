# Mini Webpack

이 폴더는 Webpack의 전체 기능을 따라 만들지 않습니다. 대신 번들러 core를 이해하는 데 필요한 최소 흐름만 구현합니다.

## 현재 구현한 것

1. `graph.ts`
   - entry 파일에서 시작합니다.
   - static ESM import를 찾습니다.
   - 상대 경로 import를 실제 파일 경로로 resolve합니다.
   - module id와 dependency map을 가진 dependency graph를 만듭니다.

2. `bundle.ts`
   - 각 module을 함수로 감쌉니다.
   - `import`를 `__bundle_require__` 호출로 바꿉니다.
   - `export`를 `__bundle_exports__` 할당으로 바꿉니다.
   - 작은 module cache와 runtime을 생성합니다.

3. `build.ts`
   - graph를 만들고 bundle 문자열을 생성합니다.
   - output 경로에 `bundle.js`를 씁니다.

4. `dev-server.ts`
   - `/` 요청에는 `/bundle.js`를 로드하는 HTML을 응답합니다.
   - `/bundle.js` 요청이 들어오면 entry부터 dependency graph를 만들고 bundle 문자열을 메모리에서 응답합니다.
   - 실제 webpack-dev-server도 파일로 매번 쓰기보다 메모리 기반 compilation 결과를 서빙하는 방식에 가깝습니다.

## 아직 구현하지 않은 것

- bare package import 처리
- CSS, 이미지 같은 asset 처리
- TypeScript, JSX transform
- code splitting
- source map
- loader/plugin system
- HMR

이 제한은 의도적입니다. 처음에는 “module graph와 runtime”만 선명하게 보는 것이 목표입니다.

## 실행 방식

소스는 TypeScript로 작성합니다.

```bash
npm run typecheck
npm test
npm run mini-webpack:dev
npm run mini-webpack:build
```

`mini-webpack:build`는 먼저 TypeScript를 `dist-ts`로 컴파일한 뒤, 컴파일된 `build.js`를 실행합니다.
