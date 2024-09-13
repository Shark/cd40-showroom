import { exec as lameExec } from "child_process";
import task from "tasuku";
import { promisify } from "util";

const exec = promisify(lameExec)

await task.group(task => [
  task('Compiling TypeScript', async ({ setTitle }) => {
    await exec('npm run compile')
    setTitle('Compilation succeeded: dist/stack.js')
  }),
  task('Bundling with esbuild', async ({ setTitle }) => {
    await exec('npm run bundle')
    setTitle('Bundle created: dist/bundle.js')
  }),
  task('Building Wasm component', async ({ setTitle }) => {
    await exec('npm run componentize')
    setTitle('WASM component built: dist/stack.wasm')
  }),
])
