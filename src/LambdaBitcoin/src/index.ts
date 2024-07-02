import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import middy from "@middy/core";
import * as axios from "./services/axios";

const logger = new Logger({ serviceName: "lambda-bitcoin" });

const lambdaHandler = async (): Promise<void> => {
  try {
    const response = await axios.default.get('bitcoin');
    logger.info(`Current bitcoin price ${response.data.data.priceUsd.split(".")[0]}`);
  } catch (err: any) {
    logger.error(err);
  }
}

const handler = middy().handler(lambdaHandler).use(injectLambdaContext(logger));

export { handler };