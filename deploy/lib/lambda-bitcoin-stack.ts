import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { join } from "path";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

export class LambdaBitcoinStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const role = new Role(this, "SesSenderRole", {
      roleName: "SesSenderRole",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonSESFullAccess")
    );

    role.addToPrincipalPolicy(
      new PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"]
      })
    );
    
    const lambdaBitcoin = new NodejsFunction(this, "LambdaBitcoinFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "src",
        "LambdaBitcoin",
        "build/index.js"
      ),
      tracing: Tracing.ACTIVE,
      logRetention: RetentionDays.SIX_MONTHS,
      timeout: Duration.seconds(60),
      environment: {},
      role: role
    });

    new Rule(this, "rule", {
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [new LambdaFunction(lambdaBitcoin)],
    });
  }
}
