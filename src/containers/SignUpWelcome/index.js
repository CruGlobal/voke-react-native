import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Analytics from '../../utils/analytics';
import PropTypes from 'prop-types';

import ONBOARD_1 from '../../../images/onboardingWatch.png';
import ONBOARD_NEW from '../../../images/onboardingOne.png';
import ONBOARD_2 from '../../../images/onboardingShare.png';
import ONBOARD_3 from '../../../images/onboardingChat.png';
import VOKE_BOT from '../../../images/onboardingVoke.png';
import ONBOARD_BACKGROUND from '../../../images/onboardBackground.png';
import { ONBOARD_FLAG } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS, DEFAULT } from '../../theme';

import { Flex, Text, Button, Touchable } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_ONBOARDING_STEPS = 5;

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
    // if (params.position > 0) {
    //   this.props.dispatch({type: ONBOARD_FLAG, completed: true});
    // }
  }

  componentDidMount() {
    Analytics.screen('Welcome Onboarding');
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{marginBottom: 30}}
        dotStyle={{backgroundColor: COLORS.WHITE_FADE, marginHorizontal: 5}}
        selectedDotStyle={{backgroundColor: theme.textColor, marginHorizontal: 5}}
        pageCount={5}
      />
    );
  }

  renderSkip() {
    if (!this.props.onlyOnboarding) return null;
    // If your get to the last page, dont show the skip button
    if (this.state.selectedPage >= NUM_ONBOARDING_STEPS - 1) return null;
    return (
      <Touchable onPress={() => this.props.navigateResetHome()} >
        <View style={{position: 'absolute', bottom: 30, right: 30, backgroundColor: theme.transparent, padding: 20}} >
          <Text style={{color: theme.primaryColor, backgroundColor: 'rgba(0,0,0,0)'}}>Skip</Text>
        </View>
      </Touchable>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: theme.textColor}}>
        <StatusBar />
        <View style={{flex: 1}}>
          <IndicatorViewPager
            style={{flex: 1, flexDirection: 'column-reverse'}}
            indicator={this.renderDotIndicator()}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_NEW} style={styles.onboardHalf} />
                </Flex>
                <Flex direction="column" self="stretch" value={1} align="center" justify="start" style={{backgroundColor: theme.primaryColor}}>
                  <Flex value={1}>
                    <Text style={styles.headerTitle}>FIND AND SHARE HOPE</Text>
                  </Flex>
                  <Flex value={2} align="center" justify="center">
                    <Button
                      text="Sign In"
                      buttonTextStyle={styles.signInButtonText}
                      style={styles.signInButton}
                      onPress={() => this.props.navigatePush('voke.LoginInput')}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_NEW} style={styles.onboardHalf} />
                </Flex>
                <Flex self="stretch" value={1} align="center" justify="start" style={{backgroundColor: COLORS.PINK}}>
                  <Text style={styles.headerTitle}>SHARE VIDEOS THAT ARE WORTH SHARING</Text>
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_NEW} style={styles.onboardHalf} />
                </Flex>
                <Flex self="stretch" value={1} align="center" justify="start" style={{backgroundColor: theme.accentColor}}>
                  <Text style={styles.headerTitle}>DISCOVER WHAT YOUR FRIENDS THINK</Text>
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_NEW} style={styles.onboardHalf} />
                </Flex>
                <Flex self="stretch" value={1} align="center" justify="start" style={{backgroundColor: COLORS.OLIVE}}>
                  <Text style={styles.headerTitle}>EXPERIENCE DEEPER FRIENDSHIPS</Text>
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center" style={{backgroundColor: theme.primaryColor}}>
                  <Flex self="stretch" justify="start" align="end" style={styles.onboardHalf}>
                    <Image resizeMode="contain" source={VOKE_BOT} style={styles.vokeBot} />
                  </Flex>
                </Flex>
                <Flex direction="column" self="stretch" value={1} align="center" justify="start" style={{backgroundColor: theme.primaryColor}}>
                  <Flex value={1}>
                    <Text style={styles.headerTitle}>MEET VOKEBOT</Text>
                    <Text style={styles.headerText}>He will help you along the way.</Text>
                  </Flex>
                  <Flex value={2} align="center" justify="center">
                    <Button
                      text="Got It!"
                      buttonTextStyle={styles.signInButtonText}
                      style={styles.signInButton}
                      onPress={() => this.props.navigatePush('voke.Login')}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </View>
          </IndicatorViewPager>
          {this.renderSkip()}
          {
            // <Flex direction="row" align="center" justify="center" style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
            //   <Flex value={1} style={styles.actionButton}>
            //     <Button
            //       text="Create Account"
            //       buttonTextStyle={styles.loginButtonText}
            //       style={styles.loginButton}
            //       onPress={() => this.props.navigatePush('voke.Login')}
            //       />
            //   </Flex>
            //   <Flex value={1} style={styles.actionButton}>
            //     <Button
            //       text="Sign In"
            //       buttonTextStyle={styles.loginButtonText}
            //       style={styles.loginButton2}
            //       onPress={() => this.props.navigatePush('voke.LoginInput')}
            //       />
            //   </Flex>
            // </Flex>
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
