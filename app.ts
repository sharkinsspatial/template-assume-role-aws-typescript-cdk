#!/usr/bin/env node
import {
    App,
    Stack,
    aws_iam as iam,
  } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./lambda_stack"

export class TestInfra extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

  
    const dataAccessRole = new iam.Role(this, "data-access-role", {assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"), roleName: "data-access-role"});

    dataAccessRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:Get*", "s3:List*"],
        resources: ["arn:aws:s3:::test-emile-tenezakis"],
      })
    );
      
    const lambda_role = iam.Role.fromRoleName(this, "lambda-role", "lambda-role");
    
    const lambda_role_principal = new iam.ArnPrincipal(lambda_role.roleArn);

    const allow_policy = new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      principals: [lambda_role_principal],
      effect: iam.Effect.ALLOW
    });

    dataAccessRole.assumeRolePolicy?.addStatements(allow_policy);
    
  }
}


export const app = new App({});
const lambda_stack = new LambdaStack(app, "lambda-stack");
const test_stack = new TestInfra(app, "test-stack");

app.synth();