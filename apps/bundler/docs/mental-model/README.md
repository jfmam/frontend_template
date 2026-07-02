# Mental Model

번들러는 단순히 파일을 합치는 도구가 아닙니다. 개발자가 작성한 source graph를 브라우저가 효율적으로 로드하고, 캐시하고, 실행하고, 업데이트할 수 있는 형태로 바꾸는 빌드 시스템입니다.

이 섹션은 Webpack이나 Vite 자체보다 앞에서 시작합니다. 목표는 “왜 번들러라는 도구가 필요해졌는가”를 먼저 이해하는 것입니다.

## 질문

1. 브라우저 실행 환경은 우리가 작성한 프로젝트 소스 코드와 무엇이 다를까?
2. 왜 module graph가 필요할까?
3. 개발 환경과 배포 빌드는 왜 서로 다른 방향으로 최적화될까?
4. 같은 source graph가 Webpack, Vite, Rsbuild에서 왜 다른 비용을 만들까?
5. 이 개념들을 어떻게 이력서와 면접에서 더 강한 설명으로 바꿀 수 있을까?

## 노트

- [01. 번들러는 왜 필요할까?](./01-why-bundlers-exist.md)
- [02. Source Graph vs Browser Runtime](./02-source-graph-vs-browser-runtime.md)
- [03. 개발 빌드 vs 배포 빌드](./03-dev-vs-production.md)
- [04. 용어 정리](./04-vocabulary.md)
