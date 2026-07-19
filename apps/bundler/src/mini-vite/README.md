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
   - 파일 변경을 감시하고 SSE로 HMR update를 browser client에 보냅니다.

3. `module-graph.ts`
   - transform한 module의 import 관계를 기록합니다.
   - `importedModules`와 `importers`를 양방향으로 연결합니다.
   - import에서 발견했지만 브라우저가 아직 요청하지 않은 module은
     `transformed: false`로 구분합니다.
   - `/__mini_vite_graph`에서 현재 graph를 JSON으로 확인할 수 있습니다.

4. HMR
   - transform 시 `/@mini-vite/client`와 `import.meta.hot` context를 module에 주입합니다.
   - `import.meta.hot.accept("./message.js", callback)`을 읽어 HMR boundary를 기록합니다.
   - `message.js`가 바뀌면 `importers`에서 `main.js`를 역방향으로 찾습니다.
   - `main.js`가 `message.js`를 accept했다면 browser는 `/src/message.js?t=...`를 다시 import하고,
     callback으로 받은 새 module을 이용해 화면 일부만 갱신합니다.
   - accept boundary가 없으면 `full-reload` 메시지를 보냅니다.

5. `build.ts`
   - dev server와 달리 entry부터 full graph를 생성합니다.
   - `vite-dist/index.html`과 `vite-dist/assets/index.js`를 출력합니다.
   - Webpack식 `__bundle_require__` runtime을 만들지 않습니다.
   - dependency module이 먼저 오도록 코드를 배치하고 import/export를 제거해 scope-hoisted output에 가까운 형태를 만듭니다.
   - 실제 Vite production build는 Rollup 기반이지만, 이 실습에서는 full graph build와 output model 차이에 집중합니다.

6. `scc.ts`
   - production build의 전체 graph에서 Strongly Connected Component를 찾습니다.
   - `a.js -> b.js -> a.js`처럼 서로 다시 도달할 수 있는 module들을 하나의 SCC로 묶습니다.
   - SCC 탐색 자체는 `O(V + E)`이므로 순환 참조가 있다는 사실만으로 build가 매우 느려지지는 않습니다.
   - 다만 큰 SCC는 module을 독립적으로 정렬, 제거, chunk 분리하기 어렵게 만들어 이후 최적화의 단위를 키울 수 있습니다.

## SCC 실습

```txt
main.js -> a.js -> b.js
                   -> a.js

SCC 1: [main.js]       순환 아님
SCC 2: [a.js, b.js]    순환 참조
```

다음 명령은 순환 예제를 build하고 단계별 시간과 SCC를 출력합니다.

```bash
npm run mini-vite:build:circular
```

예상 보고서 형태:

```txt
[Mini Vite build report]
graph: 3 modules, 3 dependencies
circular SCC: 1
  - src/a.js <-> src/b.js (2 internal edges)
timings: graph=..., scc=..., transform=..., emit=..., total=...
```

이 작은 예제에서 SCC 때문에 build가 눈에 띄게 느려지지는 않습니다. 실제 대규모 앱의 느린 build는
보통 module/edge 수, AST 크기, plugin transform, source map, tree shaking, chunking, minification 비용이
합쳐진 결과입니다. 순환 참조는 그중 tree shaking, 실행 순서, chunk 경계 분석을 어렵게 만드는
**그래프 구조상의 증폭 요인**으로 이해해야 합니다.

## 아직 구현하지 않은 것

- npm package pre-bundling
- TypeScript/JSX transform
- CSS transform
- CSS HMR
- TypeScript/JSX HMR
- 여러 단계에 걸친 HMR propagation
- HMR dispose, state 보존, 오류 overlay

이 제한은 의도적입니다. 처음에는 “dev에서 전체 bundle을 만들지 않는다”는 차이를 보는 것이 목표입니다.

## HMR이 importers를 필요로 하는 이유

파일 시스템은 `message.js가 바뀌었다`는 사실만 알려줍니다. 하지만 browser가 받아들일 수 있는
update인지 판단하려면 **누가 그 module을 import했는지**를 알아야 합니다.

```txt
main.js --imports--> message.js

message.js 변경
  -> message.js.importers 확인
  -> main.js가 message.js를 accept했는지 확인
  -> main.js의 callback에 새 message module 전달
```

정방향 `importedModules`만 있으면 변경된 module마다 graph 전체를 훑어 importer를 찾아야 합니다.
`importers`를 함께 저장하면 변경 지점에서 바로 역방향 전파를 시작할 수 있습니다.

이 미니 구현은 이해를 위해 **직접 importer의 dependency accept**만 지원합니다. 실제 Vite는
여러 경계, self-accept, dispose, CSS, framework runtime과 결합한 더 복잡한 propagation을 처리합니다.

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
