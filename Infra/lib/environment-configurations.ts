import { Environment } from "aws-cdk-lib"

export interface EnvironmentConfiguration {
    awsEnv: Environment,
    projectName: string,
    stage: string,
    useStageSubDomain: boolean
}

const stockholm: Environment = { region: 'eu-north-1', account: process.env.CDK_DEFAULT_ACCOUNT };

export const devConfiguration: EnvironmentConfiguration = {
    awsEnv: stockholm,
    projectName: 'exercise-circuits-frontend',
    stage: 'dev',
    useStageSubDomain: true
}

export const stagingConfiguration: EnvironmentConfiguration = {
    awsEnv: stockholm,
    projectName: 'exercise-circuits-frontend',
    stage: 'staging',
    useStageSubDomain: true
}

export const prodConfiguration: EnvironmentConfiguration = {
    awsEnv: stockholm,
    projectName: 'exercise-circuits-frontend',
    stage: 'prod',
    useStageSubDomain: false
}

export const environmentConfigurations: EnvironmentConfiguration[] = [ devConfiguration, stagingConfiguration, prodConfiguration ]