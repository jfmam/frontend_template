#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/finish_worktree.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_contains() {
  local haystack="$1"
  local needle="$2"

  if [[ "$haystack" != *"$needle"* ]]; then
    fail "expected output to contain '$needle', got: $haystack"
  fi
}

setup_repo() {
  local base_dir="$1"
  local repo="$base_dir/repo"
  local feature="$base_dir/feature"

  mkdir -p "$base_dir"
  git init -b develop "$repo" >/dev/null
  git -C "$repo" config user.email "test@example.com"
  git -C "$repo" config user.name "Test User"

  printf "base\n" >"$repo/file.txt"
  git -C "$repo" add file.txt
  git -C "$repo" commit -m "initial" >/dev/null

  git -C "$repo" worktree add -b feature "$feature" develop >/dev/null
  printf "feature\n" >"$feature/feature.txt"
  git -C "$feature" add feature.txt
  git -C "$feature" commit -m "feature change" >/dev/null

  printf "%s\n" "$repo" "$feature"
}

test_dry_run_does_not_merge_or_remove_worktree() {
  local tmp_dir
  tmp_dir="$(mktemp -d)"

  local repo feature output
  mapfile -t paths < <(setup_repo "$tmp_dir")
  repo="${paths[0]}"
  feature="${paths[1]}"

  output="$("$SCRIPT" --target develop --dry-run --yes --worktree "$feature")"

  [[ -d "$feature" ]] || fail "feature worktree should still exist after dry-run"
  git -C "$repo" merge-base --is-ancestor feature develop && fail "feature should not be merged during dry-run"
  assert_contains "$output" "DRY RUN"
  assert_contains "$output" "git merge --no-ff feature"
}

test_execute_merges_and_removes_worktree() {
  local tmp_dir
  tmp_dir="$(mktemp -d)"

  local repo feature output
  mapfile -t paths < <(setup_repo "$tmp_dir")
  repo="${paths[0]}"
  feature="${paths[1]}"

  output="$("$SCRIPT" --target develop --execute --yes --worktree "$feature")"

  [[ ! -d "$feature" ]] || fail "feature worktree should be removed after successful execute"
  git -C "$repo" merge-base --is-ancestor feature develop || fail "feature should be merged into develop"
  assert_contains "$output" "Merge completed"
  assert_contains "$output" "Worktree removed"
}

test_dirty_worktree_is_rejected() {
  local tmp_dir
  tmp_dir="$(mktemp -d)"

  local feature output status
  mapfile -t paths < <(setup_repo "$tmp_dir")
  feature="${paths[1]}"
  printf "dirty\n" >>"$feature/feature.txt"

  set +e
  output="$("$SCRIPT" --target develop --dry-run --yes --worktree "$feature" 2>&1)"
  status=$?
  set -e

  [[ "$status" -ne 0 ]] || fail "dirty worktree should be rejected"
  [[ -d "$feature" ]] || fail "dirty worktree should not be removed"
  assert_contains "$output" "working tree is not clean"
}

main() {
  test_dry_run_does_not_merge_or_remove_worktree
  test_execute_merges_and_removes_worktree
  test_dirty_worktree_is_rejected
  echo "finish_worktree_test.sh: all tests passed"
}

main "$@"
