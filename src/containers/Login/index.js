import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { getMe, facebookLoginAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import ApiLoading from '../ApiLoading';
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

    this.state = { isLoading: false };
    
    this.facebookLogin = this.facebookLogin.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Contacts');
  }

  // This code is also listed in the LoginInput container.
  // If you make any changes, be sure to make them over there as well
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
                this.props.navigateResetHome();
              } else {
                this.props.navigatePush('voke.SignUpFBAccount', {
                  me: meResult,
                });
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
        {
          this.state.isLoading ? <ApiLoading force={true} /> : null
        }
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
