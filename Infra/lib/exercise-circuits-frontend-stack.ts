import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfiguration } from './environment-configurations';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

interface ExerciseCircuitsFrontendStackProps extends cdk.StackProps {
  envConfig: EnvironmentConfiguration,
  certificate: Certificate
}

export class ExerciseCircuitsFrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExerciseCircuitsFrontendStackProps) {
    super(scope, id, props);
    
    const stage = props.envConfig.stage;
    const apexDomain = 'cloudchaotic.com';
    const applicationName = 'exercise-circuits';
    const applicationUrl = `${applicationName}.${apexDomain}`;
    const fullUrl = props.envConfig.useStageSubDomain ? `${stage}.${applicationUrl}` : applicationUrl;

    const websiteBucket = new Bucket(this, 'WebsiteOriginBucket', {
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    });

    const hostedZone = HostedZone.fromLookup(this, 'Z05241663C6V8VT2JGS2K', {
      domainName: apexDomain
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `Origin Access Identity for exercise circuits ${stage}.`
    });
    originAccessIdentity.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    websiteBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, {
          originAccessIdentity: originAccessIdentity
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      domainNames: [fullUrl],
      certificate: props.certificate,
      defaultRootObject: 'index.html'
    });

    new ARecord(this, 'CloudFrontARecord', {
      zone: hostedZone,
      recordName: props.envConfig.useStageSubDomain ? `${stage}.${applicationName}` : applicationName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      ttl: cdk.Duration.seconds(0)  // TODO: reset to default?
    });

    new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset('../circuits/dist')],
      destinationBucket: websiteBucket,
      distribution
    });
  }
}
