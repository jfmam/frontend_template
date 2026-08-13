# shadcn + React 19로 AntD 대안 실험하기

React 19와 shadcn/ui를 사용해 Ant Design과 비슷한 업무용 UI 경험을 만들 수 있는지 검증하는 연습용 프로젝트입니다.

목표는 AntD의 컴포넌트 API를 그대로 복제하는 것이 아닙니다. AntD를 사용할 때 얻었던 일관된 디자인, 촘촘한 업무 화면, 빠른 개발 경험을 유지하면서도 컴포넌트 소스를 직접 소유하고 자유롭게 수정할 수 있는지 확인합니다.

## 만드는 이유

현재 팀에서는 완성도 높은 컴포넌트와 빠른 화면 개발을 위해 AntD를 사용하고 있습니다. AntD는 좋은 선택이지만, 제품의 디자인이 AntD의 기본 형태와 달라질수록 테마 설정과 CSS 덮어쓰기가 늘어날 수 있습니다.

shadcn/ui는 완성된 컴포넌트 패키지를 런타임에 가져다 쓰는 방식이 아니라, 필요한 컴포넌트 코드를 프로젝트 안으로 가져와 직접 관리하는 방식입니다. 이 차이가 실제 업무에서 다음 장점으로 이어지는지 확인하려고 합니다.

- 제품 디자인에 맞게 컴포넌트를 수정하기 쉬운가?
- 전역 CSS 덮어쓰기 없이 디자인 토큰으로 일관성을 유지할 수 있는가?
- 접근성과 키보드 동작을 유지하면서 업무용 UI를 만들 수 있는가?
- AntD만큼 빠르게 Form, Dialog, Table 중심 화면을 개발할 수 있는가?
- 컴포넌트 코드를 직접 소유하는 유지보수 비용이 감당 가능한가?

이 프로젝트는 “AntD를 반드시 제거한다”는 결론을 정해 놓은 작업이 아닙니다. 작은 기준 화면을 양쪽 방식으로 만들어 보고, 실제 비용과 장점을 비교하기 위한 실험입니다.

## AntD와 shadcn/ui의 차이

| 관점 | Ant Design | shadcn/ui |
| --- | --- | --- |
| 제공 방식 | 설치한 패키지에서 컴포넌트를 import | 필요한 컴포넌트 소스를 프로젝트에 추가 |
| 기본 제공 범위 | 업무용 컴포넌트가 폭넓게 준비됨 | 필요한 컴포넌트만 선택해 구성 |
| 디자인 변경 | 테마 설정과 스타일 확장 중심 | 가져온 소스와 토큰을 직접 수정 |
| 접근성 기반 | AntD가 구현을 관리 | Radix UI가 주요 상호작용을 담당 |
| 업그레이드 | 패키지 버전을 올려 일괄 반영 | 변경 내용을 비교한 뒤 프로젝트 소스에 반영 |
| 유지보수 책임 | 라이브러리의 구현에 크게 의존 | 프로젝트가 수정한 컴포넌트 코드를 소유 |

shadcn/ui는 AntD의 일대일 대체 라이브러리가 아닙니다. 특히 복잡한 Table, DatePicker, Tree, Upload 같은 컴포넌트는 조합과 추가 구현이 필요할 수 있습니다. 이 차이를 숨기지 않고 실제 화면을 통해 확인하는 것이 이 프로젝트의 핵심입니다.

## 현재 기술 구성

| 기술 | 역할 |
| --- | --- |
| React 19 | UI 렌더링 |
| TypeScript | 타입 검사 |
| Vite 8 | 개발 서버와 프로덕션 빌드 |
| shadcn CLI v4 | 컴포넌트 코드 설치와 설정 |
| Radix UI | 접근성을 고려한 headless UI primitive |
| Tailwind CSS 4 | 컴포넌트 스타일링 |
| CSS variables | 색상, radius 등 디자인 토큰 관리 |
| CVA | 컴포넌트 variant 관리 |

shadcn 설정은 `radix-nova` 스타일과 CSS variables를 사용합니다. 아이콘 라이브러리는 컴포넌트에 고정하지 않고, 사용처에서 `children`으로 주입합니다. 현재는 AntD의 업무용 밀도를 기준으로 Button의 액션 계층, 상태, 크기, light/dark 토큰을 첫 수직 단면으로 구현한 상태입니다.

## 시작하기

### 요구 환경

- Node.js 22
- pnpm 11.10

이 앱은 저장소 루트의 pnpm workspace에 포함되어 있습니다. 저장소 루트에서 다음 명령을 실행합니다.

```bash
corepack enable
pnpm install
pnpm --filter shadcn-antd dev
```

기본 개발 서버 주소는 `http://localhost:5173`입니다.

### 주요 명령어

