# AppMonster AI export bundle

- `originals/` — copies of discovered files (**.env* redacted**).
- `normalized/ai/` — starter **models.json** stub; edit to match your app.
- `metadata/duplicates.json` — same basename, different paths.
- `manifest.json` / `manifest.md` — full file list.
- `scripts/pull-model.sh` — `ollama pull qwen2.5:7b` (no model in zip).

## Restore (outline)

1. Copy needed files from `originals/<category>/` into your project.
2. Run `pull-model.sh` if using Ollama.
3. Do **not** commit real `.env`; use `.env.example` patterns only.

Files captured: **29**
