# frontend-template

코드 연습용 pnpm + Turborepo 모노레포입니다.

## 시작하기

필요 환경은 Node.js 22와 pnpm 11.10입니다. nvm을 사용하면 저장소 루트에서 `nvm use`로 버전을 맞출 수 있습니다.

```bash
nvm use
corepack enable
pnpm install
pnpm build
pnpm test
```

앱 하나만 실행할 때는 루트 스크립트나 pnpm filter를 사용합니다.

```bash
pnpm image-editor:dev
pnpm wesave:dev
pnpm csr-wesave:dev
pnpm mfe:dev

pnpm --filter image-editor build
```

## Workspace

- `apps/practice-wesave`: Next.js WESAVE
- `apps/csr-wesave`: Create React App WESAVE
- `apps/image-editor`: Vite 이미지 편집기
- `apps/mfe-practice/*`: Webpack Module Federation 앱
- `apps/bundler`: 번들러 내부 구조 실습
