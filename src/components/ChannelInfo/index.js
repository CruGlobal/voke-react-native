import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, Button } from '../common';

class ChannelInfo extends Component {
  constructor(props) {
    super(props);

    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    if (this.props.subscribeData.isSubscribed) {
      this.props.onUnsubscribe();
    } else {
      this.props.onSubscribe();
    }
  }

  render() {
    const { channel, subscribeData } = this.props;
    const isSubscribed = subscribeData.isSubscribed;
    const avatar =
      channel.avatar && channel.avatar.large ? channel.avatar.large : undefined;
    return (
      <Flex direction="row" style={styles.channel}>
        <Flex direction="column" value={1} style={styles.infoWrap}>
          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.subscribers}>
            {subscribeData ? `${subscribeData.total} subscribers` : '-'}
          </Text>
          <Flex value={1} justify="end">
            {subscribeData ? (
              <Button
                onPress={this.handleButtonPress}
                text={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
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

export default translate()(ChannelInfo);
