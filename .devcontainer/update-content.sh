#!/usr/bin/env bash
set -euo pipefail

# Authenticate with GitHub Packages NPM
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > ~/.npmrc

cd stack
pushd .
npm ci
npm run build
kubectl -n cd-40-system cp dist/stack.wasm $(kubectl get pod -n cd-40-system -l control-plane=controller-manager -o jsonpath="{.items[0].metadata.name}"):/workspace/stack-library/stack.wasm
popd

kubectl apply -f sample-app.yaml
