# Finish Worktree

`scripts/finish-worktree` safely merges a feature worktree into a target branch worktree, then removes the feature worktree only after a successful merge.

The default mode is dry-run. Nothing is merged or removed unless `--execute` is passed.

## Assumptions

- The target branch, usually `develop`, is already checked out in another worktree.
- Run the command from the feature worktree, or pass `--worktree <path>`.
- Both source and target worktrees must be clean.
- The source branch must not be the target branch.
- Conflicts stop the script before worktree removal.

## Usage

Preview the plan:

```bash
scripts/finish-worktree --target develop --dry-run
```

Merge with a `--no-ff` merge commit and remove the feature worktree:

```bash
scripts/finish-worktree --target develop --execute
```

Squash merge and remove the feature worktree:

```bash
scripts/finish-worktree --target develop --mode squash --execute
```

Skip the confirmation prompt for automation:

```bash
scripts/finish-worktree --target develop --execute --yes
```

Run against a specific worktree path:

```bash
scripts/finish-worktree --target develop --dry-run --worktree ../my-feature-worktree
```

## What It Does

1. Finds the source branch from the feature worktree.
2. Verifies the source worktree is clean.
3. Finds the worktree where the target branch is checked out.
4. Verifies the target worktree is clean.
5. Prints the merge and cleanup plan.
6. If `--execute` is passed, merges from the target worktree.
7. Removes the source worktree only after the merge succeeds.

## Test

```bash
bash tests/finish_worktree_test.sh
```
