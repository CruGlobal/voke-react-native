
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

import { Flex, Text } from '../common';

class ContactItem extends Component { // eslint-disable-line

  render() {
    const { item } = this.props;

    return (
      <Flex direction="row" align="center" style={styles.row}>
        <Flex style={styles.avatar}></Flex>
        <Text style={styles.name}>{item.name}</Text>
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
