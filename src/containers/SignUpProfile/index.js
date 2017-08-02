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

class SignUpProfile extends Component {
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
    this.addProfile = this.addProfile.bind(this);
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
    this.props.navigator.setTitle({ title: 'Create Profile' });
  }

  addProfile() {
    this.props.navigatePush('voke.SignUpNumber');
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex direction="column" align="center" justify="center" style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Create Profile</Text>
          <Text style={styles.headerText}>You are moments away from impacting your friends.</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.inputs}>
          <Text>Input Box 1</Text>
          <Text>Input Box 2</Text>
          <Button
            text="Next"
            buttonTextStyle={styles.signInButton}
            style={styles.actionButton}
            onPress={this.addProfile}
          />
        </Flex>
      </Flex>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpProfile);
