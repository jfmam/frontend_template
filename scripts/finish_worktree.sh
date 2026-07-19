#!/usr/bin/env bash
set -euo pipefail

TARGET_BRANCH="develop"
MODE="merge"
EXECUTE="false"
YES="false"
WORKTREE_PATH=""

usage() {
  cat <<'USAGE'
Usage:
  finish_worktree.sh [options]

Options:
  --target <branch>      Branch to merge into. Default: develop
  --mode <merge|squash>  Merge strategy. Default: merge
  --dry-run              Print the plan without changing anything. Default
  --execute              Perform merge and remove the current worktree
  --yes                  Skip confirmation prompt
  --worktree <path>      Worktree to finish. Default: current directory
  -h, --help             Show this help

Examples:
  scripts/finish_worktree.sh --target develop --dry-run
  scripts/finish_worktree.sh --target develop --execute
  scripts/finish_worktree.sh --target develop --mode squash --execute
USAGE
}

die() {
  echo "Error: $*" >&2
  exit 1
}

run_git() {
  git -C "$1" "${@:2}"
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --target)
        [[ $# -ge 2 ]] || die "--target requires a branch name"
        TARGET_BRANCH="$2"
        shift 2
        ;;
      --mode)
        [[ $# -ge 2 ]] || die "--mode requires merge or squash"
        MODE="$2"
        shift 2
        ;;
      --dry-run)
        EXECUTE="false"
        shift
        ;;
      --execute)
        EXECUTE="true"
        shift
        ;;
      --yes)
        YES="true"
        shift
        ;;
      --worktree)
        [[ $# -ge 2 ]] || die "--worktree requires a path"
        WORKTREE_PATH="$2"
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "unknown option: $1"
        ;;
    esac
  done

  case "$MODE" in
    merge|squash) ;;
    *) die "--mode must be merge or squash" ;;
  esac
}

canonical_path() {
  local path="$1"
  cd "$path" >/dev/null 2>&1 && pwd -P
}

ensure_clean_worktree() {
  local path="$1"

  if [[ -n "$(run_git "$path" status --porcelain)" ]]; then
    die "working tree is not clean: $path"
  fi
}

current_branch() {
  local path="$1"
  run_git "$path" branch --show-current
}

find_target_worktree() {
  local repo_path="$1"
  local target_branch="$2"

  while IFS= read -r line; do
    case "$line" in
      worktree\ *)
        candidate="${line#worktree }"
        ;;
      branch\ refs/heads/"$target_branch")
        printf "%s\n" "$candidate"
        return 0
        ;;
    esac
  done < <(run_git "$repo_path" worktree list --porcelain)

  return 1
}

confirm_execute() {
  [[ "$EXECUTE" == "true" ]] || return 0
  [[ "$YES" == "true" ]] && return 0

  printf "Proceed with merge and worktree removal? [y/N] "
  read -r answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) die "aborted by user" ;;
  esac
}

print_plan() {
  local source_path="$1"
  local source_branch="$2"
  local target_path="$3"

  if [[ "$EXECUTE" == "true" ]]; then
    echo "EXECUTE"
  else
    echo "DRY RUN"
  fi

  echo "Source worktree: $source_path"
  echo "Source branch:   $source_branch"
  echo "Target worktree: $target_path"
  echo "Target branch:   $TARGET_BRANCH"
  echo "Mode:            $MODE"

  if [[ "$MODE" == "squash" ]]; then
    echo "Plan:            git merge --squash $source_branch && git commit"
  else
    echo "Plan:            git merge --no-ff $source_branch"
  fi
  echo "Cleanup:         git worktree remove $source_path"
}

perform_merge() {
  local source_path="$1"
  local source_branch="$2"
  local target_path="$3"

  if [[ "$MODE" == "squash" ]]; then
    run_git "$target_path" merge --squash "$source_branch"
    run_git "$target_path" commit -m "merge: $source_branch into $TARGET_BRANCH"
  else
    run_git "$target_path" merge --no-ff "$source_branch"
  fi

  echo "Merge completed"
  run_git "$target_path" worktree remove "$source_path"
  echo "Worktree removed"
}

main() {
  parse_args "$@"

  local source_path
  if [[ -n "$WORKTREE_PATH" ]]; then
    source_path="$(canonical_path "$WORKTREE_PATH")"
  else
    source_path="$(pwd -P)"
  fi

  run_git "$source_path" rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "not a git worktree: $source_path"

  local source_branch
  source_branch="$(current_branch "$source_path")"
  [[ -n "$source_branch" ]] || die "detached HEAD is not supported"
  [[ "$source_branch" != "$TARGET_BRANCH" ]] || die "source branch is already target branch: $TARGET_BRANCH"

  ensure_clean_worktree "$source_path"

  local target_path
  target_path="$(find_target_worktree "$source_path" "$TARGET_BRANCH")" || die "target branch '$TARGET_BRANCH' is not checked out in any worktree"
  target_path="$(canonical_path "$target_path")"
  [[ "$target_path" != "$source_path" ]] || die "target worktree matches source worktree"

  ensure_clean_worktree "$target_path"

  print_plan "$source_path" "$source_branch" "$target_path"
  confirm_execute

  if [[ "$EXECUTE" == "true" ]]; then
    perform_merge "$source_path" "$source_branch" "$target_path"
  fi
}

main "$@"
