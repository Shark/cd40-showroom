#!/usr/bin/env bash
set -euo pipefail

# Authenticate with GitHub Packages NPM
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > ~/.npmrc

pushd .
cd stack
npm ci
npm run build
npm run deploy -- stack.wasm
popd

kubectl apply -f sample-app.yaml
