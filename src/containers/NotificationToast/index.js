import React, { Component } from 'react';
import { connect } from 'react-redux';

import { enablePushNotifications } from '../../actions/socket';

import { Text, Flex, Icon, Button } from '../../components/common';
import styles from './styles';

class NotificationToast extends Component {
  enable = () => {
    this.props.dispatch(enablePushNotifications());
  }
  render() {
    if (this.props.token) return null;
    return (
      <Flex direction="row" align="center" self="stretch" style={styles.wrap}>
        <Icon name="notifications-none" size={28} style={styles.icon} />
        <Text style={styles.text}>Notifications turned off.</Text>
        <Flex value={1}>
          <Button
            onPress={this.enable}
            text="Turn On"
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
  auth: auth,
});

export default connect(mapStateToProps)(NotificationToast);
