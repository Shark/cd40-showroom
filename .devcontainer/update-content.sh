#!/usr/bin/env bash
set -euo pipefail

# Authenticate with GitHub Packages NPM
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" > ~/.npmrc

cd stack
pushd .
npm ci
npm run build
cd40_manager_pod=$(kubectl get pod -n cd-40-system -l control-plane=controller-manager -o jsonpath="{.items[0].metadata.name}")
if [ -n "$cd40_manager_pod" ]; then
  kubectl -n cd-40-system cp dist/stack.wasm "$cd40_manager_pod":/workspace/stack-library/stack.wasm
else
  echo "cd-40 manager pod not found"
fi
popd

kubectl apply -f sample-app.yaml
