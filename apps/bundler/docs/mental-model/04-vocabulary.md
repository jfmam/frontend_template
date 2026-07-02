# 04. 용어 정리

## Module Graph

하나 이상의 entry에서 시작해 파일과 dependency 관계를 나타낸 graph입니다.

```txt
main.js -> message.js -> format.js
```

번들러가 이해하는 핵심 대상은 이 graph입니다.

## Entry

graph traversal을 시작하는 module입니다.

애플리케이션에서는 보통 `src/main.js` 또는 `src/index.tsx`가 entry가 됩니다.

## Transform

module을 한 형태에서 다른 형태로 변환하는 과정입니다.

예시:

- TypeScript를 JavaScript로 변환
- JSX를 JavaScript로 변환
- Sass를 CSS로 변환
- 최신 JavaScript를 오래된 JavaScript로 변환
- CSS import를 JavaScript style injection 코드로 변환

## Bundle Runtime

번들된 module들이 브라우저 안에서 서로를 import할 수 있도록 번들러가 출력하는 작은 helper code입니다.

Mini Webpack에서는 작은 `require` runtime을 직접 구현해서 이 개념을 눈으로 확인합니다.

## Native ESM

브라우저에 내장된 JavaScript module system입니다.

Vite는 개발 환경에서 native ESM을 적극적으로 활용합니다.

## HMR

Hot Module Replacement는 full page reload 없이 변경된 module을 업데이트하는 방식입니다.

HMR은 단순히 “빠른 새로고침”이 아닙니다. 어떤 module이 바뀌었는지, 어떤 module이 그것을 import하는지, 전체 페이지를 reload하지 않고 update를 accept할 수 있는지를 도구가 알아야 합니다.

## Tree-Shaking

production output에서 사용하지 않는 export를 제거하는 최적화입니다.

Tree-shaking은 static analysis에 의존합니다. dynamic import, side effect, barrel export, circular dependency는 분석을 어렵게 만들 수 있습니다.

## Chunking

output을 여러 파일로 나누는 작업입니다.

Chunking은 caching, initial load, lazy loading, build memory에 영향을 줍니다.

## Peak Memory

프로세스 실행 중 도달한 가장 높은 메모리 사용량입니다.

Build tool은 graph analysis, source map, minification, chunk optimization 과정에서 일시적으로 너무 많은 데이터를 메모리에 들고 있으면 OOM으로 실패할 수 있습니다.
