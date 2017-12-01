import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';

import Analytics from '../../utils/analytics';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import theme from '../../theme.js';
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

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Android: Report User');
  }

  dismiss() {
    // Navigation.dismissModal({ animationType: 'none' });
    this.props.navigateBack();
  }

  handleCancel() {
    this.props.onCancelReport();
    this.dismiss();
  }
  
  handleSubmit() {
    this.props.onSubmitReport(this.state.text);
    this.dismiss();
  }

  render() {
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="center" justify="center" style={styles.modal}>
          <Flex align="center">
            <Text style={styles.title}>Please describe why you are reporting this person</Text>
            <TextInput
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
                style={{ padding: 5 }}
                onPress={this.handleCancel}
              />
            </Flex>
            <Flex value={1} align="end" justify="center">
              <Button
                text="SUBMIT"
                style={{ padding: 7 }}
                type="transparent"
                buttonTextStyle={styles.buttonText}
                onPress={this.handleSubmit}
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
