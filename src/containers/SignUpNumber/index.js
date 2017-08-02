import React, { Component } from 'react';
import { connect } from 'react-redux';


import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: iconsMap['ios-arrow-back'], // For iOS only
    }],
  };
}

class SignUpNumber extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  };


  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleNext = this.handleNext.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  handleNext() {
    // this.props.navigateResetHome();
    this.props.navigatePush('voke.SignUpNumberVerify');
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex direction="column" align="center" justify="center" style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Mobile Number</Text>
          <Text style={styles.headerText}>Add your mobile number to invite your friends to a Voke chat via text message</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.inputs}>
          <Text>Drop down</Text>
          <Text>Phone Number box</Text>
          <Button
            text="Next"
            buttonTextStyle={styles.signInButton}
            style={styles.actionButton}
            onPress={this.handleNext}
          />
        </Flex>
      </Flex>
    );
  }
}

SignUpNumber.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpNumber);
