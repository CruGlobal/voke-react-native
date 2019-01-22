import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  LoginManager,
  GraphRequestManager,
  GraphRequest,
  AccessToken,
} from 'react-native-fbsdk';
import { translate } from 'react-i18next';

import { getMe, facebookLoginAction, logoutAction } from '../../actions/auth';
import { navigateResetHome, navigatePush } from '../../actions/nav';

import { Button } from '../../components/common';
import styles from './styles';
import CONSTANTS, { RESET_ANON_USER } from '../../constants';

class FacebookButton extends Component {
  state = { anonUserId: undefined };

  componentDidMount() {
    const { isAnonUser, myId } = this.props;
    if (isAnonUser) {
      this.setState({ anonUserId: myId });
    }
  }

  facebookLogin = () => {
    this.props.onNavigate && this.props.onNavigate();
    LoginManager.logInWithReadPermissions(CONSTANTS.FACEBOOK_SCOPE)
      .then(
        result => {
          LOG('Facebook login result', result);
          if (result.isCancelled) {
            return;
          }
          AccessToken.getCurrentAccessToken().then(data => {
            if (!data.accessToken) {
              LOG('facebook access token doesnt exist');
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
            const infoRequest = new GraphRequest(
              '/me',
              getMeConfig,
              (err, meResult) => {
                if (err) {
                  LOG('error getting facebook user', err);
                  return;
                }
                LOG('facebook me', meResult);
                if (this.props.isAnonUser) {
                  this.props.dispatch(logoutAction()).then(() => {
                    this.props
                      .dispatch(
                        facebookLoginAction(accessToken, this.state.anonUserId),
                      )
                      .then(() => {
                        this.props.dispatch(getMe()).then(() => {
                          if (this.props.isSignIn) {
                            this.props.dispatch({ type: RESET_ANON_USER });
                            this.props.dispatch(navigateResetHome());
                          } else {
                            this.props.dispatch(
                              navigatePush('voke.SignUpFBAccount', {
                                me: meResult,
                              }),
                            );
                          }
                        });
                      })
                      .catch(() => {});
                  });
                } else {
                  this.props
                    .dispatch(facebookLoginAction(accessToken))
                    .then(() => {
                      this.props.dispatch(getMe()).then(() => {
                        if (this.props.isSignIn) {
                          this.props.dispatch({ type: RESET_ANON_USER });
                          this.props.dispatch(navigateResetHome());
                        } else {
                          this.props.dispatch(
                            navigatePush('voke.SignUpFBAccount', {
                              me: meResult,
                            }),
                          );
                        }
                      });
                    })
                    .catch(() => {});
                }
              },
            );
            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        },
        err => {
          LOG('err', err);
          LoginManager.logOut();
        },
      )
      .catch(() => {
        LOG('facebook login manager catch');
      });
  };

  render() {
    const { t, style, ...rest } = this.props;
    return (
      <Button
        text={t('signUpFb')}
        icon="facebook-square"
        iconType="FontAwesome"
        style={[styles.actionButton, style]}
        {...rest}
        onPress={this.facebookLogin}
      />
    );
  }
}
const mapStateToProps = ({ auth }) => ({
  myId: auth.user ? auth.user.id : null,
  isAnonUser: auth.isAnonUser,
});

export default translate()(connect(mapStateToProps)(FacebookButton));
