# HMR은 어떻게 변경된 모듈만 교체할까

프론트엔드 개발 서버를 사용하다 보면 파일을 저장하는 즉시 화면이 바뀐다. 페이지가 새로고침되지 않아도 React 컴포넌트가 갱신되고, 경우에 따라 입력값이나 컴포넌트 상태도 유지된다.

처음에는 이 동작을 단순하게 생각했다.

> 파일이 변경되면 번들러가 다시 빌드하고 브라우저에 새 코드를 전달한다.

하지만 이 설명만으로는 중요한 질문에 답할 수 없다.

- 개발 서버는 어떤 파일이 변경됐는지 어떻게 아는가?
- 변경된 모듈을 사용하는 상위 모듈은 어떻게 찾는가?
- 브라우저가 이미 실행한 모듈을 어떻게 갱신하는가?
- 왜 어떤 변경은 상태를 보존하지만 어떤 변경은 전체 새로고침으로 이어지는가?
- Webpack과 Vite는 같은 HMR을 왜 서로 다르게 구현하는가?

이 글에서는 작은 Webpack과 Vite 개발 서버를 직접 구현하며 이 질문들을 따라간다.

---

## 1. Live Reload와 HMR은 다르다

Live Reload는 파일 변경을 감지하면 브라우저 전체를 새로고침한다.

```text
파일 변경
→ 브라우저 새로고침
→ HTML과 JavaScript 다시 로드
→ 애플리케이션 재실행
→ 런타임 상태 초기화
```

구현은 단순하지만 입력 중이던 값, 열려 있던 모달, 현재 선택한 탭과 같은 런타임 상태가 사라진다.

HMR(Hot Module Replacement)은 페이지를 다시 시작하는 대신 실행 중인 애플리케이션의 일부 모듈만 갱신한다.

```text
파일 변경
→ 변경 모듈 변환
→ 변경을 처리할 수 있는 경계 탐색
→ 브라우저에 update 전달
→ 변경 모듈 평가
→ 애플리케이션에 새 exports 반영
```

따라서 HMR의 핵심은 단순한 파일 감지가 아니다. **변경된 모듈이 현재 실행 중인 애플리케이션에 어떤 영향을 주는지 판단하고, 그 변경을 안전하게 받아줄 위치를 찾는 것**이다.

## 2. HMR의 출발점은 모듈 그래프다

다음과 같은 import 관계를 생각해 보자.

```text
main.js
├── message.js
└── format.js
```

`main.js` 입장에서 `message.js`는 자신이 가져오는 모듈이다.

```text
main.js.importedModules = [message.js, format.js]
```

반대로 `message.js` 입장에서 `main.js`는 자신을 가져오는 상위 모듈이다.

```text
message.js.importers = [main.js]
```

일반적인 build는 entry에서 시작해 `importedModules` 방향으로 그래프를 탐색한다.

```text
entry → dependency → dependency의 dependency
```

하지만 HMR은 변경된 파일에서 시작한다. `message.js`가 바뀌었을 때 개발 서버가 알고 싶은 것은 “`message.js`가 무엇을 import하는가?”가 아니라 “누가 `message.js`의 변경을 받아줄 수 있는가?”다.

```text
message.js 변경
→ message.js.importers 조회
→ main.js 발견
→ main.js가 message.js 변경을 수락하는지 확인
```

그래서 HMR을 지원하는 모듈 그래프는 정방향과 역방향 관계를 함께 관리한다.

```ts
type ModuleGraphNode = {
  url: string;
  importedModules: Set<ModuleGraphNode>;
  importers: Set<ModuleGraphNode>;
  acceptedHmrDeps: Set<string>;
  isSelfAccepting: boolean;
};
```

`importers`가 없다면 변경이 발생할 때마다 전체 그래프를 훑으며 상위 모듈을 찾아야 한다. 역방향 관계를 저장하면 변경된 노드에서 바로 탐색을 시작할 수 있다.

## 3. HMR Boundary란 무엇인가

모든 모듈을 런타임에서 안전하게 교체할 수 있는 것은 아니다. 모듈이 실행되면서 전역 이벤트 리스너를 등록하거나, 다른 코드가 이전 export를 계속 참조하고 있을 수도 있다.

