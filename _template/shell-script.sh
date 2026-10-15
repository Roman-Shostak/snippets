#!/bin/bash
# script-name: one-line description of what it does
#
# Usage:    ./script-name.sh <input>
# Requires: tool-name (brew install tool-name)

set -euo pipefail   # stop on errors, unset variables and failed pipes

if [ $# -lt 1 ]; then
  echo "Usage: $(basename "$0") <input>"
  exit 1
fi

INPUT="$1"

echo "→ Working on: $INPUT"
# Main logic here

echo "✓ Done"
