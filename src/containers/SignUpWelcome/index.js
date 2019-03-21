import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';
import Analytics from '../../utils/analytics';

import ONBOARD_1 from '../../../images/onboard1.jpg';
import ONBOARD_2 from '../../../images/onboard2.jpg';
import ONBOARD_3 from '../../../images/onboard3.jpg';
import LOGO from '../../../images/voke_logo_words.png';
import styles from './styles';
import {
  navigateResetHome,
  navigatePush,
  navigateBack,
} from '../../actions/nav';
import { createAccountAction, setupFirebaseLinks } from '../../actions/auth';
import { CREATE_ANON_USER } from '../../constants';
import theme, { COLORS } from '../../theme';

import { Flex, Text, Button, VokeIcon } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import PrivacyToS from '../../components/PrivacyToS';
import { trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';

const MARGIN = 40;
const extraBottom = theme.isIphoneX ? 30 : 0;

class SignUpWelcome extends Component {
  state = {
    selectedPage: 0,
    totalSteps: 3,
    isLoading: false,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.Welcome);
    Orientation.lockToPortrait();
    this.props.dispatch(setupFirebaseLinks());
    this.props.dispatch(trackState(buildTrackingObj('entry', 'screen1')));
  }

  onPageSelected = params => {
    this.setState({ selectedPage: params.position });
    this.props.dispatch(
      trackState(buildTrackingObj('entry', `screen${params.position + 1}`)),
    );
  };

  handleNextPage(i) {
    this.viewPager.setPage(i + 1);
  }

  tryItNow = () => {
    const { dispatch } = this.props;
    this.setState({ isLoading: true });
    dispatch(createAccountAction(null, null, true))
      .then(results => {
        LOG('create try it now account results', results);
        dispatch({ type: CREATE_ANON_USER });
        this.setState({ isLoading: false });
        // dispatch(navigateResetHome());
        dispatch(navigatePush('voke.TryItNowName'));
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  };

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{
          marginBottom: 45,
          width: 100,
          marginHorizontal: theme.fullWidth / 2 - 50,
        }}
        dotStyle={{
          backgroundColor: COLORS.TRANSPARENT,
          borderColor: COLORS.WHITE,
          borderWidth: 1,
          marginHorizontal: 3,
          height: 12,
          width: 12,
          borderRadius: 12,
        }}
        selectedDotStyle={{
          backgroundColor: COLORS.WHITE,
          marginHorizontal: 3,
          height: 12,
          width: 12,
          borderRadius: 12,
        }}
        pageCount={3}
      />
    );
  }

  renderTopTriangle = t => {
    return (
      <Flex
        direction="column"
        align="end"
        style={{
          position: 'absolute',
          top: 0,
          paddingTop: MARGIN + 50,
          right: MARGIN,
          paddingHorizontal: 15,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <Text style={styles.tagline}>{t}</Text>
        <View
          style={{
            overflow: 'hidden',
            height: 80,
            width: 160,
            position: 'absolute',
            bottom: -80,
            left: 0,
          }}
        >
          <View style={styles.topTriangle} />
        </View>
      </Flex>
    );
  };

  render() {
    const { t, dispatch } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
        <StatusBar />
        <Flex value={3}>
          <IndicatorViewPager
            indicator={this.renderDotIndicator()}
            ref={c => (this.viewPager = c)}
            style={{ flex: 1, flexDirection: 'column-reverse' }}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Flex
                value={1}
                direction="column"
                align="center"
                justify="center"
              >
                <Flex value={1} align="center" justify="center">
                  <Image
                    resizeMode="cover"
                    source={ONBOARD_1}
                    style={styles.onboardFull}
                  />
                </Flex>
              </Flex>
              {this.renderTopTriangle('Grow in new ways.')}
            </View>

            <View style={styles.onboardingPage}>
              <Flex
                value={1}
                direction="column"
                align="center"
                justify="center"
              >
                <Flex value={1} align="center" justify="center">
                  <Image
                    resizeMode="cover"
                    source={ONBOARD_2}
                    style={styles.onboardFull}
                  />
                </Flex>
              </Flex>
              {this.renderTopTriangle('Join the adventure.')}
            </View>
            <View style={styles.onboardingPage}>
              <Flex
                value={1}
                direction="column"
                align="center"
                justify="center"
              >
                <Flex value={1} align="center" justify="center">
                  <Image
                    resizeMode="cover"
                    source={ONBOARD_3}
                    style={styles.onboardFull}
                  />
                </Flex>
              </Flex>
              {this.renderTopTriangle('Bring others.')}
            </View>
          </IndicatorViewPager>
        </Flex>
        <Flex value={2}>
          <View style={styles.triangle} />
          <Flex value={1} style={styles.bottomButtonsWrap}>
            <Flex
              style={{
                position: 'absolute',
                bottom: 160 + extraBottom,
                right: 0,
                left: 0,
                padding: 5,
                marginHorizontal: 50,
              }}
            >
              <Button
                text={t('start')}
                isLoading={this.state.isLoading}
                style={styles.actionButton}
                onPress={this.tryItNow}
              />
            </Flex>
            <Flex
              style={{
                position: 'absolute',
                bottom: 120 + extraBottom,
                right: 0,
                left: 0,
                padding: 5,
              }}
            >
              <PrivacyToS style={styles.privacy} />
            </Flex>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{
                position: 'absolute',
                bottom: 20 + extraBottom,
                right: 0,
                left: 0,
              }}
            >
              <Text style={styles.signIn}>{t('haveAccount')}</Text>
              <Button
                text={t('signIn')}
                style={styles.signInButton}
                buttonTextStyle={styles.signInText}
                onPress={() => dispatch(navigatePush('voke.LoginInput'))}
              />
            </Flex>
          </Flex>
        </Flex>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  noSignIn: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('signUpWelcome')(
  connect(mapStateToProps)(SignUpWelcome),
);
