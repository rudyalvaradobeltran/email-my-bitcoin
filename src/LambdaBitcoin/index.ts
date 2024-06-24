import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import middy from "@middy/core";

const logger = new Logger({ serviceName: "lambda-bitcoin" });

const lambdaHandler = (): void => {
  logger.info("Current bitcoin");
}

const handler = middy().handler(lambdaHandler).use(injectLambdaContext(logger));

export { handler };