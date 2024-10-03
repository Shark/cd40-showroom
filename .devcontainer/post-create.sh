#!/usr/bin/env bash
set -euo pipefail

ELAPSED_TIME=0
until docker info &> /dev/null || [ $ELAPSED_TIME -ge 90 ]; do
  echo "Waiting for Docker to be available..."
  sleep 5
  ELAPSED_TIME="$((ELAPSED_TIME+5))"
done

cd40_engine_version=v0.0.1-develop.2

# Credentials not available in on-create.sh for Codespace prebuild, so we need to pull the image here
# https://docs.github.com/en/codespaces/reference/allowing-your-codespace-to-access-a-private-registry#pulling-a-docker-image-into-your-codespace
docker pull "ghcr.io/shark/cd40-engine:$cd40_engine_version"
k3d image import "ghcr.io/shark/cd40-engine:$cd40_engine_version"
