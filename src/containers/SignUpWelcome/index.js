import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';


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

    this.handleNext = this.handleNext.bind(this);
    this.renderDotIndicator = this.renderDotIndicator.bind(this);
  }

  handleNext() {
    this.props.navigateResetHome();
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
          >
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Discover, watch, and share compelling videos</Text>
              <Flex value={1} align="end" justify="end">
                <Button
                  text="Skip"
                  type="transparent"
                  buttonTextStyle={styles.skipButtonText}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Chat with your friens when they start watching.</Text>
              <Flex value={1} align="end" justify="end">
                <Button
                  text="Skip"
                  type="transparent"
                  buttonTextStyle={styles.skipButtonText}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Your friends don't need Voke to watch or chat.</Text>
              <Flex value={1} align="end" justify="end">
                <Button
                  text="Skip"
                  type="transparent"
                  buttonTextStyle={styles.skipButtonText}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Text style={styles.headerText}>Meet Vokebot! He will help you along the way.</Text>
              <Flex value={1} align="center" justify="end">
                <Button
                  text="Okay, Got it"
                  buttonTextStyle={styles.skipButtonText}
                  style={styles.endButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </View>
          </IndicatorViewPager>
        </View>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpWelcome);
