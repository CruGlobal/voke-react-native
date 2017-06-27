import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';

import { Icon } from '../common';
import theme, { COLORS } from '../../theme';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const ICON_SIZE = 26;

// https://github.com/mastermoo/react-native-action-button
class FloatingButton extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <ActionButton
        backdrop={<View style={{ position: 'absolute', height: deviceHeight, width: deviceWidth, top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)'}} />}
        buttonColor={COLORS.WHITE}
        useNativeFeedback={true}
        icon={<Icon size={ICON_SIZE} name="add" style={{ color: theme.primaryColor }} />}
      >
        <ActionButton.Item
          title="Find and Share Videos"
          onPress={() => onSelect('voke.Videos')}
        >
          <Icon size={ICON_SIZE} name="local-movies" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title="Invite Friends"
          onPress={() => onSelect('voke.About')}
        >
          <Icon size={ICON_SIZE} name="person-add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

FloatingButton.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  actionButtonIcon: {
    height: 22,
    color: theme.primaryColor,
  },
});

export default FloatingButton;
