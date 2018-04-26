import React, { Component } from 'react';
import { Slider } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../../theme';
import { Touchable, Flex, Icon, VokeIcon, Text } from '../common';
import styles from './styles';

export default class SelectNumber extends Component {

  render() {
    const { contact } = this.props;
    const numbers = contact.phone;
    const labels = contact.numberLabels;
    let name = contact.name ? contact.name.split(' ') : null;
    let firstName = name[0] ? name[0] : 'Friend';

    let newArray = labels.map((l, index) => {
      return {
        label: l,
        number: numbers[index],
      };
    });
    return (
      <Flex align="center" justify="center" style={styles.selectNumModal}>
        <Flex style={styles.modal}>
          <Text style={styles.nameText}>Which number do you want to use for {firstName}?</Text>
          {
            newArray.map((n, index) => (
              <Touchable key={n.number} onPress={() => this.props.onSelect(contact, index)}>
                <Flex direction="row" style={styles.rowWrap}>
                  <Text style={styles.label}>{n.label}:</Text>
                  <Text style={styles.number}>{n.number}</Text>
                </Flex>
              </Touchable>
            ))
          }
        </Flex>
      </Flex>
    );
  }
}

SelectNumber.propTypes = {
  contact: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