따라서 HMR에는 “이 변경을 여기에서 처리할 수 있다”고 선언하는 경계가 필요하다. 이를 HMR Boundary라고 한다.

Vite에서는 `import.meta.hot.accept()`로 경계를 등록할 수 있다.

```js
import { message } from "./message.js";

function render(value) {
  document.querySelector("#app").textContent = value;
}

render(message);

if (import.meta.hot) {
  import.meta.hot.accept("./message.js", (updatedModule) => {
    render(updatedModule.message);
  });
}
```

이 코드는 다음 의미를 가진다.

```text
main.js는 message.js를 사용한다.
message.js가 변경되면 전체 페이지를 새로고침하지 않아도 된다.
새 message.js의 exports를 callback으로 전달해 달라.
새 값을 화면에 반영하는 작업은 main.js가 수행한다.
```

여기서 `main.js`는 `message.js`에 대한 HMR Boundary가 된다.

모듈이 자신의 변경을 직접 받아들이는 self accept도 있다.

```js
if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    // 자기 자신의 새 exports를 반영한다.
  });
}
```

변경된 모듈부터 importer 방향으로 탐색했는데 어떤 모듈도 변경을 받아주지 않는다면 부분 갱신을 보장할 수 없다. 이때는 전체 새로고침이 안전한 선택이다.

## 4. Mini Vite의 HMR 흐름

Mini Vite에서는 HMR을 다음 순서로 구현했다.

```text
1. 파일 변경 감지
2. transform cache 무효화
3. module graph에서 변경 모듈 조회
4. importer에서 HMR boundary 탐색
5. update 또는 full-reload payload 생성
6. SSE로 브라우저에 payload 전송
7. 브라우저가 변경 모듈을 dynamic import
8. accept callback 실행
```

각 단계를 코드로 살펴보자.

### 4.1 파일 변경 감지와 cache invalidation

개발 서버는 파일 시스템을 감시한다.

```ts
fs.watch(appRoot, { recursive: true }, (_eventType, changedPath) => {
  if (!changedPath?.endsWith(".js")) {
    return;
  }

  const filePath = path.resolve(appRoot, changedPath);
  invalidateTransform(filePath);
  broadcastHmrPayload(hmrClients, moduleGraph.createHmrPayload(filePath));
});
```

파일이 바뀌면 이전 transform 결과는 더 이상 유효하지 않다.

```ts
const transformCache = new Map<string, TransformModuleResult>();

export function invalidateTransform(filePath: string): void {
  transformCache.delete(path.resolve(filePath));
}
```

여기서 모듈 전체를 즉시 다시 변환하지 않는다. 변경된 파일의 cache만 제거하고, 브라우저가 해당 URL을 다시 요청하면 새로운 코드를 읽어 transform한다.

### 4.2 HMR context 주입

브라우저가 원래 소스의 `import.meta.hot`을 자동으로 제공하는 것은 아니다. `import.meta`는 ESM 문법이지만 `hot`은 Vite 개발 서버가 제공하는 기능이다.

Mini Vite는 모듈을 응답하기 전에 다음 코드를 주입한다.

```ts
function injectHmrContext(code: string, url: string): string {
  return `import { createHotContext as __mini_vite_create_hot_context__ }
    from "/@mini-vite/client";
import.meta.hot = __mini_vite_create_hot_context__(${JSON.stringify(url)});
${code}`;
}
```

이제 각 모듈의 `import.meta.hot.accept()`는 자신의 URL과 연결된 callback을 브라우저 HMR client에 등록할 수 있다.

### 4.3 accept 관계를 그래프에 기록하기

transform 단계에서는 import뿐 아니라 어떤 의존성의 변경을 수락하는지도 찾는다.

```ts
const DEPENDENCY_ACCEPT_RE =
  /import\.meta\.hot\.accept\s*\(\s*["']([^"']+)["']/g;
```

예를 들어 `main.js`에서 다음 코드를 발견하면:

```js
import.meta.hot.accept("./message.js", callback);
```

그래프에는 다음 정보가 저장된다.

