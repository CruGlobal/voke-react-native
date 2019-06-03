import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import ONBOARD_1 from '../../../images/onboard1.jpg';
import ONBOARD_2 from '../../../images/onboard2.jpg';
import ONBOARD_3 from '../../../images/onboard3.jpg';
import styles from './styles';
import { navigatePush } from '../../actions/nav';
import { setupFirebaseLinks } from '../../actions/auth';

import {
  View,
  Image,
  Flex,
  Text,
  Button,
  Triangle,
  Touchable,
} from '../../components/common';
import StatusBar from '../../components/StatusBar';
import PrivacyToS from '../../components/PrivacyToS';
import { trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import st from '../../st';
import { IS_SMALL_ANDROID } from '../../constants';

const MARGIN = 40;

function PageImage({ stopAutoPlay, image, text }) {
  return (
    <Touchable
      onPressIn={stopAutoPlay}
      style={[st.f1]}
      activeOpacity={1}
      isAndroidOpacity={true}
    >
      <Flex value={1} direction="column" align="center" justify="center">
        <Flex value={1} align="center" justify="center">
          <Image resizeMode="cover" source={image} style={styles.onboardFull} />
        </Flex>
      </Flex>
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
        <Text style={styles.tagline}>{text}</Text>
        <View
          style={{
            overflow: 'hidden',
            width: 160,
            position: 'absolute',
            left: 0,
            height: 50,
            bottom: -50,
          }}
        >
          <Triangle
            width={160}
            height={50}
            color={'rgba(0,0,0,0.4)'}
            flip={true}
            slant="down"
            style={[st.absr]}
          />
        </View>
      </Flex>
    </Touchable>
  );
}

class SignUpWelcome extends Component {
  state = {
    selectedPage: 0,
    totalSteps: 3,
    bottomHeight: 0,
    shouldAutoPlay: true,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.Welcome);
    this.props.dispatch(setupFirebaseLinks());
    this.props.dispatch(trackState(buildTrackingObj('entry', 'screen1')));
  }

  onPageSelected = params => {
    this.setState({ selectedPage: params.position });
    this.props.dispatch(
      trackState(buildTrackingObj('entry', `screen${params.position + 1}`)),
    );
  };

  nav = to => {
    const { dispatch } = this.props;
    this.setState({ shouldAutoPlay: false });
    dispatch(navigatePush(to));
  };

  tryItNow = () => {
    this.nav('voke.TryItNowName');
  };

  stopAutoPlay = () => this.setState({ shouldAutoPlay: false });

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{
          marginBottom: st.fullHeight * (IS_SMALL_ANDROID ? 0.5 : 0.4),
          width: 100,
          marginHorizontal: st.fullWidth / 2 - 50,
        }}
        dotStyle={{
          backgroundColor: st.colors.transparent,
          borderColor: st.colors.white,
          borderWidth: 1,
          marginHorizontal: 3,
          height: 12,
          width: 12,
          borderRadius: 12,
        }}
        selectedDotStyle={{
          backgroundColor: st.colors.white,
          marginHorizontal: 3,
          height: 12,
          width: 12,
          borderRadius: 12,
        }}
        pageCount={3}
      />
    );
  }

  render() {
    const { t } = this.props;
    return (
      <View style={[st.f1, st.bgBlue]}>
        <StatusBar />
        <Flex value={1}>
          <IndicatorViewPager
            indicator={this.renderDotIndicator()}
            ref={c => (this.viewPager = c)}
            style={[st.f1, st.fdcr]}
            onPageSelected={this.onPageSelected}
            autoPlayEnable={this.state.shouldAutoPlay}
            autoPlayInterval={3000}
          >
            <View style={[st.bgTransparent]}>
              <PageImage
                stopAutoPlay={this.stopAutoPlay}
                image={ONBOARD_2}
                text={t('joinAdventure')}
              />
            </View>
            <View style={[st.bgTransparent]}>
              <PageImage
                stopAutoPlay={this.stopAutoPlay}
                image={ONBOARD_1}
                text={t('grow')}
              />
            </View>
            <View style={[st.bgTransparent]}>
              <PageImage
                stopAutoPlay={this.stopAutoPlay}
                image={ONBOARD_3}
                text={t('bringOthers')}
              />
            </View>
          </IndicatorViewPager>
        </Flex>
        <Triangle
          width={st.fullWidth}
          height={IS_SMALL_ANDROID ? 90 : 120}
          color={st.colors.darkBlue}
          style={[st.abs, { bottom: this.state.bottomHeight || 200 }]}
        />
        <Flex
          style={[st.absb, st.fw100]}
          onLayout={e =>
            this.setState({ bottomHeight: e.nativeEvent.layout.height })
          }
        >
          <Flex value={1} style={[st.bgDarkBlue]}>
            <Flex style={[st.f1, st.jce, st.m5, st.p6, st.mh6]}>
              <Flex align="center" justify="center">
                <Button
                  isAndroidOpacity={true}
                  text={t('start')}
                  style={[styles.actionButton, st.mb4]}
                  buttonTextStyle={[st.fs3]}
                  onPress={this.tryItNow}
                />
                <PrivacyToS style={[st.fs5, st.ph1]} />
              </Flex>
              <Flex
                direction="row"
                align="center"
                justify="center"
                style={[st.mt6, st.pt5, st.mb4]}
              >
                <Text style={styles.signIn}>{t('haveAccount')}</Text>
                <Button
                  text={t('signIn')}
                  style={styles.signInButton}
                  buttonTextStyle={styles.signInText}
                  onPress={() => this.nav('voke.LoginInput')}
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
