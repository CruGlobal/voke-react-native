import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme.js';
import { Flex, Text, Button } from '../../components/common';

class AndroidReportModal extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overFullScreen',
  };

  constructor(props) {
    super(props);

    this.state= {
      text: '',
    };

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentWillMount() {
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
          <Flex align="center">
            <Text style={styles.title}>Please describe why you are reporting this person</Text>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.text}
              onChangeText={(text) => this.setState({ text: text })}
              multiline={false}
              placeholder="Reason"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={true}
              autoCapitalize="none"
            />
          </Flex>
          <Flex direction="row" align="center" justify="center">
            <Flex value={2} align="end" justify="center">
              <Button
                text="CANCEL"
                buttonTextStyle={styles.buttonText}
                type="transparent"
                style={{padding: 5}}
                onPress={()=> {
                  this.props.onCancelReport();
                  Navigation.dismissModal();
                }}
              />
            </Flex>
            <Flex value={1} align="end" justify="center">
              <Button
                text="SUBMIT"
                style={{padding: 7}}
                type="transparent"
                buttonTextStyle={styles.buttonText}
                onPress={()=> {
                  this.props.onSubmitReport(this.state.text);
                  Navigation.dismissModal();
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

AndroidReportModal.propTypes = {
  ...NavPropTypes,
  onSubmitReport: PropTypes.func.isRequired,
  onCancelReport: PropTypes.func.isRequired,
};

export default connect(null, nav)(AndroidReportModal);
