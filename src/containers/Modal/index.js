import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme.js';
import { Flex, Text, Button } from '../../components/common';

class Modal extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overFullScreen',
  };

  constructor(props) {
    super(props);
    this.state = {
      isMore: false,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Contact Permission Modal');
  }

  handleDismiss() {
    this.props.onDismiss();
    Navigation.dismissModal();
  }

  handleSelect() {
    this.props.getContacts();
    Navigation.dismissModal();
  }

  handleMore() {
    this.setState({ isMore: true });
  }

  render() {
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="center" justify="center" style={styles.modal}>
          {
            this.state.isMore ? (
              <Flex align="center">
                <Text style={styles.title}>Voke uses your contacts to help you in two ways</Text>
                <Text style={styles.showMoreDescription}>
                  1. To find friends to share with
                  {'\n'}
                  2. To show you which friends have Voke
                </Text>
              </Flex>
            ) : (
              <Flex align="center">
                <Text style={styles.title}>Voke helps you share with your friends!</Text>
                <Text style={styles.description}>Voke uses your contacts to make sharing quick and easy.</Text>
              </Flex>
            )
          }
          <Flex direction="row" align="center" justify="center">
            <Flex value={1} align="center" justify="center">
              <Button
                text={this.state.isMore ? 'Not Now' : 'Tell me more'}
                buttonTextStyle={styles.buttonText}
                style={styles.button}
                onPress={this.state.isMore ? this.handleDismiss : this.handleMore}
              />
            </Flex>
            <Flex value={1} align="center" justify="center">
              <Button
                text={this.state.isMore ? 'Let\'s do this!' : 'Got It!'}
                buttonTextStyle={styles.buttonText2}
                style={styles.button2}
                onPress={this.handleSelect}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

Modal.propTypes = {
  ...NavPropTypes,
  getContacts: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default connect(null, nav)(Modal);
