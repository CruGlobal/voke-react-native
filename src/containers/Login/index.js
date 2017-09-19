import React, { Component } from 'react';
import { Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { getMe, facebookLoginAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Button } from '../../components/common';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS from '../../constants';

class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.facebookLogin = this.facebookLogin.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Contacts');
  }

  facebookLogin() {
    LOG('Making FB Call');
    LoginManager.logInWithReadPermissions(CONSTANTS.FACEBOOK_SCOPE).then((result) => {
      LOG('RESULT', result);
      if (result.isCancelled) {
        LOG('facebook login was canceled', result);
      } else {
        LOG('successful facebook login', result);
        AccessToken.getCurrentAccessToken().then((data) => {
          if (!data.accessToken) {
            LOG('access token doesnt exist');
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
              return;
            }
            LOG('me', meResult);
            this.props.dispatch(facebookLoginAction(accessToken)).then(() => {
              this.props.dispatch(getMe()).then((results) => {
                if (results.state === 'configured') {
                  this.props.navigateResetHome();
                } else {
                  this.props.navigatePush('voke.SignUpFBAccount', {
                    me: meResult,
                  });
                }
              });
            });
          });
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    }, (err) => {
      LOG('err', err);
      LoginManager.logOut();
    }).catch(() => {
      LOG('catch');
    });
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
        <Flex direction="column" value={1} align="center" justify="end" style={styles.logoWrapper}>
          <Flex style={styles.imageWrap} align="center" justify="center">
            <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
          </Flex>
          <Text style={styles.headerText}>A free chat app that helps kickstart deeper conversations using thought-provoking videos</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.actions}>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Create Free Account"
              icon="mail-outline"
              buttonTextStyle={styles.signInButton}
              style={styles.actionButton}
              onPress={() => this.props.navigatePush('voke.SignUpAccount')}
            />
          </Flex>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Sign Up with Facebook"
              buttonTextStyle={styles.signInButton}
              icon="facebook-square"
              iconType="FontAwesome"
              style={styles.actionButton}
              onPress={this.facebookLogin}
            />
          </Flex>
          <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Button
              text="Sign In"
              type="transparent"
              buttonTextStyle={styles.signInText}
              onPress={() => this.props.navigatePush('voke.LoginInput')}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

Login.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps, nav)(Login);
