import * as cdk from 'aws-cdk-lib';
import { ArnPrincipal, Effect, FederatedPrincipal, OpenIdConnectProvider, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class PipelineDependenciesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const oidcProvider = new OpenIdConnectProvider(this, 'OpenIdConnectGitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
      clientIds: ['sts.amazonaws.com'],
    });

    const githubDeployRole = new Role(this, 'GitHubDeployRole', {
      assumedBy: new ArnPrincipal(oidcProvider.openIdConnectProviderArn)
    });
    githubDeployRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [ new FederatedPrincipal(oidcProvider.openIdConnectProviderArn)],
      actions: ['sts:AssumeRoleWithWebIdentity'],
      conditions: {
        'StringEquals': {
          'token.actions.githubusercontent.com:sub': 'repo:TankSlayer1337/circuits-frontend:*',
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
        }
      }
    }));
  }
}
