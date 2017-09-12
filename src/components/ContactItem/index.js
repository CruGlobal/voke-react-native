
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

import { Flex, Text, Avatar } from '../common';

class ContactItem extends Component { // eslint-disable-line

  render() {
    const { item } = this.props;
    // Get the url for the voke image if it is a voke contact
    const vokeImage = item.isVoke && item.vokeDetails && item.vokeDetails.avatar && item.vokeDetails.avatar ? item.vokeDetails.avatar.medium : null;

    return (
      <Flex direction="row" align="center" style={styles.row}>
        {
          vokeImage ? (
            <Avatar
              size={26}
              style={styles.avatar}
              image={vokeImage}
            />
          ) : <Flex style={styles.avatar} />
        }
        <Text style={styles.name}>{item.name}</Text>
        {
          item.isVoke ? (
            <Text style={styles.voke}>VOKE</Text>
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
};

export default ContactItem;
