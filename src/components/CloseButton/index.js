import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Flex, Touchable, Icon } from '../common';

export default class CloseButton extends Component {
  render() {
    return (
      <Flex align="end" self="stretch" style={styles.header}>
        <Touchable
          borderless={true}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={this.props.onClose}
        >
          <View>
            <Icon size={40} type="Ionicons" name="ios-close" />
          </View>
        </Touchable>
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
});

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};
