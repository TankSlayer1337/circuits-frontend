import * as cdk from 'aws-cdk-lib';
import { EnvironmentConfiguration } from './environment-configurations';
import { Construct } from 'constructs';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

export interface ExerciseCircuitsFrontendGlobalResourcesStackProps extends cdk.StackProps {
  envConfig: EnvironmentConfiguration
}

export class ExerciseCircuitsFrontendGlobalResourcesStack extends cdk.Stack {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: ExerciseCircuitsFrontendGlobalResourcesStackProps) {
    super(scope, id, props);

    const projectName = props.envConfig.projectName;
    const stage = props.envConfig.stage;
    const apexDomain = 'cloudchaotic.com';

    const hostedZone = HostedZone.fromLookup(this, 'Z05241663C6V8VT2JGS2K', {
      domainName: apexDomain
    });

    this.certificate = new Certificate(this, 'Certificate', {
      certificateName: `${projectName}-certificate-${this.region}-${stage}`,
      domainName: props.envConfig.useStageSubDomain ? `${stage}.exercise-circuits.${apexDomain}` : `exercise-circuits.${apexDomain}`,
      validation: CertificateValidation.fromDns(hostedZone)
    });
    this.certificate.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}