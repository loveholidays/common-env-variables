import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    core.debug(JSON.stringify(process.env, null, 2)) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