```bash
# 개발 서버
pnpm --filter shadcn-antd dev

# TypeScript 검사
pnpm --filter shadcn-antd typecheck

# ESLint 검사
pnpm --filter shadcn-antd lint

# Button 동작 테스트
pnpm --filter shadcn-antd test

# 프로덕션 빌드
pnpm --filter shadcn-antd build

# 빌드 결과 미리보기
pnpm --filter shadcn-antd preview
```

## shadcn 컴포넌트 추가하기

shadcn/ui에서는 사용할 컴포넌트만 CLI로 가져옵니다. 저장소 루트에서 workspace filter로 이 앱에 설치된 CLI를 실행합니다. 프로젝트에 lock된 버전을 사용하므로 모든 개발자가 같은 결과를 재현할 수 있습니다.

```bash
pnpm --filter shadcn-antd exec shadcn add input
pnpm --filter shadcn-antd exec shadcn add select dialog
```

추가된 파일은 `src/components/ui`에 들어옵니다. 이 파일들은 외부 패키지의 내부 코드가 아니라 이 프로젝트가 직접 수정하고 관리하는 소스입니다.

컴포넌트를 다시 가져오기 전에 현재 소스와 registry 버전의 차이를 먼저 확인합니다.

```bash
pnpm --filter shadcn-antd exec shadcn add button --diff
```

기존 파일을 무조건 덮어쓰는 `--overwrite`는 로컬 수정사항을 잃을 수 있으므로 diff를 확인한 뒤 사용합니다.

## 컴포넌트 사용하기

`@/`는 `src/`를 가리키는 import alias입니다.

```tsx
import { Button } from "@/components/ui/button"

export function SaveButton() {
  return (
    <Button variant="primary" type="submit" loading={false}>
      저장
    </Button>
  )
}
```

variant와 size는 컴포넌트가 제공하는 범위 안에서 조합합니다.

```tsx
<Button variant="default" size="small">
  취소
</Button>
```

Button은 `primary`, `default`, `dashed`, `text`, `link`, `danger`, `danger-outline`, `ghost` variant와 24·32·40px 크기를 제공합니다. `loading`을 지정하면 중복 클릭을 막고 `aria-busy`를 자동으로 적용합니다. 아이콘 전용 Button은 `aria-label` 또는 `aria-labelledby`를 제공해야 합니다. 자세한 사용 원칙은 [`docs/button.md`](./docs/button.md)에 있습니다.

아이콘은 사용하는 앱이 선택한 라이브러리의 React 노드를 그대로 전달합니다. shadcn CLI가 아이콘이 포함된 컴포넌트를 생성하면 기본 아이콘 import를 팀에서 쓰는 라이브러리로 교체합니다.

## 디렉터리 구조

```text
apps/shadcn-antd/
├── components.json            # shadcn registry와 생성 경로 설정
├── docs/
│   └── button.md             # Button API, 사용 원칙, 접근성 결정
├── src/
│   ├── components/
│   │   ├── ui/                # shadcn에서 가져와 직접 소유하는 UI primitive
│   │   └── theme-provider.tsx # light/dark/system 테마 처리
│   ├── lib/
│   │   └── utils.ts           # Tailwind class를 합치는 cn 함수
│   ├── App.tsx                # 현재 실험 화면
│   ├── index.css              # Tailwind 진입점과 디자인 토큰
│   └── main.tsx               # React 진입점과 provider 설정
├── package.json
└── vite.config.ts             # Vite, Tailwind, @ alias 설정
```

### 파일을 나누는 기준

- `src/components/ui`: Button, Input처럼 여러 화면에서 재사용할 기본 UI
- `src/components`: 여러 기본 UI를 조합한 앱 공통 컴포넌트
- 화면 가까운 위치: 한 화면에서만 쓰는 컴포넌트
- `src/index.css`: 색상, radius, typography처럼 전체 UI가 공유하는 토큰

단순히 shadcn 컴포넌트의 이름만 바꾸는 wrapper는 만들지 않습니다. 공통 동작이나 제품 규칙이 생겼을 때만 별도 컴포넌트로 분리합니다.

## AntD와 비슷한 디자인을 만드는 원칙

AntD의 DOM 구조나 class 이름을 복제하지 않습니다. 사용자가 느끼는 시각적 밀도와 일관성을 토큰과 컴포넌트 variant로 구현합니다.

1. 색상, 글꼴, radius, control height 같은 디자인 토큰을 먼저 정합니다.
2. Button, Input, Select처럼 자주 쓰는 기본 컴포넌트에 토큰을 적용합니다.
3. Form, Dialog처럼 여러 컴포넌트가 만나는 패턴을 확인합니다.
4. 마지막으로 Table 중심의 실제 업무 화면을 만들어 개발 비용을 측정합니다.
5. 접근성, 로딩, 오류, disabled, 빈 상태도 정상 상태와 함께 확인합니다.

스타일을 사용할 때마다 임의의 Tailwind 값을 추가하기보다, 반복되는 값은 `src/index.css`의 토큰으로 올립니다. 반대로 한 번만 쓰는 값을 미래를 위해 미리 토큰화하지는 않습니다.

