import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'

import { buildNotification, sendNotification } from './slack'

const postToSlack = async () => {
  try {
    const slackWebhookUrl = getInput('webhook-url')
    console.log(`Event payload: ${JSON.stringify(context.payload)}`)
    // const data = core.getInput('data') || '{}'
    // const notification = buildNotification(data)

    // if (notification) {
    //   await sendNotification(notification)
    // }
  } catch (error) {
    setFailed(error.message)
  }
}

postToSlack()
