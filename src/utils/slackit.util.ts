/* eslint-disable @typescript-eslint/naming-convention */
import {IncomingWebhook, IncomingWebhookResult} from '@slack/webhook';

const url = process.env.SLACK_WEBHOOK_URL ?? '';

const webhook = new IncomingWebhook(url);

export function slackIt(
  text: string,
  iconEmoji?: string,
): Promise<IncomingWebhookResult | void> {
  if (process.env.NO_SLACK_REPORT) return Promise.resolve();

  return webhook.send({
    text,
    icon_emoji: iconEmoji ?? ':warning:',
    channel: process.env.SLACK_CHANNEL ?? '#test',
    username: `loopback - ${require('os').hostname()}`,
  });
}

export default slackIt;
