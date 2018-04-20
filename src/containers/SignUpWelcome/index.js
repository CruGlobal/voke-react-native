import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Analytics from '../../utils/analytics';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';

import ONBOARD_1 from '../../../images/onboarding-image-1.png';
import ONBOARD_2 from '../../../images/onboarding-image-2.png';
import ONBOARD_3 from '../../../images/onboarding-image-3.png';
import ONBOARD_4 from '../../../images/onboarding-image-4.png';
import ONBOARD_5 from '../../../images/onboard5.png';
import ONBOARD_LOGO from '../../../images/onboardingLogo.png';
// import { ONBOARD_FLAG } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import theme, { COLORS } from '../../theme';

import { Flex, Text, Button, VokeIcon } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_ONBOARDING_STEPS = 5;

const MARGIN = 40;

class SignUpWelcome extends Component {

  state = { selectedPage: 0 };

  onPageSelected = (params) => {
    this.setState({ selectedPage: params.position });
    // if (params.position > 0) {
    //   this.props.dispatch({type: ONBOARD_FLAG, completed: true});
    // }
  }

  handleNextPage(i) {
    this.viewPager.setPage(i+1);
  }

  componentDidMount() {
    Analytics.screen('Welcome Onboarding');
    Orientation.lockToPortrait();
  }

  signUp = () => {
    this.props.navigatePush('voke.SignInOrTryItNow');
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
    // If your get to the last page, dont show the skip button
    if (this.state.selectedPage >= NUM_ONBOARDING_STEPS - 1) return null;
    return (
      <Button
        type="transparent"
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPress={() => this.handleNextPage(this.state.selectedPage)}
        style={styles.skipButton}
      >
        <VokeIcon style={{transform: [{ scaleX: -1 }]}} name="back"></VokeIcon>
      </Button>
    );
  }

  render() {
    const { noSignIn } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: theme.primaryColor}}>
        <StatusBar />
        <View style={{flex: 1}}>
          <IndicatorViewPager
            indicator={noSignIn ? undefined : this.renderDotIndicator()}
            ref={(c)=> this.viewPager = c}
            style={{flex: 1, flexDirection: 'column-reverse'}}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_1} style={styles.onboardFull} />
                </Flex>
              </Flex>
              <Flex direction="column" align="center" style={{position: 'absolute', top: 66, left: 0, right: 0}}>
                <Image source={ONBOARD_LOGO} />
              </Flex>
              <Flex style={{position: 'absolute', bottom: MARGIN, right: MARGIN }}>
                {this.renderSkip()}
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_2} style={styles.onboardFull} />
                </Flex>
              </Flex>
              <Flex direction="column" align="end" style={{position: 'absolute', top: MARGIN, right: MARGIN, width: 150 }}>
                <VokeIcon style={{width: 36, height: 36}} name="onboard-film"></VokeIcon>
                <Text style={{fontSize: 36, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0)', textAlign: 'right'}}>Share Videos Worth Sharing</Text>
              </Flex>
              <Flex style={{position: 'absolute', bottom: MARGIN, right: MARGIN }}>
                {this.renderSkip()}
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_3} style={styles.onboardFull} />
                </Flex>
              </Flex>
              <Flex direction="column" align="end" style={{position: 'absolute', top: MARGIN, right: MARGIN, width: 250 }}>
                <VokeIcon style={{width: 36, height: 36}} name="onboard-chat"></VokeIcon>
                <Text style={{fontSize: 36, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0)', textAlign: 'right'}}>Inspire {'\n'} Deeper {'\n'} Conversations</Text>
              </Flex>
              <Flex style={{position: 'absolute', bottom: MARGIN, right: MARGIN }}>
                {this.renderSkip()}
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_4} style={styles.onboardFull} />
                </Flex>
              </Flex>
              <Flex direction="column" align="end" style={{position: 'absolute', top: MARGIN, right: MARGIN, width: 250 }}>
                <VokeIcon style={{width: 36, height: 36}} name="onboard-heart"></VokeIcon>
                <Text style={{fontSize: 36, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0)', textAlign: 'right'}}>Experience Deeper Friendships</Text>
              </Flex>
              <Flex style={{position: 'absolute', bottom: MARGIN, right: MARGIN }}>
                {this.renderSkip()}
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_5} style={styles.onboardFull} />
                </Flex>
              </Flex>
              {
                noSignIn ? (
                  <Flex direction="column" align="center" justify="center" style={{ position: 'absolute', bottom: MARGIN, left: 0, right: 0 }}>
                    <Button
                      text="Done"
                      buttonTextStyle={styles.signInButtonText}
                      style={[styles.signInButton, { backgroundColor: theme.accentColor, borderWidth: 0 }]}
                      onPress={() => this.props.navigateBack()}
                    />
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" justify="center" style={{position: 'absolute', bottom: MARGIN, left: 0, right: 0}}>
                    <Button
                      text="Continue"
                      buttonTextStyle={styles.signInButtonText}
                      style={styles.signInButton}
                      onPress={this.signUp}
                    />
                  </Flex>
                )
              }
            </View>
          </IndicatorViewPager>
        </View>
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
  noSignIn: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(SignUpWelcome);
