import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-sesv2"
import middy from "@middy/core";
import * as axios from "./services/axios";
import { getSecret, cleanSecret } from "./services/secret-manager";
import template from "./email/template";

const logger = new Logger({ serviceName: "lambda-bitcoin" });
let client: SESv2Client;

const lambdaHandler = async (event: any): Promise<void> => {
  try {
    if (!client) client = new SESv2Client({});
    let secretValueEmail: string = await getSecret(process.env.emailArn as string);
    let secretValueSender: string = await getSecret(process.env.senderArn as string);
    let email = cleanSecret(secretValueEmail);
    let sender = cleanSecret(secretValueSender);
    const response = await axios.default.get('bitcoin');
    const input: SendEmailCommandInput = {
      FromEmailAddress: `${sender} <${email}>`,
      Destination: { ToAddresses: [ email ] },
      EmailTags: [{ Name: 'type', Value: 'bitcoin' }],
      Content: {
        Simple: {
          Subject: { Data: "Today's Bitcoin Price!" },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: template(response.data.data.priceUsd.split(".")[0])
            },
            Text: { Data: 'TEST EMAIL' }
          }
        }
      }
    }
    const command = new SendEmailCommand(input);
    await client.send(command);
  } catch (err: any) {
    logger.error(err);
  }
}

const handler = middy().handler(lambdaHandler).use(injectLambdaContext(logger));

export { handler };