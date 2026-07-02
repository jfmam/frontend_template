# Bundler Deep Dive

Webpack, Vite, Rsbuild는 “빠른 도구와 느린 도구”로만 보면 이해가 얕아집니다. 이 학습 폴더에서는 세 도구를 같은 빌드 시스템 질문에 대한 서로 다른 답으로 다룹니다.

- 브라우저는 모듈을 어떻게 찾고 실행할까?
- 빌드 도구는 언제 전체 모듈 그래프를 만들어야 할까?
- 개발 환경과 배포 빌드는 각각 어떤 작업을 중요하게 볼까?
- rebuild, HMR, minification, chunking은 왜 비싸질까?

이 폴더는 번들러 학습 실험실입니다. 먼저 mental model을 정리하고, 이후 Webpack처럼 동작하는 작은 번들러와 Vite처럼 동작하는 작은 dev server를 직접 구현합니다.

## 학습 순서

1. `docs/mental-model` - 번들러가 왜 필요한지, 어떤 문제를 해결하는지 정리
2. `src/mini-webpack` - dependency graph, transform, bundle runtime 구현
3. `src/mini-vite` - dev server, native ESM, import rewrite, HMR 구조 구현
4. `docs/case-studies` - Rsbuild 전환, Vite build OOM, 이력서에 쓸 수 있는 설명 정리

## 첫 실습: Mini Webpack Core

첫 실습은 Webpack의 아주 작은 핵심만 구현합니다.

```txt
entry file
  -> import 수집
  -> dependency graph 생성
  -> ESM import/export를 작은 runtime이 이해하는 형태로 변환
  -> bundle.js 출력
```

실행:

```bash
npm run mini-webpack:dev
npm run mini-webpack:build
```

테스트:

```bash
npm test
```

생성된 예제 결과:

```txt
examples/basic-app/dist/bundle.js
```

이 단계에서 이해해야 하는 핵심은 “번들러가 파일을 합친다”가 아니라, entry에서 시작한 module graph를 만들고 각 module을 runtime이 실행할 수 있는 형태로 바꾼다는 점입니다.

소스 코드는 TypeScript로 작성하고, 실행 전 `tsc`로 `dist-ts`에 JavaScript를 생성합니다. `dist-ts`와 예제 앱의 `dist`는 생성 산출물이므로 git에는 포함하지 않습니다.

## 두 번째 실습: Mini Vite Dev Server

Mini Webpack은 build 시점에 전체 graph를 따라가 `bundle.js`를 만듭니다.

Mini Vite는 dev 시점에 처음부터 전체 bundle을 만들지 않습니다. 브라우저가 module을 요청하면 dev server가 그 파일 하나를 읽고, import 경로를 브라우저가 요청할 수 있는 URL로 바꿔서 응답합니다.

```txt
browser requests /
  -> dev server returns HTML with <script type="module" src="/src/main.js">

browser requests /src/main.js
  -> dev server reads src/main.js
  -> rewrites ./message.js to /src/message.js
  -> returns transformed JavaScript

browser requests /src/message.js
  -> dev server transforms that module on demand
```

실행:

```bash
npm run mini-vite:build
npm run mini-vite:dev
```

이 단계에서 이해해야 하는 핵심은 Vite dev server가 브라우저의 native ESM 로더를 활용한다는 점입니다. Webpack식 실습은 “먼저 graph를 만들고 bundle을 출력”했고, Vite식 실습은 “요청이 들어온 module만 그때 transform”합니다.

Mini Vite production build도 추가했습니다. 이쪽은 dev server와 다르게 entry부터 full graph를 만들고 `vite-dist`에 정적 asset을 출력합니다.

```txt
mini-vite:dev
  -> 요청받은 module만 on-demand transform

mini-vite:build
  -> entry부터 full graph 생성
  -> dist HTML/JS asset 출력
```

## Dev 기준 비교

이제 두 dev server를 같은 기준으로 비교할 수 있습니다.

```txt
Mini Webpack dev server
  browser requests /
  -> HTML returns <script src="/bundle.js">

  browser requests /bundle.js
  -> dev server starts from entry
  -> creates full dependency graph
  -> creates one bundle string in memory
  -> browser executes bundle runtime
```

```txt
Mini Vite dev server
  browser requests /
  -> HTML returns <script type="module" src="/src/main.js">

  browser requests /src/main.js
  -> dev server transforms only main.js
  -> browser reads rewritten imports
  -> browser requests /src/message.js
  -> dev server transforms message.js on demand
```

둘 다 개발 서버를 실행할 수 있지만, 중심이 다릅니다.

- Webpack식 dev server는 bundle을 중심으로 움직입니다.
- Vite식 dev server는 브라우저의 native ESM 요청을 중심으로 움직입니다.

실제 Vite도 한 번 transform한 module을 cache합니다. 이 실습의 `mini-vite/transform.ts`도 같은 파일을 다시 요청하면 메모리 cache에서 transform 결과를 재사용합니다. 다만 첫 요청 전에 전체 앱 bundle을 미리 만들지 않는다는 점이 핵심입니다. 즉 “cache가 있냐 없냐”보다 “처음부터 전체 graph를 처리하느냐, 요청된 module부터 처리하느냐”가 더 큰 차이입니다.

## Build 기준 비교

Production build 기준에서는 Vite도 전체 graph를 봅니다.

```txt
Mini Webpack build
  -> entry부터 dependency graph 생성
  -> bundle runtime 생성
  -> dist/bundle.js 출력
```

```txt
Mini Vite build
  -> entry부터 dependency graph 생성
  -> production asset 생성
  -> vite-dist/index.html
  -> vite-dist/assets/index.js 출력
```

실제 Vite production build는 Rollup 기반으로 tree-shaking, chunking, minification을 수행합니다. 이 실습에서는 Rollup을 직접 구현하지 않고, “Vite dev는 on-demand지만 Vite build는 full graph build다”라는 차이에 집중합니다.

또 하나의 차이는 출력 방식입니다.

```txt
Mini Webpack build
  -> module을 함수로 감쌈
  -> __bundle_require__ runtime 생성
  -> runtime이 module cache와 exports를 관리
```

```txt
Mini Vite build
  -> module graph는 만들지만 Webpack runtime을 만들지 않음
  -> import/export를 제거하고 dependency가 먼저 오도록 코드를 배치
  -> scope-hoisted output에 가까운 형태로 출력
```

실제 Rollup/Vite build는 이보다 훨씬 정교합니다. 변수 충돌 처리, tree-shaking, chunk splitting, dynamic import, side effect 분석이 들어갑니다. 여기서는 “같이 full graph를 보더라도 output model은 다를 수 있다”는 점을 보기 위한 최소 모델입니다.
