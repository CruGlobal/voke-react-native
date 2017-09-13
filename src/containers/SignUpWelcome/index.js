import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Analytics from '../../utils/analytics';

import ONBOARD_1 from '../../../images/intro_tutorial_videos.png';
import ONBOARD_2 from '../../../images/intro_tutorial_home.png';
import ONBOARD_3 from '../../../images/intro_tutorial_chat.png';
import VOKE_BOT from '../../../images/voke_bot_welcome.png';
import ONBOARD_BACKGROUND from '../../../images/onboardBackground.png';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, {DEFAULT, COLORS} from '../../theme';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

class SignUpWelcome extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    // navBarButtonColor: theme.lightText,
    // navBarTextColor: theme.headerTextColor,
    // navBarBackgroundColor: theme.primaryColor,
    // navBarNoBorder: true,
    // navBarHidden: true,
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
  }

  componentDidMount() {
    Analytics.screen('Welcome Onboarding');
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{paddingBottom: 55}}
        dotStyle={{backgroundColor: COLORS.WHITE_FADE, marginHorizontal: 5}}
        selectedDotStyle={{backgroundColor: theme.textColor, marginHorizontal: 5}}
        pageCount={4}
      />
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
              <Flex value={1} style={styles.imageWrapper} align="center" justify="start">
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
              <Flex value={1} align="center" justify="start">
                <Text style={styles.headerTitle}> </Text>
                <Flex value={.4}>
                  <Text style={styles.headerText}>Meet Vokebot! He will help you along the way.</Text>
                </Flex>
                <Flex value={1} justify="start" align="end" style={styles.vokeWrap}>
                  <Image source={VOKE_BOT} style={styles.vokeBot} />
                </Flex>
              </Flex>
            </View>
          </IndicatorViewPager>
          <Flex direction="row" align="center" justify="center" style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
            <Flex value={1} style={styles.actionButton}>
              <Button
                text="Create Account"
                buttonTextStyle={styles.loginButtonText}
                style={styles.loginButton}
                onPress={()=> this.props.navigatePush('voke.Login')}
              />
            </Flex>
            <Flex value={1} style={styles.actionButton}>
              <Button
                text="Sign In"
                buttonTextStyle={styles.loginButtonText}
                style={styles.loginButton2}
                onPress={()=> this.props.navigatePush('voke.LoginInput')}
              />
            </Flex>
          </Flex>
        </View>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpWelcome);
