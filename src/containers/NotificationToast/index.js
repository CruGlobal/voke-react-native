import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { enablePushNotifications } from '../../actions/socket';

import { Text, Flex, Icon, Button } from '../../components/common';
import styles from './styles';

class NotificationToast extends Component {
  enable = () => {
    this.props.dispatch(enablePushNotifications());
  };

  render() {
    const { t, pushPermission, style } = this.props;
    if (pushPermission === 'authorized') return null;
    return (
      <Flex
        direction="row"
        align="center"
        self="stretch"
        style={[styles.wrap, style]}
      >
        <Icon name="notifications-none" size={28} style={styles.icon} />
        <Text style={styles.text}>{t('off')}</Text>
        <Flex value={1}>
          <Button
            onPress={this.enable}
            text={t('turnOn')}
            style={styles.button}
            buttonTextStyle={styles.buttonText}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  token: auth.pushToken,
  pushPermission: auth.pushPermission,
  auth: auth,
});

export default translate('notifications')(
  connect(mapStateToProps)(NotificationToast),
);
