import { Amplify } from "aws-amplify";
import configuration from "./amplify-configuration";

// modified version of this: https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#set-up-backend-resources
export function configureAmplify(): void {
  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  let redirect: string;
  let cognitoDomain: string;
  const hostname = window.location.hostname;
  const devCognitoDomain = 'exercise-circuits-dev.auth.eu-north-1.amazoncognito.com';
  if (isLocalhost) {
    redirect = 'http://localhost:5173';
    cognitoDomain = devCognitoDomain;
  } else {
    const subdomain = hostname.split('.')[0];
    switch (subdomain) {
      case 'dev':
        redirect = 'https://dev.exercise-circuits.cloudchaotic.com';
        cognitoDomain = devCognitoDomain;
        break;
      case 'staging':
        redirect = 'https://staging.exercise-circuits.cloudchaotic.com';
        cognitoDomain = 'exercise-circuits-staging.auth.eu-north-1.amazoncognito.com';
        break;
      case 'exercise-circuits':
        redirect = 'https://exercise-circuits.cloudchaotic.com';
        cognitoDomain = 'exercise-circuits-prod.auth.eu-north-1.amazoncognito.com';
        break;
      default:
        throw new Error('Invalid subdomain!');
    }
  }

  const updatedAwsConfig = {
    ...configuration.Auth,
    cookieStorage: {
      ...configuration.Auth.cookieStorage,
      // TODO: this might need to get updated.
      domain: isLocalhost ? 'localhost' : configuration.Auth.cookieStorage.domain,
      secure: isLocalhost ? false : configuration.Auth.cookieStorage.secure
    },
    oauth: {
      ...configuration.Auth.oauth,
      domain: cognitoDomain,
      redirectSignIn: redirect,
      redirectSignOut: redirect,
    }
  }

  Amplify.configure(updatedAwsConfig);
}
