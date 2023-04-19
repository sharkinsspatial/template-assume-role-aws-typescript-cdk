import {
    aws_iam as iam,
    aws_lambda as lambda,
    Duration
  } from "aws-cdk-lib";
import { Construct } from "constructs";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";


export class LambdaConstruct extends Construct {
  public lambdaRole: iam.Role;
  constructor(scope: Construct, id: string, dataAccessRole: iam.Role ) {
    super(scope, id);

    this.lambdaRole = new iam.Role(this, "lambda-role", {
      roleName: "lambda-role",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });

    const handler = new PythonFunction(this, "lambda-function-test", {
      entry: "./lambda",
      index: "handler.py",
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: Duration.seconds(30),
      environment: { DATA_ACCESS_ROLE_ARN: dataAccessRole.roleArn },
      role: this.lambdaRole,
    });
  }
}
  
