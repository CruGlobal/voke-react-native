import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './styles';
import theme from '../../theme';
import { Flex, Text, Button } from '../../components/common';

class AndroidReportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  dismiss() {
    this.props.onClose();
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
    const { t } = this.props;
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={styles.modal}
        >
          <Flex align="center">
            <Text style={styles.title}>{t('title')}</Text>
            <TextInput
              value={this.state.text}
              onChangeText={text => this.setState({ text: text })}
              multiline={false}
              placeholder={t('placeholder.reason')}
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={true}
              autoCapitalize="none"
            />
          </Flex>
          <Flex direction="row" align="center" justify="center">
            <Flex value={2} align="end" justify="center">
              <Button
                text={t('cancel').toUpperCase()}
                buttonTextStyle={styles.buttonText}
                type="transparent"
                style={{ padding: 5 }}
                onPress={this.handleCancel}
              />
            </Flex>
            <Flex value={1} align="end" justify="center">
              <Button
                text={t('submit').toUpperCase()}
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
  onSubmitReport: PropTypes.func.isRequired,
  onCancelReport: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default translate('reportModal')(AndroidReportModal);