```text
main.js.acceptedHmrDeps = [/src/message.js]
```

Mini Vite의 정규식 파싱은 학습을 위한 단순화다. 실제 도구는 더 다양한 문법, 플러그인 transform, source map과 오류 처리를 고려한다.

### 4.4 변경을 수락하는 importer 찾기

`message.js`가 변경되면 module graph에서 해당 노드를 찾는다.

```ts
const changedModule = [...this.modulesByUrl.values()].find(
  (module) => module.filePath === filePath,
);
```

자기 변경을 직접 수락한다면 자기 자신이 boundary다.

```ts
if (changedModule.isSelfAccepting) {
  return {
    type: "update",
    updates: [{
      type: "js-update",
      path: changedModule.url,
      acceptedPath: changedModule.url,
      timestamp,
    }],
  };
}
```

그렇지 않으면 자신을 import하는 모듈 중 변경을 수락한 모듈을 찾는다.

```ts
const updates = [...changedModule.importers]
  .filter((importer) => importer.acceptedHmrDeps.has(changedModule.url))
  .map((importer) => ({
    type: "js-update" as const,
    path: changedModule.url,
    acceptedPath: importer.url,
    timestamp,
  }));
```

boundary가 하나도 없다면 full reload payload를 만든다.

```ts
return {
  type: "full-reload",
  path: changedModule.url,
};
```

현재 Mini Vite는 직접 importer 한 단계만 확인한다. 실제 HMR 구현은 여러 단계의 importer 전파, 순환 그래프, dead end, dispose와 prune까지 처리해야 한다.

### 4.5 서버와 브라우저의 연결 유지

서버가 파일 변경을 브라우저에 즉시 알리려면 연결이 유지되어야 한다. Mini Vite는 구조를 단순하게 보기 위해 SSE(Server-Sent Events)를 사용했다.

```ts
if (requestUrl.pathname === "/__mini_vite_hmr") {
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Connection", "keep-alive");
  response.write("retry: 1000\n\n");
  hmrClients.add(response);
}
```

변경이 발생하면 연결된 모든 브라우저 탭에 payload를 전송한다.

```ts
function broadcastHmrPayload(clients, payload) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    client.write(message);
  }
}
```

실제 Vite는 WebSocket을 사용한다. SSE와 WebSocket은 통신 방식이 다르지만, 이 실습에서 필요한 핵심은 개발 서버와 브라우저가 연결을 유지하고 update 메시지를 전달한다는 점이다.

### 4.6 브라우저에서 변경 모듈 다시 평가하기

브라우저 HMR client는 서버가 보낸 payload를 처리한다.

```ts
eventSource.onmessage = async (event) => {
  const payload = JSON.parse(event.data);

  if (payload.type === "full-reload") {
    window.location.reload();
    return;
  }

  for (const update of payload.updates) {
    const callback = callbacks.get(
      update.acceptedPath + ":" + update.path,
    );
    const updatedModule = await import(
      update.path + "?t=" + update.timestamp,
    );
    callback?.(updatedModule);
  }
};
```

`?t=timestamp`를 붙이는 이유는 브라우저의 ESM cache를 우회하기 위해서다.

```text
/src/message.js
/src/message.js?t=1720000000000
```

브라우저에는 서로 다른 URL이므로 새로운 모듈로 로드하고 평가한다. `import()`의 결과는 새 모듈의 exports가 담긴 Module Namespace Object다.

여기서 중요한 점은 Vite가 기존 import binding을 마법처럼 직접 교체하는 것이 아니라는 점이다. boundary가 새 모듈을 callback으로 받고 새 exports를 애플리케이션에 반영할 책임을 가진다.

```text
새 message.js 평가
→ { message: "new message" } 반환
→ main.js의 accept callback 실행
→ render(updatedModule.message)
```

## 5. Mini Webpack은 같은 문제를 어떻게 해결할까

Vite dev는 브라우저의 native ESM을 사용한다. 반면 Mini Webpack은 모든 모듈을 factory 함수로 만들고 자체 runtime에서 실행한다.

