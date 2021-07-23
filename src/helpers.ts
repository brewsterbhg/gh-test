import { WebhookPayload } from '@actions/github/lib/interfaces'

import { RequestArgs, Label, SlackNotification } from './types'

const USER_GROUPS: Record<string, string> = {
  bug: 'U02830X8J2V',
}

/**
 * Reads the context coming from GitHub and pulls required data
 *
 * @param {any} payload the payload from the current GitHub context
 * @returns {RequestArgs} the data needed for creating the Slack notification
 */
export const getArgsFromGitHubPayload = (
  payload: WebhookPayload
): RequestArgs | null => {
  const labels = payload?.pull_request?.labels.map((label: Label) => label.name)
  const requestUrl = payload?.pull_request?.html_url
  const title = payload?.pull_request?.title
  const user = payload?.pull_request?.user.login

  if (!requestUrl || !title || !user || labels.length === 0) {
    return null
  }

  return {
    requestUrl,
    title,
    user,
    labels,
  }
}

/**
 * Build labels array and map labels to users
 *
 * @param {RequestArgs} req the request body
 * @returns {string[]} the array of users to notify
 */
export const mapLabelsToUsers = (req: RequestArgs): string[] => {
  return req.labels.reduce<string[]>(reduceUsers, [])
}

/**
 * Maps labels from GitHub to users to notify
 *
 * @param {string[]} acc the array of users
 * @param {string} cur the current label being mapped over
 * @returns {string[]} an array of users to notify
 */
export const reduceUsers = (acc: string[], cur: string): string[] => {
  // To notify user in Slack, format must be <@SLACK_USER_ID>
  return USER_GROUPS[cur] ? acc.concat(`<@${USER_GROUPS[cur]}>`) : acc
}

/**
 * Builds a formatted message using Slack blocks https://api.slack.com/block-kit
 *
 * @param {RequestArgs} req the request body
 * @param {string[]} users the users to be notified
 * @returns {string} stringify the response because we're too lazy to create proper typing
 */
export const formatSlackBlocks = (
  req: RequestArgs,
  users: string[]
): SlackNotification => {
  const markup = {
    text: 'A review has been requested',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Pull Request [${req.title}] opened by ${req.user}:`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Reviewers requested:*\n ${users.join(' ')}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${req.requestUrl}|View Pull Request>`,
        },
      },
    ],
  }

  return markup
}
