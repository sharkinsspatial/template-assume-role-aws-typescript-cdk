import {
    Stack,
    aws_iam as iam,
  } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda_stack"

export class TestInfra extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

  
  const dataAccessRole = new iam.Role(this, "data-access-role", {assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")});

  dataAccessRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ["s3:Get*", "s3:List*"],
      resources: ["arn:aws:s3:::test-emile-tenezakis"],
    })
  );
    
  new LambdaStack(this, "lambda-stack");

  const lambda_role = iam.Role.fromRoleName(this, "lambda-role", "lambda-role");

  dataAccessRole.assumeRolePolicy?.addStatements(
    new iam.PolicyStatement(
      {
        actions: ['sts:AssumeRole'], 
        principals: [new iam.ArnPrincipal(lambda_role.roleArn)],
        effect: iam.Effect.ALLOW
      }
    )
  );
  
  }
}
