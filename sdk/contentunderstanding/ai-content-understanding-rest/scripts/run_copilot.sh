#!/bin/bash
# Usage: ./run_copilot.sh

set -uo pipefail

PROJECT_DIR="/home/chienyuanww/repos/azure-sdk-for-js/sdk/contentunderstanding/ai-content-understanding-rest"

# Move to the parent directory of the script to ensure relative paths work
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."
cd "$REPO_ROOT"

# Directory containing Python samples to convert
PY_SAMPLES_DIR="python_samples_for_convert"

# Directory for JS/TS samples (for Copilot prompt context)
JS_TS_SAMPLES_DIR="sdk/contentunderstanding/ai-content-understanding-rest/samples/v1"
PY_SAMPLES_PATH="sdk/contentunderstanding/ai-content-understanding-rest/$PY_SAMPLES_DIR"
SRC_DIR="sdk/contentunderstanding/ai-content-understanding-rest/src"



# Check if Copilot CLI is available
if ! command -v copilot &> /dev/null; then
    echo "Error: 'copilot' command not found. Please install the Copilot CLI and ensure it is in your PATH." >&2
    exit 1
fi

# Minimal Copilot CLI test to verify it works in this script context
echo "[DEBUG] Testing Copilot CLI with: copilot --version"
if ! copilot --version; then
    echo "[ERROR] Copilot CLI is not working as expected. Please check your installation and environment." >&2
    exit 2
fi

# Iterate over all Python files in the samples directory
for py_file in "$PY_SAMPLES_DIR"/*.py; do
    filename=$(basename "$py_file")
    echo "=============================="
    echo "Processing $filename ..."
    echo "=============================="

    PROMPT="You are a javascript sdk expert. Please help write js and ts samples following the structure in $JS_TS_SAMPLES_DIR for a python sample $PY_SAMPLES_PATH/$filename

- remember to update related files like README
- please skip if the sample already exists in js/ts sdk samples

The javascript sdk codes are in $SRC_DIR"
    yes | copilot -p "$PROMPT" \
        --add-dir "$PROJECT_DIR" \
        --model "claude-haiku-4.5" \
        --allow-all-tools 2>&1
    echo "Exit code: $?"
    latest_session_id=$(ls -t ~/.copilot/logs/ | head -n 1 | sed 's/session-//;s/\.log//')
    echo "Latest Copilot session ID: $latest_session_id"

done
