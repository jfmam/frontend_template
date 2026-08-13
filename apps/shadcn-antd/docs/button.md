# Button

Button은 사용자가 실행할 액션의 중요도와 위험도를 전달합니다. Ant Design의 업무용 시각 밀도를 참고했지만 AntD props를 복제하지는 않습니다. 네이티브 HTML props와 shadcn의 `variant`, `size`, `asChild` 구조를 유지합니다.

## API

Button은 네이티브 `<button>` props와 다음 props를 받습니다.

| prop | 값 | 기본값 | 의미 |
| --- | --- | --- | --- |
| `variant` | `primary`, `default`, `dashed`, `text`, `link`, `danger`, `danger-outline`, `ghost` | `default` | 액션의 계층과 의도 |
| `size` | `small`, `medium`, `large`, `icon`, `icon-small`, `icon-large` | `medium` | 24·32·40px control 높이 |
| `loading` | `boolean` | `false` | 진행 중 표시와 중복 실행 방지 |
| `asChild` | `boolean` | `false` | 스타일을 자식 요소에 전달 |

`type` 기본값은 `button`입니다. Form을 제출하는 버튼만 `type="submit"`을 명시합니다.

## Variant 선택

- `primary`: 현재 영역의 가장 중요한 액션. 한 영역에 하나만 둡니다.
- `default`: 취소, 닫기처럼 일반적인 보조 액션입니다.
- `dashed`: 항목이나 콘텐츠를 추가할 때만 사용합니다.
- `text`: Table row action처럼 낮은 강조가 필요한 액션입니다.
- `link`: 이동을 의미합니다. `asChild`와 실제 `<a>`를 사용해 link semantics를 유지합니다.
- `danger`: 영구 삭제처럼 큰 위험이 있는 주요 액션입니다.
- `danger-outline`: 위험하지만 주요 액션은 아닐 때 사용합니다.
- `ghost`: 색이나 이미지가 있는 어두운 배경에서만 사용합니다.

## Loading과 비동기 작업

비동기 로직과 오류 처리는 Button이 아니라 호출하는 화면이 소유합니다. Button은 `loading`을 표현하는 일만 합니다.

```tsx
<Button variant="primary" type="submit" loading={isSaving}>
  저장
</Button>
```

Loading 중에는 네이티브 `disabled`로 중복 실행을 막고, `aria-busy="true"`를 자동으로 적용하며, spinner는 `aria-hidden="true"`로 숨깁니다. 라벨을 유지하므로 Button의 접근 가능한 이름도 유지됩니다.

## 접근성

- 컴포넌트가 확실히 알 수 있는 `loading`, `disabled`만 ARIA와 연결합니다.
- 아이콘만 있는 Button은 의미를 자동 추론하지 않습니다. 호출부가 `aria-label`이나 `aria-labelledby`를 제공합니다.
- 실제 `<button>`에 `role="button"`을 중복해 추가하지 않습니다.
- 포커스는 `:focus-visible`에서만 표시하고, spinner는 `prefers-reduced-motion`을 존중합니다.

## 복제하지 않은 AntD API

`htmlType`, `color`, `shape`, `loading.delay`, wave effect, 중국어 두 글자 자동 간격, preset color는 현재 사용 사례에 필요하지 않아 추가하지 않았습니다. 네이티브 `type`, semantic token, 작은 variant 집합으로 대체합니다.

## 검증

```bash
pnpm --filter shadcn-antd test
pnpm --filter shadcn-antd typecheck
pnpm --filter shadcn-antd lint
pnpm --filter shadcn-antd build
```

자동 테스트는 loading·form·icon-only 접근성 계약을 검증합니다. CSS 색 대비, hover/focus, 24·32·40px 높이, light/dark, 반응형 레이아웃은 Button 쇼케이스에서 시각적으로 확인합니다.
