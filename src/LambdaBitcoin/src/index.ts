import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-sesv2"
import middy from "@middy/core";
import * as axios from "./services/axios";
import { getSecret } from "./services/secret-manager";

const logger = new Logger({ serviceName: "lambda-bitcoin" });
let client: SESv2Client;

const lambdaHandler = async (event: any): Promise<void> => {
  try {
    if (!client) client = new SESv2Client({});
    let secretValueEmail: any = await getSecret(process.env.emailArn as string);
    let email: any = Object.values(secretValueEmail)[0];
    console.log("a:", Object.values(secretValueEmail));
    console.log("b:", email);
    const response = await axios.default.get('bitcoin');
    const input: SendEmailCommandInput = {
      FromEmailAddress: `Rudy Alvarado <${email}>`,
      Destination: { ToAddresses: [ email ] },
      EmailTags: [{ Name: 'type', Value: 'bitcoin' }],
      Content: {
        Simple: {
          Subject: { Data: "Today's Bitcoin Price!" },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `Current bitcoin price at ${new Date().toLocaleString()}: $${response.data.data.priceUsd.split(".")[0]}`
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