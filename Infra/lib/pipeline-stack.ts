import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Deploy', {
        input: CodePipelineSource.gitHub('TankSlayer1337/circuits-frontend', 'main'),
        commands: [
          'cd circuits',
          'npm i',
          'npm run build',
          'cd ..',
          'cd Infra',
          'cdk deploy --all'
        ]
      })
    });
  }
}