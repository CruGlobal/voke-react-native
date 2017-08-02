import React, { Component } from 'react';
import { connect } from 'react-redux';


import styles from './styles';
import { createAccountAction } from '../../actions/auth';
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

class SignUpAccount extends Component {
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
    this.createAccount = this.createAccount.bind(this);
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

  createAccount() {
    this.props.dispatch(createAccountAction('email@address.co', 'password')).then(() => {
      this.props.navigatePush('voke.SignUpProfile');
    });
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <StatusBar />
        <Flex direction="column" align="center" justify="center" style={styles.headerWrap}>
          <Text style={styles.headerText}>Create Account</Text>
          <Text style={styles.headerText}>You are moments away from impacting your friends.</Text>
        </Flex>
        <Flex align="center" justify="center" style={styles.inputs}>
          <Text>Input Box 1</Text>
          <Text>Input Box 2</Text>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Create Free Account"
              buttonTextStyle={styles.signInButton}
              style={styles.actionButton}
              onPress={this.createAccount}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

SignUpAccount.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpAccount);
