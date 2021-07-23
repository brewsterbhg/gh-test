import axios from 'axios'

import { mapLabelsToUsers, formatSlackBlocks } from './helpers'
import { RequestArgs, SlackNotification } from './types'

/**
 * Create the formatted notification for posting to Slack webhook
 *
 * @param {RequestArgs} body the request body
 * @returns {string|undefined} the formatted notification
 */
export const buildNotification = (
  body: RequestArgs
): SlackNotification | undefined => {
  const users = mapLabelsToUsers(body)

  if (!users || users.length === 0) {
    return
  }

  return formatSlackBlocks(body, users)
}

/**
 * Fire the notification to the Slack webhook (provide in .env)
 *
 * @param {string} notification the notification to post to Slack
 * @returns {Promise<void>}
 */
export const sendNotification = async (
  notification: SlackNotification,
  webhookUrl: string
): Promise<void> => {
  await axios.post(webhookUrl, {
    notification,
  })
}
