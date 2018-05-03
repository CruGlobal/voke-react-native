import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';
import ONBOARD_4 from '../../../images/onboarding-image-4.png';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import { createAccountAction } from '../../actions/auth';
import { CREATE_ANON_USER } from '../../constants';

import { Flex, Text, Button, VokeIcon } from '../../components/common';

const MARGIN = 40;

class SignInOrTryItNow extends Component {

  componentDidMount() {
    Analytics.screen('SignInOrTryItNow');
  }

  tryItNow = () => {
    this.props.dispatch(createAccountAction(null, null, true)).then((results) => {
      LOG('create try it now account results', results);
      this.props.dispatch({ type: CREATE_ANON_USER });
      this.setState({ isLoading: false });
      this.props.navigateResetHome();
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <View style={styles.onboardingPage}>
        <Flex direction="column" align="center" justify="center" >
          <Flex align="center" justify="center">
            <Image resizeMode="cover" source={ONBOARD_4} style={styles.onboardFull} />
          </Flex>
        </Flex>
        <Flex direction="column" align="end" style={{position: 'absolute', top: MARGIN, right: MARGIN, width: 250 }}>
          <VokeIcon style={{width: 36, height: 36}} name="onboard-heart"></VokeIcon>
          <Text style={{fontSize: 36, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0)', textAlign: 'right'}}>Experience {'\n'} Deeper {'\n'} Friendships</Text>
        </Flex>
        <Flex align="center" justify="center" style={{position: 'absolute', bottom: MARGIN, right: 0, left: 0 }}>
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
      </View>
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
