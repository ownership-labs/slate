import * as React from "react";
import * as UserBehaviors from "~/common/user-behaviors";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

import { css } from "@emotion/react";
import { Initial, Signin, Signup, TwitterSignup } from "~/components/core/Auth";

import { useAuthFlow, useTwitter, useSignup } from "./hooks";

const background_image =
  "https://slate.textile.io/ipfs/bafybeiddgkvf5ta6y5b7wamrxl33mtst4detegleblw4gfduhwm3sdwdra";

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 1rem;

  min-height: 100vh;
  width: 100vw;
  position: absolute;
  overflow: hidden;
  background-image: url(${background_image});
  background-repeat: no-repeat;
  background-size: cover;
`;

const STYLES_MIDDLE = css`
  position: relative;
  min-height: 10%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: left;
  padding: 24px;
`;

const SigninScene = ({ onAuthenticate, onTwitterAuthenticate, ...props }) => {
  const {
    goToSigninScene,
    goToSignupScene,
    goToTwitterSignupScene,
    scene,
    context,
  } = useAuthFlow();

  const twitterProvider = useTwitter({
    onAuthenticate: onTwitterAuthenticate,
    goToTwitterSignupScene,
  });

  const signupProvider = useSignup({ onAuthenticate: onAuthenticate });

  if (scene === "signin")
    return (
      <Signin
        {...props}
        onAuthenticate={onAuthenticate}
        emailOrUsername={context.emailOrUsername}
      />
    );

  if (scene === "signup")
    return (
      <Signup
        verifyEmail={signupProvider.verifyEmail}
        resendEmailVerification={signupProvider.resendVerification}
        createUser={signupProvider.createUser}
      />
    );

  if (scene === "twitter_signup")
    return (
      <TwitterSignup
        initialEmail={context.twitterEmail}
        createVerification={twitterProvider.createVerification}
        resendEmailVerification={twitterProvider.resendEmailVerification}
        onSignupWithVerification={twitterProvider.signupWithVerification}
        onSignup={twitterProvider.signup}
      />
    );

  return (
    <Initial
      createVerification={signupProvider.createVerification}
      isSigninViaTwitter={twitterProvider.isLoggingIn}
      onTwitterSignin={twitterProvider.signin}
      goToSigninScene={goToSigninScene}
      goToSignupScene={goToSignupScene}
    />
  );
};

const WithCustomWrapper = (Component) => (props) => (
  <WebsitePrototypeWrapper>
    <div css={STYLES_ROOT}>
      <div css={STYLES_MIDDLE}>
        <Component {...props} />
      </div>
    </div>
  </WebsitePrototypeWrapper>
);

export default WithCustomWrapper(SigninScene);
