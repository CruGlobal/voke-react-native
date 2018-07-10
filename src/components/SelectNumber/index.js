import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Touchable, Flex, Button, Text } from '../common';
import styles from './styles';

class SelectNumber extends Component {
  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { contact } = this.props;
    const numbers = contact.phone;
    const labels = contact.numberLabels;

    let newArray = labels.map((l, index) => {
      return {
        label: l,
        number: numbers[index],
      };
    });
    return (
      <Flex align="center" justify="end" style={styles.selectNumModal}>
        <Flex style={styles.modal}>
          {newArray.map((n, index) => (
            <Touchable
              key={n.number}
              onPress={() => this.props.onSelect(contact, index)}
            >
              <Flex direction="column" align="center" style={styles.rowWrap}>
                <Text style={styles.label}>{n.label}:</Text>
                <Text style={styles.number}>{n.number}</Text>
              </Flex>
            </Touchable>
          ))}
        </Flex>
        <Flex style={styles.modal2}>
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={styles.cancelWrap}
          >
            <Button
              text="Cancel"
              buttonTextStyle={styles.cancelButtonText}
              style={styles.cancelButton}
              onPress={this.handleCancel}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

SelectNumber.propTypes = {
  contact: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default translate()(SelectNumber);
