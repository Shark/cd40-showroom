import { execSync } from 'child_process';

// Get the filename from the command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error("Please provide a destination filename as an argument.");
  process.exit(1);
}

const command = `kubectl -n cd-40-system cp dist/stack.wasm $(kubectl get pod -n cd-40-system -l control-plane=controller-manager -o jsonpath="{.items[0].metadata.name}"):/workspace/stack-library/${filename}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error("Error executing command:", error);
  process.exit(1);
}
