import { Environment } from "aws-cdk-lib"

export interface EnvironmentConfiguration {
    awsEnv: Environment,
    projectName: string,
    stage: string,
    stageSubDomain: string
}

const stockholm: Environment = { region: 'eu-north-1', account: process.env.CDK_DEFAULT_ACCOUNT };

export const devConfiguration: EnvironmentConfiguration = {
    awsEnv: stockholm,
    projectName: 'exercise-circuits-frontend',
    stage: 'dev',
    stageSubDomain: 'dev'
}

export const environmentConfigurations: EnvironmentConfiguration[] = [ devConfiguration ]