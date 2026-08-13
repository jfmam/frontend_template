import { Button, type ButtonVariant } from "@/components/ui/button"

const variants: { name: string; variant: ButtonVariant; purpose: string }[] = [
  { name: "Primary", variant: "primary", purpose: "영역의 가장 중요한 작업" },
  { name: "Default", variant: "default", purpose: "일반적인 보조 작업" },
  { name: "Dashed", variant: "dashed", purpose: "항목이나 콘텐츠 추가" },
  { name: "Text", variant: "text", purpose: "테이블 내 낮은 강조의 작업" },
  { name: "Link", variant: "link", purpose: "다른 페이지로 이동" },
]

function SpecRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-5 border-t border-border py-7 first:border-t-0 md:grid-cols-[180px_1fr]">
      <div>
        <h2 className="text-sm font-semibold">{label}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {children}
      </div>
    </section>
  )
}

export function App() {
  return (
    <main
      id="button-principles"
      className="min-h-svh bg-muted/35 px-5 py-10 md:px-8 md:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium text-primary">
            <span className="rounded-full bg-primary/10 px-2.5 py-1">
              Foundation 01
            </span>
            <span>Button</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            작업의 중요도와 상태를 일관되게 전달합니다.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ant Design의 촘촘한 업무용 밀도를 기준으로 하되, 네이티브 HTML API와
            접근성을 우선한 shadcn 기반 Button입니다.
          </p>
        </header>

        <div className="rounded-xl border border-border bg-background px-5 shadow-sm md:px-8">
          <SpecRow
            label="Hierarchy"
            description="한 영역에서 Primary는 하나만 사용합니다."
          >
            {variants.map(({ name, variant, purpose }) => (
              <div key={variant} className="flex flex-col items-start gap-1.5">
                {variant === "link" ? (
                  <Button asChild variant="link">
                    <a href="#button-principles">{name}</a>
                  </Button>
                ) : (
                  <Button variant={variant}>{name}</Button>
                )}
                <span className="max-w-32 text-[11px] text-muted-foreground">
                  {purpose}
                </span>
              </div>
            ))}
          </SpecRow>

          <SpecRow
            label="Intent"
            description="위험한 작업은 다른 액션과 즉시 구분되어야 합니다."
          >
            <Button variant="danger">영구 삭제</Button>
            <Button variant="danger-outline">삭제</Button>
          </SpecRow>

          <SpecRow
            label="Size"
            description="제품의 화면 밀도에 맞춰 24·32·40px을 사용합니다."
          >
            <Button variant="primary" size="small">
              Small
            </Button>
            <Button variant="primary">Medium</Button>
            <Button variant="primary" size="large">
              Large
            </Button>
          </SpecRow>

          <SpecRow
            label="Icon"
            description="아이콘은 의미를 보조하고, 단독 사용 시 이름을 제공합니다."
          >
            <Button variant="primary">
              <span aria-hidden="true">↓</span>
              다운로드
            </Button>
            <Button>
              다음
              <span aria-hidden="true">→</span>
            </Button>
            <Button size="icon" aria-label="검색">
              <span aria-hidden="true">⌕</span>
            </Button>
            <Button size="icon" variant="dashed" aria-label="항목 추가">
              <span aria-hidden="true">＋</span>
            </Button>
          </SpecRow>

          <SpecRow
            label="State"
            description="Loading은 중복 실행을 막고 접근 가능한 이름을 유지합니다."
          >
            <Button variant="primary" loading>
              저장 중
            </Button>
            <Button disabled>사용 불가</Button>
            <Button variant="danger" disabled>
              삭제 불가
            </Button>
          </SpecRow>

          <SpecRow
            label="Ghost"
            description="Ghost는 색이나 이미지가 있는 배경에서만 사용합니다."
          >
            <div className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-slate-800 to-blue-900 p-6">
              <Button variant="ghost">상세 보기</Button>
              <Button variant="ghost" disabled>
                사용 불가
              </Button>
            </div>
          </SpecRow>
        </div>

        <footer className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>React 19 · shadcn/ui · Radix UI · Tailwind CSS 4</span>
          <span>
            <kbd className="rounded border bg-background px-1.5 py-0.5">d</kbd>{" "}
            dark mode
          </span>
        </footer>
      </div>
    </main>
  )
}

export default App
