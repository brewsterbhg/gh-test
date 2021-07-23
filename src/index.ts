import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'

import { buildNotification, sendNotification } from './slack'
import { getArgsFromGitHubPayload } from './helpers'

const run = async () => {
  try {
    const slackWebhookUrl = getInput('webhook-url')
    console.log(btoa(slackWebhookUrl))
    const pullRequestArgs = getArgsFromGitHubPayload(context.payload)
    console.log(pullRequestArgs);

    if (!pullRequestArgs) {
      setFailed('Not all required data was provided')
      return
    }

    const notification = buildNotification(pullRequestArgs)

    if (!notification) {
      setFailed('Notification could not be built')
      return
    }

    await sendNotification(notification, slackWebhookUrl)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
