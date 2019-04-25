import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';
import Analytics from '../../utils/analytics';

import ONBOARD_1 from '../../../images/onboard1.jpg';
import ONBOARD_2 from '../../../images/onboard2.jpg';
import ONBOARD_3 from '../../../images/onboard3.jpg';
import styles from './styles';
import { navigatePush } from '../../actions/nav';
import { setupFirebaseLinks } from '../../actions/auth';
import theme, { COLORS } from '../../theme';

import {
  View,
  Image,
  Flex,
  Text,
  Button,
  Triangle,
} from '../../components/common';
import StatusBar from '../../components/StatusBar';
import PrivacyToS from '../../components/PrivacyToS';
import { trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import st from '../../st';

const MARGIN = 40;
const extraBottom = theme.isIphoneX ? 30 : 0;

class SignUpWelcome extends Component {
  state = {
    selectedPage: 0,
    totalSteps: 3,
    isLoading: false,
    bottomHeight: 0,
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
    dispatch(navigatePush('voke.TryItNowName'));

    this.setState({ isLoading: false });
  };

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{
          marginBottom: st.fullHeight * 0.4,
          width: 100,
          marginHorizontal: st.fullWidth / 2 - 50,
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
            height: st.isAndroid ? 50 : 80,
            width: 160,
            position: 'absolute',
            bottom: st.isAndroid ? -50 : -80,
            left: 0,
          }}
        >
          <Triangle
            width={160}
            height={st.isAndroid ? 50 : 80}
            color={'rgba(0,0,0,0.4)'}
            flip={true}
            slant="down"
            style={[st.abs, { right: 0 }]}
          />
        </View>
      </Flex>
    );
  };

  render() {
    const { t, dispatch } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
        <StatusBar />
        <Flex value={1}>
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
                    source={ONBOARD_3}
                    style={styles.onboardFull}
                  />
                </Flex>
              </Flex>
              {this.renderTopTriangle('Bring others.')}
            </View>
          </IndicatorViewPager>
        </Flex>
        <Triangle
          width={st.fullWidth}
          height={120}
          color={st.colors.darkBlue}
          style={[st.absb, { bottom: this.state.bottomHeight }]}
        />
        <Flex
          style={[st.absb, st.fw100]}
          onLayout={e =>
            this.setState({ bottomHeight: e.nativeEvent.layout.height })
          }
        >
          <Flex value={1} style={[st.bgDarkBlue]}>
            <Flex
              style={[
                {
                  justifyContent: 'flex-end',
                  flex: 1,
                  marginBottom: 25,
                  padding: 5,
                  marginHorizontal: 5,
                },
              ]}
            >
              <Flex align="center" justify="center">
                <Button
                  isAndroidOpacity={true}
                  text={t('start')}
                  style={[styles.actionButton, st.mb3]}
                  buttonTextStyle={[st.fs3]}
                  onPress={this.tryItNow}
                />
                <PrivacyToS style={[st.fs5, st.ph1]} />
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={[st.mt2, st.pt4]}
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
