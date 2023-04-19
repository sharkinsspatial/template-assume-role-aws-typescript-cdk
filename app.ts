#!/usr/bin/env node
import {
    App,
    Stack,
    aws_iam as iam,
  } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaConstruct } from "./lambda_construct";

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
      
    const lambda_construct = new LambdaConstruct(this, "lambda-construct", dataAccessRole)

    const allow_policy = new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      principals: [lambda_construct.lambdaRole],
      effect: iam.Effect.ALLOW
    });

    dataAccessRole.assumeRolePolicy?.addStatements(allow_policy);
  }
}


export const app = new App({});
const test_stack = new TestInfra(app, "test-stack");

app.synth();
