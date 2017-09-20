
import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import VOKE_ICON from '../../../images/voke_icon_chat.png';
import { Flex, Text, Avatar, Button } from '../common';
import { getInitials } from '../../utils/common';

class ContactItem extends Component { // eslint-disable-line

  render() {
    const { item, isInvite } = this.props;

    // Get the url for the voke image if it is a voke contact
    const isVokeFromInvite = item.isVoke && isInvite;
    const vokeImage = item.isVoke && item.vokeDetails && item.vokeDetails.avatar && item.vokeDetails.avatar ? item.vokeDetails.avatar.medium : null;
    return (
      <Flex direction="row" align="center" style={isVokeFromInvite ? [styles.row, styles.disabled] : styles.row}>
        {
          vokeImage ? (
            <Avatar
              size={26}
              style={styles.avatar}
              image={vokeImage}
            />
          ) : (
            <Avatar
              size={26}
              style={styles.avatar}
              text={getInitials(item.initials)}
            />
          )
        }
        <Text style={styles.name}>{item.name}</Text>
        {
          item.isVoke ? (
            <Image source={VOKE_ICON} style={styles.voke} />
          ) : null
        }
        {
          !item.isVoke && this.props.isInvite ? (
            <Button
              onPress={this.props.onButtonPress}
              text="Invite"
              style={styles.inviteButton}
              buttonTextStyle={styles.inviteButtonText}
            />
          ) : null
        }
      </Flex>
    );
  }
}

ContactItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.array,
  }).isRequired,
  isInvite: PropTypes.bool,
  onButtonPress: PropTypes.func,
};

export default ContactItem;