```js
{
  "src/message.js": [
    function(__bundle_require__, __bundle_exports__) {
      const message = "hello";
      __bundle_exports__.message = message;
    },
    {}
  ]
}
```

모듈을 처음 실행하면 exports를 cache에 저장한다.

```ts
function __bundle_require__(moduleId) {
  if (cache[moduleId]) {
    return cache[moduleId];
  }

  const [factory, dependencies] = modules[moduleId];
  const exports = {};
  cache[moduleId] = exports;
  factory(__bundle_require__, exports, dependencies);
  return exports;
}
```

HMR update가 도착하면 Webpack식 runtime은 변경된 factory를 전달받는다.

```text
message.js 변경
→ 새 message.js factory 생성
→ hot update script 전달
→ runtime의 modules map에서 factory 교체
```

Mini Webpack의 update 적용 과정은 다음과 같다.

```ts
for (const moduleId of moduleIds) {
  modules[moduleId] = updatedModules[moduleId];
  delete cache[moduleId];
  delete hotCallbacks[moduleId];
}

for (const moduleId of moduleIds) {
  const updatedExports = __bundle_require__(moduleId);
  for (const callback of callbacksByModuleId[moduleId]) {
    callback(updatedExports);
  }
}
```

순서대로 해석하면 다음과 같다.

```text
1. modules map의 기존 factory를 새 factory로 교체
2. 변경 모듈의 runtime cache 삭제
3. __bundle_require__로 새 factory 실행
4. 새로운 exports 생성
5. 해당 변경을 accept한 callback 실행
```

상위 모듈의 factory는 반드시 다시 실행되는 것이 아니다. 상위 모듈이 등록해 둔 accept callback만 실행해 새 exports를 기존 애플리케이션에 반영할 수 있다.

## 6. Vite와 Webpack HMR의 공통점과 차이점

두 구현은 코드 전달 방식이 다르지만 해결하려는 문제는 같다.

```text
변경 감지
→ 변경 영향 범위 판단
→ HMR boundary 탐색
→ 새 모듈 코드 전달
→ 이전 모듈 무효화
→ 새 exports 생성
→ accept callback 실행
```

| 구분 | Webpack식 HMR | Vite식 HMR |
|---|---|---|
| 개발 모듈 | runtime이 관리하는 factory | 브라우저 native ESM |
| 코드 전달 | hot update chunk/script | 변경 모듈 URL 재요청 |
| 실행 주체 | Webpack module runtime | 브라우저 ESM loader |
| cache | runtime의 module exports cache | 브라우저 ESM cache와 서버 transform cache |
| 갱신 | factory 교체 후 cache 삭제 및 재실행 | timestamp URL을 dynamic import |
| 공통점 | boundary를 찾고 새 exports를 callback에 전달 | boundary를 찾고 새 exports를 callback에 전달 |

“Webpack은 매번 전체 그래프를 처음부터 다시 빌드하고, Vite는 변경 파일만 본다”라고만 설명하면 실제 동작을 지나치게 단순화하게 된다.

실제 Webpack watch mode도 이전 compilation 결과와 module cache를 재사용하며 변경된 모듈을 중심으로 새 compilation을 수행한다. 반대로 Vite도 변경된 모듈의 importer를 탐색하고 framework plugin transform을 실행해야 한다. 차이는 전체 작업의 유무보다 **개발 중 모듈을 어떤 형태로 제공하고, 누가 로드와 실행을 담당하느냐**에 더 가깝다.

이 글의 Mini Webpack은 학습을 단순화하기 위해 hot update를 만들 때 entry부터 그래프를 다시 수집한다. 따라서 해당 구현을 실제 Webpack의 성능 모델로 그대로 해석하면 안 된다.

## 7. React Fast Refresh와 HMR은 같은 기능이 아니다

현재 구현에서 accept callback은 직접 DOM을 갱신한다.

```js
import.meta.hot.accept("./message.js", (updatedModule) => {
  render(updatedModule.message);
});
```

React 프로젝트에서는 일반적으로 개발자가 컴포넌트마다 이 callback을 작성하지 않는다. Vite 또는 Webpack의 HMR 위에 React Fast Refresh plugin과 runtime이 결합하기 때문이다.

