import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Analytics from '../../utils/analytics';
import PropTypes from 'prop-types';

import ONBOARD_1 from '../../../images/intro_tutorial_videos.png';
import ONBOARD_2 from '../../../images/intro_tutorial_home.png';
import ONBOARD_3 from '../../../images/intro_tutorial_chat.png';
import VOKE_BOT from '../../../images/voke_bot_welcome.png';
import ONBOARD_BACKGROUND from '../../../images/onboardBackground.png';
import { ONBOARD_FLAG } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS, DEFAULT } from '../../theme';

import { Flex, Text, Button, Touchable } from '../../components/common';
import StatusBar from '../../components/StatusBar';

class SignUpWelcome extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: theme.primaryColor,
    disabledBackGesture: true,
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarTransparent: true,
  };

  constructor(props) {
    super(props);

    this.state = { selectedPage: 0 };

    this.renderDotIndicator = this.renderDotIndicator.bind(this);
    this.onPageSelected = this.onPageSelected.bind(this);
  }

  onPageSelected(params) {
    this.setState({ selectedPage: params.position });
    if (params.position > 0) {
      this.props.dispatch({type: ONBOARD_FLAG, completed: true});
    }
  }

  componentDidMount() {
    Analytics.screen('Welcome Onboarding');
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{marginBottom: 55}}
        dotStyle={{backgroundColor: COLORS.WHITE_FADE, marginHorizontal: 5}}
        selectedDotStyle={{backgroundColor: theme.textColor, marginHorizontal: 5}}
        pageCount={4}
      />
    );
  }

  renderSkip() {
    if (!this.props.onlyOnboarding) return null;
    if (this.state.selectedPage === 3) return null;
    return (
      <Touchable onPress={() => this.props.navigateResetHome()} style={{position: 'absolute', bottom: 30, right: 30, backgroundColor: theme.transparent, padding: 20}} >
        <Text style={{color: theme.textColor, backgroundColor: 'rgba(0,0,0,0)'}}>Skip</Text>
      </Touchable>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: theme.transparent}}>
        <View style={styles.backgroundWrap}>
          <Image source={ONBOARD_BACKGROUND} style={{backgroundColor: theme.transparent}} />
        </View>
        <StatusBar />
        <View style={{flex: 1}}>
          <IndicatorViewPager
            style={{flex: 1, flexDirection: 'column-reverse'}}
            indicator={this.renderDotIndicator()}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Text style={styles.headerTitle}>Watch</Text>
              <Text style={styles.headerText}>Discover, watch, and share compelling videos.</Text>
              <Flex align="center" justify="center">
                <Image resizeMode="contain" source={ONBOARD_1} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerTitle}>Share</Text>
              <Text style={styles.headerText}>Your friends don't need Voke to watch or chat.</Text>
              <Flex style={styles.imageWrapper} align="center" justify="start">
                <Image resizeMode="contain" source={ONBOARD_3} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerTitle}>Chat</Text>
              <Text style={styles.headerText}>Chat with your friends when they start watching.</Text>
              <Flex align="center" justify="center">
                <Image resizeMode="contain" source={ONBOARD_2} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerTitle}> </Text>
              <Text style={styles.headerText}>Meet Vokebot! He will help you along the way.</Text>
              <Flex self="stretch" justify="start" align="end" style={styles.vokeWrap}>
                <Image source={VOKE_BOT} style={styles.vokeBot} />
              </Flex>
              {
                this.props.onlyOnboarding ? (
                  <Flex value={1} align="end" justify="end">
                    <Button
                      text="Got It!"
                      buttonTextStyle={styles.loginButtonText}
                      style={[styles.loginButton2, { width: DEFAULT.FULL_WIDTH, zIndex: 500}]}
                      onPress={() => this.props.navigateResetHome()}
                    />
                  </Flex>
                ) : null
              }
            </View>
          </IndicatorViewPager>
          {this.renderSkip()}
          {
            this.props.onlyOnboarding ? null : (
              <Flex direction="row" align="center" justify="center" style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
                <Flex value={1} style={styles.actionButton}>
                  <Button
                    text="Create Account"
                    buttonTextStyle={styles.loginButtonText}
                    style={styles.loginButton}
                    onPress={() => this.props.navigatePush('voke.Login')}
                  />
                </Flex>
                <Flex value={1} style={styles.actionButton}>
                  <Button
                    text="Sign In"
                    buttonTextStyle={styles.loginButtonText}
                    style={styles.loginButton2}
                    onPress={() => this.props.navigatePush('voke.LoginInput')}
                  />
                </Flex>
              </Flex>
            )
          }
        </View>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
  onlyOnboarding: PropTypes.bool,
};

export default connect(null, nav)(SignUpWelcome);
