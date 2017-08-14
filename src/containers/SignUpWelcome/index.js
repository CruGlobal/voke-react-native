import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

import ONBOARD_1 from '../../../images/intro_tutorial_videos.png';
import ONBOARD_2 from '../../../images/intro_tutorial_home.png';
import ONBOARD_3 from '../../../images/intro_tutorial_chat.png';
import VOKE_BOT from '../../../images/voke_bot_welcome.png';

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
    navBarHidden: true,
    disabledBackGesture: true,
  };


  constructor(props) {
    super(props);

    this.state = { selectedPage: 0 };

    this.handleNext = this.handleNext.bind(this);
    this.renderDotIndicator = this.renderDotIndicator.bind(this);
    this.onPageSelected = this.onPageSelected.bind(this);
  }

  handleNext() {
    this.props.navigateResetHome();
  }

  onPageSelected(params) {
    this.setState({ selectedPage: params.position });
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{paddingBottom: 50}}
        dotStyle={{backgroundColor: COLORS.WHITE_FADE, marginHorizontal: 5}}
        selectedDotStyle={{backgroundColor: theme.textColor, marginHorizontal: 5}}
        pageCount={4}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar />
        <View style={{flex: 1}}>
          <IndicatorViewPager
            style={{height: DEFAULT.FULL_HEIGHT, paddingVertical: 50}}
            indicator={this.renderDotIndicator()}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Discover, watch, and share compelling videos</Text>
              <Flex align="center" justify="center">
                <Image resizeMode="contain" source={ONBOARD_1} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Chat with your friens when they start watching.</Text>
              <Flex align="center" justify="center">
                <Image resizeMode="contain" source={ONBOARD_2} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Your friends don't need Voke to watch or chat.</Text>
              <Flex value={1} style={styles.imageWrapper} align="center" justify="start">
                <Image resizeMode="contain" source={ONBOARD_3} style={styles.onboardImage} />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} align="center" justify="start">
                <Flex value={.4}>
                  <Text style={styles.headerText}>Meet Vokebot! He will help you along the way.</Text>
                </Flex>
                <Flex value={1} justify="start" align="end" style={styles.vokeWrap}>
                  <Image source={VOKE_BOT} style={styles.vokeBot} />
                </Flex>
              </Flex>
              <Flex value={.3} align="center" justify="end">
                <Button
                  text="Okay, Got it"
                  buttonTextStyle={styles.skipButtonText}
                  style={styles.endButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </View>
          </IndicatorViewPager>
          {
            this.state.selectedPage === 3 ? null : (
              <Button
                text="Skip"
                type="transparent"
                buttonTextStyle={styles.skipButtonText}
                style={styles.skipButton}
                onPress={this.handleNext}
              />
            )
          }
        </View>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpWelcome);
