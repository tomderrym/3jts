#!/usr/bin/env bash
set -euo pipefail
# Pull Ollama model (does not bundle the blob in the zip)
ollama pull qwen2.5:7b
