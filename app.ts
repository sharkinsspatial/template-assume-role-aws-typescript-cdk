#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { TestInfra } from "./testinfra";

export const app = new cdk.App({});

new TestInfra(app, "test-stack");
