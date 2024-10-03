import { execSync } from 'child_process';

// Get the filename from the command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error("Please provide a destination filename as an argument.");
  process.exit(1);
}

const command = `cp dist/stack.wasm /workspaces/cd40-showroom/data/stack-library/${filename}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error("Error executing command:", error);
  process.exit(1);
}
