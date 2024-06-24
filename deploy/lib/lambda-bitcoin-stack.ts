import {
  Duration,
  Stack,
  StackProps
} from "aws-cdk-lib";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { join } from "path";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class LambdaBitcoinStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const lambdaBitcoin = new NodejsFunction(this, "LambdaBitcoinFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "src", "LambdaBitcoin", "index.ts"),
      tracing: Tracing.ACTIVE,
      logRetention: RetentionDays.SIX_MONTHS,
      timeout: Duration.seconds(60),
      environment: {},
    });

    const ruleBitcoin = new Rule(this, 'rule', {
      schedule: Schedule.expression('cron(05 23 ? * SUN-SAT *)'),
      targets: [new LambdaFunction(lambdaBitcoin)]
    });
  }
}
