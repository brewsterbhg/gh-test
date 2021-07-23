import { getInput, setFailed } from '@actions/core'
import github from '@actions/github'

import { buildNotification, sendNotification } from './slack'

const postToSlack = async () => {
  try {
    const slackWebhookUrl = getInput('webhook-url')
    console.log(`Event payload: ${JSON.stringify(github.context.payload)}`)
    // const data = core.getInput('data') || '{}'
    // const notification = buildNotification(data)

    // if (notification) {
    //   await sendNotification(notification)
    // }
  } catch (error) {
    console.error(error)
    // core.setFailed(error.message)
  }
}

postToSlack()
