import axios from 'axios';

import { mapLabelsToUsers, formatSlackBlocks } from './helpers';
import { RequestContext } from './types';

/**
 * Create the formatted notification for posting to Slack webhook
 *
 * @param {RequestContext} body the request body
 * @returns {string|undefined} the formatted notification
 */
export const buildNotification = (body: RequestContext): string | undefined => {
  const users = mapLabelsToUsers(body);

  if (!users || users.length === 0) {
    return;
  }

  return formatSlackBlocks(body, users);
};

/**
 * Fire the notification to the Slack webhook (provide in .env)
 *
 * @param {string} notification the notification to post to Slack
 * @returns {Promise<void>}
 */
export const sendNotification = async (notification: string): Promise<void> => {
  await axios.post(process.env.SLACK_WEBHOOK as string, {
    ...JSON.parse(notification), // parse args as it's stringified
  });
};
