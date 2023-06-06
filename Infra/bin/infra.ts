#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExerciseCircuitsFrontendStack } from '../lib/exercise-circuits-frontend-stack';
import { ExerciseCircuitsFrontendGlobalResourcesStack } from '../lib/global-resources-stack';
import { environmentConfigurations } from '../lib/environment-configurations';

const app = new cdk.App();
environmentConfigurations.forEach(envConfig => {
  const env = envConfig.awsEnv;
  const globalResources = new ExerciseCircuitsFrontendGlobalResourcesStack(app, `${envConfig.projectName}-global-resources-${env.region}-${envConfig.stage}`, {
    envConfig: envConfig,
    env: { region: 'us-east-1' }
  });

  new ExerciseCircuitsFrontendStack(app, `${envConfig.projectName}-${env.region}-${envConfig.stage}`, {
    envConfig: envConfig,
    env: env,
    certificate: globalResources.certificate
  });
})