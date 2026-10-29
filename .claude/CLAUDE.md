# Singularity

Full stack social media app (NestJS + PostgreSQL + Redis backend in `backend/`, Next.js frontend in `frontend/`), being revamped to also serve as Alan's personal website/portfolio. Work happens gradually, one step at a time.

## Guidelines

1. **Keep code simple.** No over-engineering. Write code that a human can read easily. Prefer the straightforward solution over the clever or abstract one.
2. **Comment sparingly.** Only add comments where the logic is genuinely hard to follow. Don't comment what the code already says.
3. **Don't run servers.** Never start the backend, frontend, Redis, or any other long-running process to test features. This prevents memory leaks/overflows in this WSL environment. Alan runs the servers. Builds and tests are memory-heavy here too, so run them narrowly (single spec files, `--runInBand`) and only when needed.
4. **No git operations.** Don't run `git add`, `git commit`, `git push`, or any other git command that changes state. Alan handles version control.
5. **Never commit or expose `.env` values.** Don't copy secrets from `.env` files into code, docs, or examples.
