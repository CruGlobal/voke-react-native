import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';

import styles from './styles';
// import { getMe, facebookLoginAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';

import { Flex, Text, Button } from '../../components/common';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';

class SignInOrTryItNow extends Component {

  componentDidMount() {
    Analytics.screen('SignInOrTryItNow');
  }

  tryItNow = () => {
    LOG('try it now');
    // this.props.navigatePush('voke.SignUpAccount');
    // TODO: Implement the Try It Now flow
    // Make API call, then navigate to the "Enter your name" screen
    this.props.navigatePush('voke.TryItNowName');
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
              text="Try It Now"
              buttonTextStyle={styles.signInButton}
              style={styles.actionButton}
              onPress={this.tryItNow}
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

SignInOrTryItNow.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps, nav)(SignInOrTryItNow);
