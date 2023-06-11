import { Amplify } from "aws-amplify";
import configuration from "./amplify-configuration";

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

  // Assuming you have two redirect URIs, and the first is for localhost and second is for production
  const [
    localRedirectSignIn,
    productionRedirectSignIn,
  ] = configuration.Auth.oauth.redirectSignIn.split(",");

  const [
    localRedirectSignOut,
    productionRedirectSignOut,
  ] = configuration.Auth.oauth.redirectSignOut.split(",");

  const updatedAwsConfig = {
    ...configuration.Auth,
    cookieStorage: {
      ...configuration.Auth.cookieStorage,
      domain: isLocalhost ? 'localhost' : configuration.Auth.cookieStorage.domain,
      secure: isLocalhost ? false : configuration.Auth.cookieStorage.secure
    },
    oauth: {
      ...configuration.Auth.oauth,
      redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
      redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
    }
  }

  Amplify.configure(updatedAwsConfig);
}
