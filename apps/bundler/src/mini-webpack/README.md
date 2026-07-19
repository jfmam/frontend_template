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

5. HMR
   - source의 `import.meta.hot`을 bundle runtime의 `__bundle_hot__` API로 바꿉니다.
   - 파일이 바뀌면 server는 전체 graph를 다시 만들어 변경 module의 factory만 담은 hot-update script를 만듭니다.
   - browser runtime은 기존 `modules` table에서 해당 factory를 교체하고, 해당 module의 `cache`만 제거합니다.
   - importer가 `accept("./message.js", callback)`을 등록했다면 새 exports를 callback에 전달합니다.
   - accept boundary가 없으면 `location.reload()`로 fallback합니다.

## 아직 구현하지 않은 것

- bare package import 처리
- CSS, 이미지 같은 asset 처리
- TypeScript, JSX transform
- code splitting
- source map
- loader/plugin system
- 여러 단계 HMR propagation
- dispose callback, state 보존, 오류 overlay

이 제한은 의도적입니다. 처음에는 “module graph와 runtime”만 선명하게 보는 것이 목표입니다.

## Vite HMR과 비교

```txt
Mini Vite
  -> browser가 /src/message.js?t=...를 ESM으로 다시 요청
  -> accept callback에 새 ESM namespace 전달

Mini Webpack
  -> server가 hot-update script를 생성
  -> runtime의 modules[moduleId] factory를 교체
  -> cache[moduleId]만 비움
  -> __bundle_require__(moduleId)로 새 exports를 만들고 callback 호출
```

둘 다 accept boundary를 찾지 못하면 full reload로 fallback한다는 점은 같습니다.
차이는 Vite가 native ESM module URL을 다시 요청하는 반면, Webpack은 자체 runtime의 factory와 cache를 갱신한다는 점입니다.

## 실행 방식

소스는 TypeScript로 작성합니다.

```bash
npm run typecheck
npm test
npm run mini-webpack:dev
npm run mini-webpack:build
```

`mini-webpack:build`는 먼저 TypeScript를 `dist-ts`로 컴파일한 뒤, 컴파일된 `build.js`를 실행합니다.
