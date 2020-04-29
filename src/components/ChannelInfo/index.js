import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { Image, Flex, Text, Button } from '../common';

class ChannelInfo extends Component {
  handleButtonPress = () => {
    if ((this.props.subscribeData || {}).isSubscribed) {
      this.props.onUnsubscribe();
    } else {
      this.props.onSubscribe();
    }
  };

  render() {
    const { t, channel, subscribeData } = this.props;
    const newSubscribeData = subscribeData || {};
    const isSubscribed = newSubscribeData.isSubscribed;
    const avatar = ((channel || {}).avatar || {}).large || undefined;
    return (
      <Flex direction="row" style={styles.channel}>
        <Flex direction="column" value={1} style={styles.infoWrap}>
          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.subscribers}>
            {newSubscribeData
              ? t('subscribers', { total: newSubscribeData.total })
              : '-'}
          </Text>
          <Flex value={1} justify="end">
            {newSubscribeData ? (
              <Button
                onPress={this.handleButtonPress}
                text={isSubscribed ? t('unsubscribe') : t('subscribe')}
                style={styles.button}
                buttonTextStyle={styles.buttonText}
              />
            ) : null}
          </Flex>
        </Flex>
        <Image
          resizeMode="contain"
          source={{ uri: avatar }}
          style={styles.image}
        />
      </Flex>
    );
  }
}

ChannelInfo.propTypes = {
  channel: PropTypes.object.isRequired,
  subscribeData: PropTypes.shape({
    id: PropTypes.string,
    isSubscribed: PropTypes.bool,
    total: PropTypes.num,
  }).isRequired,
  onSubscribe: PropTypes.func.isRequired,
  onUnsubscribe: PropTypes.func.isRequired,
};

export default translate('channelInfo')(ChannelInfo);