```text
번들러 HMR
→ 변경된 JavaScript 모듈 로드
→ React Refresh Runtime에 새 컴포넌트 타입 전달
→ 이전 타입과 새 타입 연결
→ 가능한 경우 Hook state 보존
→ React 렌더링과 commit
```

역할을 구분하면 다음과 같다.

```text
HMR: 새 모듈 코드를 브라우저까지 전달하고 적용할 경계를 찾는다.
Fast Refresh: 새 React 컴포넌트를 기존 React tree에 반영하고 상태 보존을 판단한다.
```

따라서 HMR payload가 작더라도 React tree의 높은 위치에 있는 컴포넌트를 변경하면 렌더링 비용이 커질 수 있다. 반대로 leaf 컴포넌트 변경은 같은 HMR 시스템을 사용하더라도 훨씬 빠르게 보일 수 있다.

## 8. 실제 프로젝트에서 확인한 HMR

대규모 레거시 프로젝트에서 Vite의 개발 환경이 기대만큼 빠르지 않았다. 처음에는 다음과 같이 추측했다.

> 의존성 그래프가 크기 때문에 Vite가 파일 변경마다 전체 그래프를 다시 빌드하는 것 아닐까?

하지만 HMR payload와 네트워크 요청을 직접 확인한 결과는 달랐다.

| 항목 | 측정 결과 |
|---|---:|
| update 종류 | `js-update` |
| full reload | 발생하지 않음 |
| `App.tsx` 변경 요청 | 1개 |
| 전송량 | 약 14KB |
| 화면 반영까지 | 약 1.11초 |

변경 시 1,500여 개 모듈이 다시 요청된 것이 아니었다. 변경된 모듈 하나만 다시 요청됐고 HMR boundary도 정상적으로 동작했다.

반면 최초 AdminScreen 진입에서는 다음 결과가 나왔다.

| 항목 | Vite dev |
|---|---:|
| 로컬 모듈 요청 | 약 1,548개 |
| 전송량 | 약 50.23MB |
| 네트워크 idle | 약 6.54초 |

AdminScreen의 정적 import를 `React.lazy`로 일부 전환하자 요청 수는 `1,548개에서 1,117개`, 모듈 수는 `1,515개에서 1,086개`, 로드 시간은 약 `6.54초에서 5.32초`로 감소했다.

이 실험을 통해 처음의 가설을 수정할 수 있었다.

```text
수정 전 가설
Vite가 HMR마다 전체 그래프를 다시 처리해서 느리다.

측정 후 결론
Vite HMR은 변경 모듈 하나를 정상적으로 갱신했다.
더 큰 병목은 최초 화면 진입 시 브라우저가 불러오는 거대한 ESM 그래프였다.
```

Rsbuild/Rspack에서는 서버 rebuild 로그 기준 약 `0.18~0.22초`가 측정됐다. 다만 이 값은 Vite의 “파일 저장부터 브라우저 화면 반영”과 측정 종료 지점이 다를 수 있다. 두 도구의 체감 HMR 성능을 직접 비교하려면 같은 파일을 대상으로 다음 구간을 동일하게 측정해야 한다.

```text
파일 저장
→ 서버 변경 감지
→ transform 또는 compilation 완료
→ update payload 수신
→ 변경 모듈 평가
→ React commit
```

성능 수치를 설명할 때 구현 원리만큼 중요한 것은 **무엇부터 무엇까지 측정했는지 정의하는 것**이었다.

## 9. HMR은 언제 느려질까

HMR은 변경 파일 하나만 전달한다고 항상 즉시 끝나는 것은 아니다.

### 변경 모듈의 importer가 많을 때

공통 유틸리티, 전역 상태, Provider처럼 많은 모듈이 의존하는 파일은 HMR propagation 범위가 커질 수 있다.

### boundary가 너무 높은 곳에 있을 때

변경을 받아줄 경계가 가까이 없으면 importer 방향으로 계속 올라가야 한다. entry까지 도달해도 경계를 찾지 못하면 full reload가 필요하다.

### transform이 비쌀 때

