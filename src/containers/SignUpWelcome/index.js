import React, { Component } from 'react';
import { connect } from 'react-redux';


import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

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
  }

  handleNext() {
    this.props.navigateResetHome();
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex direction="column" align="center" justify="center" style={styles.headerWrap}>
          <Text style={styles.headerTitle}>WELCOME</Text>
          <Text style={styles.headerText}>Welcome to VOKE. Put the swipeable view pager in here.</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.inputs}>
          <Button
            text="Done"
            buttonTextStyle={styles.signInButton}
            style={styles.actionButton}
            onPress={this.handleNext}
          />
        </Flex>
      </Flex>
    );
  }
}

SignUpWelcome.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpWelcome);