## 실험 순서

### 0. 기본 환경

- [x] React 19 + TypeScript + Vite 설치
- [x] shadcn/ui + Radix UI 설치
- [x] Tailwind CSS 4와 CSS variables 설정
- [x] Button 설치
- [x] light/dark/system 테마 설정

### 1. 기본 디자인 토큰

- [x] Button에 필요한 primary, neutral, destructive 색상
- [ ] typography와 글자 크기
- [x] Button radius와 shadow
- [x] 24·32·40px control 높이와 화면 밀도
- [x] Button focus ring과 disabled 상태

### 2. 기본 컴포넌트

- [x] Button의 AntD 스타일과 loading·disabled·ARIA 상태 검증
- [ ] Input
- [ ] Select
- [ ] Checkbox와 Radio
- [ ] Badge와 Alert

### 3. 업무용 패턴

- [ ] Form validation
- [ ] Dialog와 confirmation
- [ ] Toast 또는 message
- [ ] 필터와 검색 영역
- [ ] 로딩, 오류, 빈 상태

### 4. 기준 화면

- [ ] 검색과 필터가 있는 목록
- [ ] 정렬과 페이지 이동이 있는 Table
- [ ] 생성 및 수정 Form
- [ ] 삭제 confirmation
- [ ] 키보드만 사용한 주요 흐름 확인

로드맵은 필요한 기능을 확인하기 위한 순서일 뿐입니다. 각 단계에서 필요가 확인된 컴포넌트만 추가합니다.

## AntD 대체 가능성 판단 기준

디자인이 비슷해 보이는지만으로 성공 여부를 판단하지 않습니다. 동일한 기준 화면을 구현하고 아래 항목을 함께 비교합니다.

| 기준 | 확인할 내용 |
| --- | --- |
| 개발 속도 | 처음 구현할 때와 두 번째 화면에서 걸리는 시간 |
| 일관성 | 개발자마다 다른 임의 스타일이 늘어나지 않는지 |
| 수정 용이성 | 제품 디자인 변경을 토큰 또는 한 컴포넌트에서 처리할 수 있는지 |
| 접근성 | 키보드 탐색, focus, label, dialog 동작이 유지되는지 |
| 복잡한 UI | Form과 Table 요구사항을 과도한 자체 구현 없이 처리할 수 있는지 |
| 유지보수 | shadcn 업데이트와 로컬 수정사항을 안전하게 비교할 수 있는지 |
| 번들 크기 | 실제 기준 화면에서 AntD 방식보다 의미 있는 차이가 있는지 |

다음 조건을 만족하면 AntD 대신 shadcn 기반 디자인 시스템을 계속 검토할 가치가 있습니다.

- 자주 사용하는 업무 화면을 비슷한 개발 속도로 만들 수 있다.
- 제품 디자인 변경이 전역 덮어쓰기보다 명확한 소스 수정으로 끝난다.
- 접근성과 상태 처리를 팀이 반복해서 구현하지 않아도 된다.
- Table, Form 같은 복잡한 영역의 추가 비용을 팀이 감당할 수 있다.

반대로 복잡한 컴포넌트마다 많은 기능을 직접 구현해야 하거나, 팀별 수정으로 UI 일관성이 빠르게 깨진다면 AntD 유지 또는 두 방식을 함께 사용하는 편이 더 현실적일 수 있습니다.

## 작업 규칙

- 새 dependency를 추가하기 전에 브라우저 기본 기능, Radix, 현재 설치된 도구로 해결할 수 있는지 확인합니다.
- 공통화는 두 곳 이상에서 실제로 같은 요구가 생긴 뒤 진행합니다.
- `src/components/ui`의 수정은 제품 전체에 영향을 줄 수 있으므로 변경 이유를 명확히 남깁니다.
- shadcn 컴포넌트를 갱신할 때는 먼저 `--diff`로 로컬 변경과 비교합니다.
- UI 동작이 추가되면 최소한 typecheck, lint, build를 실행합니다.
- Form, Table처럼 분기와 상태가 많은 기능에는 동작을 보호하는 테스트를 추가합니다.

## 현재 검증 명령

```bash
pnpm --filter shadcn-antd typecheck
pnpm --filter shadcn-antd lint
pnpm --filter shadcn-antd test
pnpm --filter shadcn-antd build
```

Button 테스트는 loading 중 중복 실행 방지, `aria-busy`, 네이티브 form type, 아이콘 전용 버튼의 접근 가능한 이름을 검증합니다. hover, focus, 색 대비, 레이아웃은 light/dark와 작은 화면에서 시각적으로 확인합니다.

## 참고 자료

- [shadcn/ui 문서](https://ui.shadcn.com/docs)
- [shadcn CLI 문서](https://ui.shadcn.com/docs/cli)
- [React 19 문서](https://react.dev/blog/2024/12/05/react-19)
- [Radix UI 문서](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vite 문서](https://vite.dev/guide/)
