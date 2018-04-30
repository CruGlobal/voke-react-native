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
import ONBOARD_LOGO from '../../../images/onboardingLogo.png';
import ONBOARD_BUTTON from '../../../images/onboardingButton.png';
// import { ONBOARD_FLAG } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import theme, { COLORS } from '../../theme';

import { Flex, Text, Button, VokeIcon } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const MARGIN = 40;

class SignUpWelcome extends Component {

  state = { selectedPage: 0, totalSteps: 3 };

  componentDidMount() {
    Analytics.screen('Welcome Onboarding');
    Orientation.lockToPortrait();
    if (this.props.noSignIn) {
      this.setState({ totalSteps: 4 });
    }
  }

  onPageSelected = (params) => {
    this.setState({ selectedPage: params.position });
  }

  handleNextPage(i) {
    if (i + 1 === this.state.totalSteps && !this.props.noSignIn) {
      this.signUp();
    } else {
      this.viewPager.setPage(i+1);
    }
  }

  signUp = () => {
    this.props.navigatePush('voke.SignInOrTryItNow');
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        style={{marginBottom: 45, width: 100, marginHorizontal: theme.fullWidth / 2 - 50}}
        dotStyle={{backgroundColor: COLORS.TRANSPARENT, borderColor: theme.white, borderWidth: 1, marginHorizontal: 5, height: 12, width: 12, borderRadius: 12}}
        selectedDotStyle={{backgroundColor: COLORS.WHITE, marginHorizontal: 5, height: 12, width: 12, borderRadius: 12}}
        pageCount={3}
      />
    );
  }

  renderSkip() {
    // If your get to the last page, dont show the skip button
    if (this.state.selectedPage >= this.state.totalSteps) return null;
    return (
      <Button
        type="transparent"
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPress={() => this.handleNextPage(this.state.selectedPage)}
        style={styles.skipButton}
      >
        <Image resizeMode="contain" source={ONBOARD_BUTTON} style={styles.onboardButton} />
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
            indicator={noSignIn || this.state.selectedPage === 3 ? undefined : this.renderDotIndicator()}
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
            {
              noSignIn ? (
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
                  <Flex direction="column" align="center" justify="center" style={{ position: 'absolute', bottom: MARGIN, left: 0, right: 0 }}>
                    <Button
                      text="Done"
                      buttonTextStyle={styles.signInButtonText}
                      style={[styles.signInButton, { backgroundColor: theme.accentColor, borderWidth: 0 }]}
                      onPress={() => this.props.navigateBack()}
                    />
                  </Flex>
                </View>
              ) : null
            }
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
