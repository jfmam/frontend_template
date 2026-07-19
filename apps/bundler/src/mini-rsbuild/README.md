# Mini Rsbuild

이 폴더는 Rsbuild의 전체 기능을 흉내 내는 구현이 아닙니다. 정확히는 **Rspack 계열의
incremental bundler dev server가 왜 Webpack과 같은 bundle 중심 구조를 유지하면서도 더 빠를 수
있는지**를 보기 위한 작은 모델입니다.

## 먼저 구분할 것

```txt
Rsbuild = 설정, plugin, dev server 경험을 제공하는 상위 도구
Rspack  = Rust 기반 bundler/compiler engine
```

그래서 이 실습은 이름은 Mini Rsbuild지만, 관심사는 compiler engine의 incremental 동작입니다.

## Dev 흐름

```txt
browser requests /bundle.js
  -> IncrementalCompiler가 최초 full graph를 생성
  -> 각 module을 factory code로 transform
  -> in-memory bundle 응답

message.js 변경
  -> compiler가 graph를 다시 확인
  -> fingerprint가 같은 module factory는 cache에서 재사용
  -> 변경된 message factory만 다시 transform
  -> hot-update script 응답
  -> Webpack식 runtime이 factory 교체 + cache 삭제 + accept callback 실행
```

`/__mini_rsbuild_stats`에서 가장 최근 compilation의 module 재사용 여부를 볼 수 있습니다.

```json
{
  "moduleCount": 3,
  "rebuiltModuleCount": 1,
  "reusedModuleCount": 2
}
```

## Mini Webpack과 차이

```txt
Mini Webpack dev
  -> /bundle.js 요청마다 graph 생성과 모든 factory transform

Mini Rsbuild dev
  -> compiler instance를 계속 유지
  -> 바뀌지 않은 source와 dependency map의 factory transform 결과를 재사용
  -> 변경 module만 factory를 다시 생성
```

이것은 **incremental compilation의 모양**을 보여준다. 이 JavaScript 구현이 실제 Rspack보다
빠르다는 뜻은 아니다. 간단함을 위해 매 compilation마다 graph를 다시 읽어 dependency를 확인한다.

## 왜 JavaScript만으로 Rspack 속도를 재현할 수 없나

Node.js에도 `worker_threads`가 있어서 CPU 작업을 병렬 처리할 수 있습니다. 하지만 `thread-loader`처럼
일부 transform만 worker로 보내면 보통 다음 비용이 생깁니다.

```txt
main compiler state
  -> module source / loader input을 worker에 전달
  -> 직렬화 및 worker scheduling
  -> 결과를 main compiler로 반환
  -> graph, resolver, plugin, code generation 단계와 다시 조합
```

중요한 비용은 단순한 context switching 하나가 아니라, **worker 경계의 전달/직렬화 비용과
compiler state가 분리되는 비용**입니다. Node worker도 `SharedArrayBuffer`를 직접 설계하면 일부 memory를
공유할 수 있지만, Webpack의 graph와 plugin pipeline이 자동으로 공유되는 것은 아닙니다.

Rspack은 Rust native thread와 통합된 compiler data structure 안에서 graph, transform, code generation,
cache를 설계합니다. 따라서 더 넓은 pipeline을 병렬화하고 JavaScript worker 왕복을 줄일 여지가 큽니다.
그렇다고 모든 단계가 병렬인 것은 아니며, graph 연결, chunk 결정, 순서 의존 plugin 작업에는 동기화와
병목이 남습니다.

## Vite와 비교할 때의 핵심

```txt
Vite dev
  -> native ESM source module을 browser가 요청
  -> requested module만 transform

Rsbuild/Rspack dev
  -> bundler가 graph와 bundle runtime을 관리
  -> incremental compiler/cache/native pipeline 효율이 중요
```

레거시 앱이 많은 화면을 static import하면 Vite의 on-demand source module 장점은 줄어들 수 있습니다.
그 상황에서 Rsbuild가 빨랐다면, “Vite가 느려서”라고만 보기보다 import topology와 Rspack의
incremental compilation 비용을 나누어 측정해야 합니다.
