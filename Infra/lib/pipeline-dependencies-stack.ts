import * as cdk from 'aws-cdk-lib';
import { Effect, FederatedPrincipal, OpenIdConnectPrincipal, OpenIdConnectProvider, PolicyStatement, PrincipalWithConditions, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class PipelineDependenciesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const oidcProvider = new OpenIdConnectProvider(this, 'OpenIdConnectGitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
      clientIds: ['sts.amazonaws.com'],
    });

    // const githubDeployRole = new Role(this, 'GitHubDeployRole', {
    //   assumedBy: new FederatedPrincipal(oidcProvider.openIdConnectProviderArn)
    // });
    // githubDeployRole.addToPolicy(new PolicyStatement({
    //   effect: Effect.ALLOW,
    //   actions: ['sts:AssumeRoleWithWebIdentity'],
    //   conditions: {
    //     'StringEquals': {
    //       'token.actions.githubusercontent.com:sub': 'repo:TankSlayer1337/circuits-frontend:*',
    //       'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
    //     }
    //   },
    //   resources: [ 'arn:aws:iam::*:role/cdk-*' ]
    // }));

    const githubDeployRole = new Role(this, 'GitHubDeployRole', {
      assumedBy: new OpenIdConnectPrincipal(oidcProvider, {
        'Condition': {
          'StringEquals': {
            'token.actions.githubusercontent.com:sub': 'repo:TankSlayer1337/circuits-frontend:*',
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
          }
        }
      })
    });
  }
}
