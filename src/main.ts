import * as core from '@actions/core'
import {context} from '@actions/github'
import {PullRequestEvent} from '@octokit/webhooks-definitions/schema'

async function run(): Promise<void> {
  try {
    core.debug(JSON.stringify(process.env, null, 2)) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(JSON.stringify(context, null, 2))

    const isPullRequest = !!process.env.GITHUB_HEAD_REF //GITHUB_HEAD_REF is only set for pull request events https://docs.github.com/en/actions/reference/environment-variables

    let fullSha
    let shortSha
    let branchName

    if (isPullRequest) {
      // pull request
      const payload = context.payload as PullRequestEvent
      payload.pull_request.head.sha

      fullSha = payload.pull_request.head.sha || ''
      shortSha = fullSha.substring(0, 7)
      branchName = process.env.GITHUB_HEAD_REF
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
