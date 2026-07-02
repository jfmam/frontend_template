# 02. Source Graph vs Browser Runtime

## Source Graph

source graph는 개발자가 작성한 애플리케이션의 의존성 구조입니다.

```txt
src/main.js
  -> src/message.js
  -> src/style.css
  -> node_modules/some-package/index.js
```

이 graph에는 다양한 종류의 의존성이 섞일 수 있습니다.

- 상대 경로 import
- package import
- CSS import
- image import
- TypeScript 또는 JSX 파일
- 순환 의존성
- dynamic import
- `export * from "./button"` 같은 barrel export

source graph는 개발자에게 편리하지만, 브라우저가 그대로 실행하기에 항상 편리한 형태는 아닙니다.

## Browser Runtime

브라우저에는 요청 가능한 URL과 실행 가능한 JavaScript가 필요합니다.

native ESM은 모듈을 로드할 수 있지만, 각 import는 브라우저가 요청할 수 있는 URL로 해석되어야 합니다.

```js
import { message } from "./message.js";
```

위 코드는 해당 파일이 실제 URL로 존재한다면 동작할 수 있습니다. 하지만 아래 코드는 브라우저에서 그대로 처리하기 어렵습니다.

```js
import React from "react";
import "./style.css";
import logoUrl from "./logo.svg";
```

이런 import에는 빌드 도구의 결정이 필요합니다.

- `react`는 어디에서 resolve할 것인가?
- CSS는 어떻게 브라우저에 적용할 것인가?
- SVG는 URL이 될 것인가, inline string이 될 것인가, component가 될 것인가?
- 이 module은 현재 chunk에 포함되어야 하는가?

## Webpack식 답

Webpack 계열 도구는 보통 graph를 먼저 만드는 방식으로 답합니다.

```txt
entry
  -> dependency 수집
  -> 포함된 module transform
  -> runtime으로 module 감싸기
  -> bundle file 출력
```

브라우저는 번들러가 미리 준비한 asset을 받습니다.

## Vite dev식 답

Vite 계열 dev server는 개발 환경에서 다른 방식으로 답합니다.

```txt
browser가 /src/main.js 요청
  -> dev server가 해당 파일 transform
  -> browser가 rewrite된 import URL 확인
  -> browser가 다음 module 요청
  -> dev server가 요청 시점에 transform
```

브라우저가 native ESM 요청을 통해 graph traversal에 참여하는 구조입니다.

그래서 Vite는 개발 환경에서 빠르게 시작할 수 있습니다. 첫 페이지 로드 전에 전체 source graph를 전부 transform할 필요가 없기 때문입니다.
