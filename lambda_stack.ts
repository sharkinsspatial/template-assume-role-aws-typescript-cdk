import {
    Stack,
    aws_iam as iam,
    aws_lambda as lambda,
    Duration
  } from "aws-cdk-lib";
import { Construct } from "constructs";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";


export class LambdaStack extends Stack {
constructor(scope: Construct, id: string) {
    super(scope, id);

    const data_access_role = iam.Role.fromRoleName(this, "data-access-role", "data-access-role");

    const lambda_role = new iam.Role(this, "lambda-role", {
    roleName: "lambda-role",
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });

    const handler = new PythonFunction(this, "lambda-function-test", {
    entry: "./lambda",
    index: "handler.py",
    runtime: lambda.Runtime.PYTHON_3_9,
    timeout: Duration.seconds(30),
    environment: { DATA_ACCESS_ROLE_ARN: data_access_role.roleArn },
    role: lambda_role,
    });
}
}
  