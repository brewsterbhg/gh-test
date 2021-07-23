import { RequestContext } from './types';

const USER_GROUPS: Record<string, string> = {
  bug: 'U02830X8J2V',
};

/**
 * Build labels array and map labels to users
 *
 * @param {RequestContext} req the request body
 * @returns {string[]} the array of users to notify
 */
export const mapLabelsToUsers = (req: RequestContext): string[] => {
  return normalizeLabels(req.labels).reduce<string[]>(reduceUsers, []);
};

/**
 * Split comma-delimited string of labels and return array
 *
 * @param {string} labels the labels attached to the PR
 * @returns {string[]} an array of labels
 */
export const normalizeLabels = (labels: string): string[] => {
  return labels ? labels.split(',') : [];
};

/**
 * Maps labels from GitHub to users to notify
 *
 * @param {string[]} acc the array of users
 * @param {string} cur the current label being mapped over
 * @returns {string[]} an array of users to notify
 */
export const reduceUsers = (acc: string[], cur: string): string[] => {
  // To notify user in Slack, format must be <@SLACK_USER_ID>
  return USER_GROUPS[cur] ? acc.concat(`<@${USER_GROUPS[cur]}>`) : acc;
};

/**
 * Builds a formatted message using Slack blocks https://api.slack.com/block-kit
 *
 * @param {RequestContext} req the request body
 * @param {string[]} users the users to be notified
 * @returns {string} stringify the response because we're too lazy to create proper typing
 */
export const formatSlackBlocks = (
  req: RequestContext,
  users: string[]
): string => {
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
  };
  return JSON.stringify(markup);
};
