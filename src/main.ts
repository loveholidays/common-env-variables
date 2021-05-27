import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
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
      core.debug('is pull request')
      const payload = context.payload as PullRequestEvent
      payload.pull_request.head.sha

      fullSha = payload.pull_request.head.sha || ''
      shortSha = fullSha.substring(0, 7)
      branchName = process.env.GITHUB_HEAD_REF
    } else if (context.eventName === 'issue_comment') {
      const token = core.getInput('github-token', {required: true})
      const octokit = getOctokit(token)
      const pr = await octokit.rest.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number
      })
      core.debug('issue comment')
      core.debug(JSON.stringify(pr, null, 2))
      branchName = pr.data.head.ref
    } else {
      core.debug('catch all, most likely master')
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
