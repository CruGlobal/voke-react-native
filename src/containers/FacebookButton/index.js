import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';

import { getMe, facebookLoginAction } from '../../actions/auth';
import { navigateResetHome, navigatePush } from '../../actions/nav';

import { Button } from '../../components/common';
import styles from './styles';
import CONSTANTS from '../../constants';

class FacebookButton extends Component {

  facebookLogin() {
    this.setState({ isLoading: true });
    LoginManager.logInWithReadPermissions(CONSTANTS.FACEBOOK_SCOPE).then((result) => {
      LOG('Facebook login result', result);
      if (result.isCancelled) {
        this.setState({ isLoading: false });
        return;
      }
      AccessToken.getCurrentAccessToken().then((data) => {
        if (!data.accessToken) {
          LOG('facebook access token doesnt exist');
          this.setState({ isLoading: false });
          return;
        }
        const accessToken = data.accessToken.toString();
        const getMeConfig = {
          version: CONSTANTS.FACEBOOK_VERSION,
          accessToken,
          parameters: {
            fields: {
              string: CONSTANTS.FACEBOOK_FIELDS,
            },
          },
        };
        // Create a graph request asking for user information with a callback to handle the response.
        const infoRequest = new GraphRequest('/me', getMeConfig, (err, meResult) => {
          if (err) {
            LOG('error getting facebook user', err);
            this.setState({ isLoading: false });
            return;
          }
          LOG('facebook me', meResult);
          this.props.dispatch(facebookLoginAction(accessToken)).then(() => {
            this.props.dispatch(getMe()).then((results) => {
              this.setState({ isLoading: false });
              if (results.state === 'configured') {
                this.props.dispatch(navigateResetHome());
              } else {
                this.props.dispatch(navigatePush('voke.SignUpFBAccount', {
                  me: meResult,
                }));
              }
            });
          }).catch(() => {
            this.setState({ isLoading: false });
          });
        });
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }, (err) => {
      LOG('err', err);
      this.setState({ isLoading: false });
      LoginManager.logOut();
    }).catch(() => {
      this.setState({ isLoading: false });
      LOG('facebook login manager catch');
    });
  }
  
  render() {
    const { style, ...rest } = this.props;
    return (
      <Button
        text="Sign Up with Facebook"
        icon="facebook-square"
        iconType="FontAwesome"
        style={[styles.actionButton, style]}
        {...rest}
        onPress={this.facebookLogin}
      />
    );
  }
}

export default connect()(FacebookButton);
