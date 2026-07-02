# Mini Vite

이 폴더는 Vite production build가 아니라 Vite dev server의 핵심 아이디어를 작게 구현합니다.

## Webpack식 실습과 다른 점

Mini Webpack:

```txt
entry
  -> dependency graph 전체 생성
  -> bundle runtime 생성
  -> bundle.js 출력
  -> browser가 bundle.js 실행
```

Mini Vite:

```txt
browser가 /src/main.js 요청
  -> dev server가 main.js만 읽음
  -> import 경로를 URL로 rewrite
  -> browser가 다음 module을 직접 요청
  -> dev server가 다음 module을 그때 transform
```

## 현재 구현한 것

1. `transform.ts`
   - 요청받은 파일 하나를 읽습니다.
   - 상대 경로 import를 브라우저 URL로 바꿉니다.
   - 예: `./message.js` -> `/src/message.js`
   - 한 번 transform한 module 결과를 메모리 cache에 저장합니다.

2. `dev-server.ts`
   - `/` 요청에는 ESM entry를 로드하는 HTML을 응답합니다.
   - `/src/*.js` 요청에는 해당 파일만 on-demand transform해서 응답합니다.

3. `build.ts`
   - dev server와 달리 entry부터 full graph를 생성합니다.
   - `vite-dist/index.html`과 `vite-dist/assets/index.js`를 출력합니다.
   - Webpack식 `__bundle_require__` runtime을 만들지 않습니다.
   - dependency module이 먼저 오도록 코드를 배치하고 import/export를 제거해 scope-hoisted output에 가까운 형태를 만듭니다.
   - 실제 Vite production build는 Rollup 기반이지만, 이 실습에서는 full graph build와 output model 차이에 집중합니다.

## 아직 구현하지 않은 것

- npm package pre-bundling
- TypeScript/JSX transform
- CSS transform
- HMR
- 파일 변경 시 cache invalidation
- production build

이 제한은 의도적입니다. 처음에는 “dev에서 전체 bundle을 만들지 않는다”는 차이를 보는 것이 목표입니다.

## Cache가 있어도 Webpack식과 다른 이유

Vite도 transform 결과를 cache할 수 있습니다. 하지만 cache가 있다는 사실만으로 Webpack dev server와 같아지는 것은 아닙니다.

핵심 차이는 초기 작업 단위입니다.

```txt
Webpack식 dev server
  -> /bundle.js 요청
  -> entry부터 full graph 생성
  -> bundle을 만들어 응답
```

```txt
Vite식 dev server
  -> /src/main.js 요청
  -> main.js만 transform
  -> browser가 import를 따라 다음 module 요청
  -> 요청된 module만 transform하고 cache
```

즉 Vite의 cache는 on-demand transform 결과를 재사용하기 위한 cache입니다. 처음부터 전체 앱 bundle을 만들어두는 방식과는 출발점이 다릅니다.

## Dev와 Build는 다르다

Vite의 핵심을 말할 때 자주 헷갈리는 지점입니다.

```txt
vite dev
  -> native ESM
  -> on-demand transform
  -> module transform cache
```

```txt
vite build
  -> full graph analysis
  -> tree-shaking
  -> chunking
  -> static asset output
```

그래서 Vite를 평가할 때는 “개발 서버가 빠른가”와 “배포 번들이 잘 쪼개지고 최적화되는가”를 나눠서 봐야 합니다.

## Webpack build와 output이 다른 점

Webpack식 output은 module runtime 중심입니다.

```txt
modules map
  -> module factory 함수들
  -> __bundle_require__
  -> exports cache
```

Vite/Rollup식 production output은 가능한 경우 runtime module wrapper를 줄이고, module code를 한 스코프에 배치하는 scope hoisting에 가깝습니다.

```txt
dependency code
entry code
```

이 실습의 `build.ts`는 아주 단순한 형태로 그 차이만 보여줍니다. 실제 Rollup은 이름 충돌, side effect, dynamic import, chunk boundary를 훨씬 정교하게 처리합니다.
