# 01. 번들러는 왜 필요할까?

## 짧은 답

번들러가 필요한 이유는 우리가 작성하는 코드의 형태와 브라우저가 배포 환경에서 받으면 좋은 코드의 형태가 다르기 때문입니다.

애플리케이션 소스 코드는 사람이 이해하고 수정하기 좋은 형태로 나뉘어 있습니다.

- 작은 파일 여러 개
- 폴더를 넘나드는 import
- TypeScript, JSX, CSS Modules, Sass, 이미지, JSON 같은 여러 자원 타입
- 각자 다른 모듈 형식을 가진 npm 패키지
- 개발 환경에서만 필요한 코드와 환경 분기

반대로 브라우저에 전달되는 코드는 실행과 전송에 유리해야 합니다.

- 파일은 네트워크를 통해 로드됩니다.
- import 경로는 실제로 요청 가능한 URL이어야 합니다.
- 오래된 브라우저를 지원하려면 문법 변환이 필요할 수 있습니다.
- 배포 코드는 사용하지 않는 분기를 제거하는 편이 좋습니다.
- asset은 안정적인 URL, hash, cache 전략이 필요합니다.
- 큰 앱은 하나의 거대한 파일보다 여러 chunk로 나누는 편이 유리할 수 있습니다.

번들러는 이 두 세계 사이에 있습니다.

```txt
source files
  -> import 해석
  -> module graph 생성
  -> module transform
  -> graph 최적화
  -> browser-ready asset 출력
```

## 중요한 관점 전환

번들러를 “파일을 합치는 도구”라고만 설명하면 너무 좁습니다. 파일을 합치는 것은 가능한 결과 중 하나일 뿐입니다.

더 좋은 설명은 아래에 가깝습니다.

```txt
번들러는 애플리케이션의 module graph를 분석하고, 브라우저가 실행할 수 있는 asset을 출력하는 도구다.
```

이 표현이 중요한 이유는 현대 빌드 도구가 단순 연결보다 훨씬 많은 일을 하기 때문입니다.

- dependency resolve
- syntax transform
- JavaScript가 아닌 asset 처리
- 사용하지 않는 export tree-shaking
- code splitting과 chunk 생성
- runtime code 주입
- source map 생성
- output minify
- dev server update 조율

## Webpack, Vite, Rsbuild를 볼 때 왜 중요할까?

Webpack, Vite, Rsbuild는 단순히 “느린 도구 vs 빠른 도구”가 아닙니다. 각 도구는 “언제 어떤 일을 할 것인가”에 대해 서로 다른 선택을 합니다.

Webpack은 전통적으로 전체 module graph와 bundle output을 중심에 둡니다. 거의 모든 것을 graph의 일부로 표현할 수 있기 때문에 강력하지만, 프로젝트가 커지면 transform, plugin, source map, optimization 비용이 커질 수 있습니다.

Vite는 개발 환경의 모델을 바꿉니다. dev에서는 처음부터 전체 애플리케이션을 번들하지 않고, dev server가 source module을 제공하며 브라우저의 native ESM loader가 필요한 모듈을 요청하게 합니다. 다만 production build에서는 최적화된 chunk가 필요하기 때문에 여전히 번들링 단계를 거칩니다.

Rsbuild는 Rspack toolchain을 사용합니다. 이력서에서 중요한 포인트는 단순히 “Rust라서 빠르다”가 아닙니다. 더 강한 설명은 Webpack과 유사한 호환성을 유지하면서 graph 처리, transform, optimization 같은 비싼 작업을 더 빠른 구현 파이프라인으로 옮겼다는 점입니다.

## 이력서 표현으로 바꾸기

약한 표현:

```txt
Webpack을 Rsbuild로 바꿔 빌드 시간을 10분에서 3분으로 줄였습니다.
```

더 나은 표현:

```txt
Webpack production build의 transform과 optimization 단계에서 병목을 분석하고, Webpack 호환 설정을 유지하면서 Rspack/SWC 파이프라인을 사용하는 Rsbuild로 전환했습니다. 이를 통해 production build 시간을 10분에서 3분으로 단축했습니다.
```

근거가 있다면 더 강한 표현:

```txt
Webpack production build를 프로파일링해 transform/minification과 대형 module graph optimization이 주요 병목임을 확인했습니다. alias, env 처리, plugin, output asset 호환성을 검증하며 Rsbuild로 마이그레이션했고, production build 시간을 10분에서 3분으로 단축했습니다.
```
