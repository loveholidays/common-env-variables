import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    core.debug(JSON.stringify(process.env, null, 2)) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const isPullRequest = !!process.env.GITHUB_HEAD_REF //GITHUB_HEAD_REF is only set for pull request events https://docs.github.com/en/actions/reference/environment-variables

    let fullSha
    let shortSha
    let branchName

    if (isPullRequest) {
      //
    } else {
      // push to master
      fullSha = process.env.GITHUB_SHA || ''
      shortSha = fullSha.substring(0, 7)
      branchName = process.env.GITHUB_REF?.split('/')
        .slice(2)
        .join('/')
        .replace(/\//g, '-')
    }

    core.exportVariable('FULL_SHA', fullSha)
    core.exportVariable('SHORT_SHA', shortSha)
    core.exportVariable('BRANCH_NAME', branchName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
