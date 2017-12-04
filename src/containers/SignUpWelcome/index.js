import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Analytics from '../../utils/analytics';
import PropTypes from 'prop-types';

import ONBOARD_1 from '../../../images/onboard1.png';
import ONBOARD_2 from '../../../images/onboard2.png';
import ONBOARD_3 from '../../../images/onboard3.png';
import ONBOARD_4 from '../../../images/onboard4.png';
import ONBOARD_5 from '../../../images/onboard5.png';
// import ONBOARD_BACKGROUND from '../../../images/onboardBackground.png';
// import { ONBOARD_FLAG } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import theme, { COLORS, DEFAULT } from '../../theme';

import { Flex, Text, Button, VokeIcon } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_ONBOARDING_STEPS = 5;

class SignUpWelcome extends Component {

  constructor(props) {
    super(props);

    this.state = { selectedPage: 0 };

    this.renderDotIndicator = this.renderDotIndicator.bind(this);
    this.onPageSelected = this.onPageSelected.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  onPageSelected(params) {
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
    // if (!this.props.onlyOnboarding) return null;
    // <Touchable onPress={() => this.props.navigateResetHome()} >
    // If your get to the last page, dont show the skip button
    if (this.state.selectedPage >= NUM_ONBOARDING_STEPS - 1) return null;
    return (
      <Button
        type="transparent"
        onPress={() => this.handleNextPage(this.state.selectedPage)}
        style={{position: 'absolute', bottom: 40, right: 30, padding: 10}}
      >
        <VokeIcon style={{transform: [{ scaleX: -1 }]}} name="back"></VokeIcon>
      </Button>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: theme.textColor}}>
        <StatusBar />
        <View style={{flex: 1}}>
          <IndicatorViewPager
            ref={(c)=> this.viewPager = c}
            style={{flex: 1, flexDirection: 'column-reverse'}}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_1} style={styles.onboardFull} />
                </Flex>
                <Flex align="center" style={{position: 'absolute', bottom: 40, left: 0, right: 0}}>
                  <Button
                    type="transparent"
                    text="Sign In"
                    onPress={() => this.props.navigatePush('voke.LoginInput')}
                    style={{padding: 10}}
                  />
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_2} style={styles.onboardFull} />
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_3} style={styles.onboardFull} />
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_4} style={styles.onboardFull} />
                </Flex>
              </Flex>
            </View>
            <View style={styles.onboardingPage}>
              <Flex value={1} direction="column" align="center" justify="center" >
                <Flex value={1} align="center" justify="center">
                  <Image resizeMode="cover" source={ONBOARD_5} style={styles.onboardFull} />
                </Flex>
              </Flex>
              <Flex direction="column" align="center" justify="center" style={{position: 'absolute', bottom: 40, left: 0, right: 0}}>
                <Button
                  text="Create Account"
                  buttonTextStyle={styles.signInButtonText}
                  style={[styles.signInButton, {backgroundColor: theme.accentColor, borderWidth: 0}]}
                  onPress={() => this.props.navigatePush('voke.Login')}
                />
                <Button
                  text="Sign In"
                  buttonTextStyle={styles.signInButtonText}
                  style={styles.signInButton}
                  onPress={() => this.props.navigatePush('voke.LoginInput')}
                />
              </Flex>
            </View>
          </IndicatorViewPager>
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
        {this.renderSkip()}
      </View>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
  onlyOnboarding: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(SignUpWelcome);