JSX, TypeScript, SVG, CSS 전처리와 plugin hook이 변경 모듈의 응답 시간을 늘릴 수 있다.

### framework의 렌더링 범위가 클 때

HMR update는 하나여도 `App.tsx`나 최상위 Provider 변경은 React tree의 넓은 부분에 영향을 줄 수 있다. 이 비용은 번들러 transform 시간과 구분해야 한다.

### dispose가 필요한 부수 효과가 남아 있을 때

모듈이 타이머나 이벤트 리스너를 등록했다면 교체 전에 정리해야 한다.

```js
const timer = setInterval(tick, 1000);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearInterval(timer);
  });
}
```

정리하지 않으면 HMR을 반복할 때 이전 부수 효과가 누적될 수 있다.

## 10. Mini 구현이 생략한 것

이번 구현은 HMR의 중심 흐름을 보기 위한 최소 모델이다.

- JavaScript 파일만 감시한다.
- 실제 Vite의 WebSocket 대신 SSE를 사용한다.
- 직접 importer 한 단계의 accept만 지원한다.
- `dispose`, `prune`, `invalidate`, 오류 overlay를 구현하지 않았다.
- CSS HMR과 React Fast Refresh를 구현하지 않았다.
- Mini Webpack update 생성은 매번 전체 그래프를 다시 수집한다.
- 정규식으로 import와 `accept()`를 찾으므로 완전한 JavaScript parser가 아니다.

이 제한 덕분에 실제 도구의 수많은 예외 처리보다 다음 본질에 집중할 수 있었다.

```text
모듈 그래프의 역방향 관계
→ HMR boundary 탐색
→ 변경 코드 전달
→ 이전 결과 무효화
→ 새 exports를 애플리케이션에 연결
```

## 마무리

HMR을 단순히 “새로고침 없이 코드가 바뀌는 기능”으로만 보면 개발 서버 내부에서 일어나는 중요한 작업을 놓치게 된다.

개발 서버는 먼저 파일 변경을 감지하고 transform cache를 무효화한다. 이후 모듈 그래프의 importer를 역방향으로 탐색해 변경을 받아줄 HMR boundary를 찾는다. Vite식 개발 서버는 변경된 ESM URL을 다시 요청하고, Webpack식 runtime은 변경된 module factory를 교체한다. 구현 방식은 다르지만 마지막에는 새 exports를 boundary callback에 전달한다는 공통점이 있다.

직접 구현하기 전에는 Webpack이 느린 이유를 “변경할 때마다 entry부터 전부 다시 빌드하기 때문”이라고, Vite가 빠른 이유를 “변경 파일 하나만 보기 때문”이라고 단순하게 생각했다. 작은 HMR을 만들어 보고 실제 payload를 측정하면서 이 설명이 충분하지 않다는 것을 알게 됐다.

> HMR 성능은 전체 그래프를 보느냐 마느냐 하나로 결정되지 않는다. 변경 감지, cache invalidation, importer propagation, transform, 코드 전달, 모듈 평가, framework 렌더링까지 어느 단계에서 비용이 발생하는지 나눠서 봐야 한다.

그리고 실제 프로젝트에서 Vite가 느렸던 주된 지점도 HMR update가 아니라 최초 화면 진입 시 브라우저가 처리해야 했던 1,500여 개의 ESM 모듈 그래프였다. 도구의 철학은 코드베이스 구조와 만났을 때 비로소 실제 성능으로 나타난다.

## 참고 자료

- [Vite HMR API](https://vite.dev/guide/api-hmr)
- [Vite를 사용하는 이유](https://vite.dev/guide/why.html)
- [Webpack Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)
- [Webpack HMR API](https://webpack.js.org/api/hot-module-replacement/)

## 실습 코드

- [`mini-vite/dev-server.ts`](../../src/mini-vite/dev-server.ts)
- [`mini-vite/module-graph.ts`](../../src/mini-vite/module-graph.ts)
- [`mini-vite/transform.ts`](../../src/mini-vite/transform.ts)
- [`mini-webpack/dev-server.ts`](../../src/mini-webpack/dev-server.ts)
- [`mini-webpack/bundle.ts`](../../src/mini-webpack/bundle.ts)
