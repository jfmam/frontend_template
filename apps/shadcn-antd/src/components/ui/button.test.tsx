import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

afterEach(cleanup)

describe("Button", () => {
  it("prevents repeated actions while preserving its accessible name when loading", () => {
    const onClick = vi.fn()

    render(
      <Button loading onClick={onClick}>
        저장
      </Button>
    )

    const button = screen.getByRole("button", { name: "저장" })

    expect(button.getAttribute("aria-busy")).toBe("true")
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(
      button
        .querySelector('[data-slot="button-spinner"]')
        ?.getAttribute("aria-hidden")
    ).toBe("true")

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("does not submit a form unless submit is explicitly requested", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())

    render(
      <form onSubmit={onSubmit}>
        <Button>취소</Button>
        <Button type="submit">저장</Button>
      </form>
    )

    fireEvent.click(screen.getByRole("button", { name: "취소" }))
    expect(onSubmit).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: "저장" }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("requires an accessible name for an icon-only button", () => {
    expect(() =>
      render(
        <Button size="icon">
          <svg aria-hidden="true" />
        </Button>
      )
    ).toThrow("Icon-only buttons require an accessible name")

    render(
      <Button size="icon" aria-label="검색">
        <svg aria-hidden="true" />
      </Button>
    )

    expect(screen.getByRole("button", { name: "검색" })).toBeTruthy()
  })

  it("prevents interaction when a composed link is disabled", () => {
    const onClick = vi.fn()

    render(
      <Button asChild disabled onClick={onClick} variant="link">
        <a href="/next">다음</a>
      </Button>
    )

    const link = screen.getByRole("link", { name: "다음" })

    expect(link.getAttribute("aria-disabled")).toBe("true")
    expect(link.getAttribute("tabindex")).toBe("-1")

    fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("exposes loading state when composed as a link", () => {
    render(
      <Button asChild loading variant="link">
        <a href="/next">다음</a>
      </Button>
    )

    const link = screen.getByRole("link", { name: "다음" })

    expect(link.getAttribute("aria-busy")).toBe("true")
    expect(link.getAttribute("aria-disabled")).toBe("true")
    expect(link.querySelector('[data-slot="button-spinner"]')).toBeTruthy()
  })
})
