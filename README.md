# CD-40 Showroom

* `kubectl -n cd-40-system cp dist/stack.wasm $(kubectl get pod -n cd-40-system -l control-plane=controller-manager -o jsonpath="{.items[0].metadata.name}"):/workspace/stack-library/stack.wasm`
