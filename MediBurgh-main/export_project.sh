#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: export_project.sh [options]

Create a compressed archive of the MediBurgh project.

Options:
  -o, --output <file>           Output archive name (default: mediburgh-project.tar.gz)
  -n, --include-node-modules    Include the node_modules directory in the archive
  -h, --help                    Show this help message
USAGE
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHIVE_NAME="mediburgh-project.tar.gz"
INCLUDE_NODE_MODULES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--output)
      if [[ $# -lt 2 ]]; then
        echo "Error: --output requires a value." >&2
        usage
        exit 1
      fi
      ARCHIVE_NAME="$2"
      shift 2
      ;;
    -n|--include-node-modules)
      INCLUDE_NODE_MODULES=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option '$1'." >&2
      usage
      exit 1
      ;;
  esac
done

TAR_ARGS=("--exclude-vcs" "-czf" "$ARCHIVE_NAME")
if [[ "$INCLUDE_NODE_MODULES" == false ]]; then
  TAR_ARGS+=("--exclude=node_modules")
fi

# Create archive from repository root.
tar "${TAR_ARGS[@]}" -C "$SCRIPT_DIR" .

echo "Created archive: $ARCHIVE_NAME"
