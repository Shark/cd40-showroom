import { exec as lameExec } from "child_process"
import { promisify } from "util"
import task from "tasuku"

const exec = promisify(lameExec)

module.exports = async function() {
  await task.group(task => [
    task('build', async () => exec('npm run build')),
    task('transpile', async () => exec('npm run transpile'))
  ])
}
