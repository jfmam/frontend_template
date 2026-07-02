# 03. 개발 빌드 vs 배포 빌드

개발 환경과 배포 환경은 최적화 목표가 다릅니다.

## 개발 환경

개발 환경은 피드백 속도를 최우선으로 봅니다.

중요한 질문은 아래와 같습니다.

- dev server는 얼마나 빨리 시작되는가?
- 첫 페이지 로드 전까지 얼마나 많은 작업을 하는가?
- 파일 하나가 바뀌었을 때 graph의 어느 범위까지 invalidation되는가?
- full reload 없이 브라우저를 업데이트할 수 있는가?
- debugging하기에 source map 품질은 충분한가?

Vite는 이 지점에서 강합니다. native ESM을 활용하고 module을 요청 시점에 transform하기 때문입니다.

Webpack도 watch mode와 HMR을 지원합니다. 다만 큰 프로젝트에서는 loader, plugin, graph invalidation, source map 비용 때문에 체감 속도가 느려질 수 있습니다.

## 배포 환경

배포 환경은 전달 효율과 실행 효율을 중요하게 봅니다.

중요한 질문은 아래와 같습니다.

- 사용하지 않는 코드를 제거할 수 있는가?
- 공유 dependency를 안정적인 chunk로 분리할 수 있는가?
- asset에 cache를 위한 hash가 붙는가?
- output이 minify되는가?
- source map이 생성되는가?
- CI 메모리 제한 안에서 build가 끝나는가?

Vite production build는 Vite dev와 다릅니다. production에서는 보통 Rollup을 사용해 전체 graph를 build하고 최적화합니다.

이 차이는 build 문제를 설명할 때 중요합니다.

```txt
Vite dev는 upfront full bundling을 피했기 때문에 빨랐다.
하지만 Vite production build는 full-graph optimization, chunking, source map, minification이 필요했다.
```

## OOM 표현

약한 표현:

```txt
Vite에서 순환참조 때문에 OOM이 발생했습니다.
```

더 나은 표현:

```txt
Vite production build가 full-graph optimization 중 CI 메모리 제한을 초과했습니다. 분석 결과 순환 의존성과 barrel export가 특정 chunk graph의 포함 범위를 키웠고, bundling 중 peak memory를 증가시키는 원인으로 작용했습니다.
```

이 표현이 더 정확합니다. 직접적인 실패 원인은 build 중 memory exhaustion이고, 순환 의존성은 build 비용을 키운 graph shape의 일부이기 때문입니다.
