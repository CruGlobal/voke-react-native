import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';

import { Icon } from '../common';
import theme from '../../theme';

const ICON_SIZE = 26;

// https://github.com/mastermoo/react-native-action-button
class FloatingButtonSingle extends Component {
  render() {
    const { onSelect, icon } = this.props;
    return (
      <ActionButton
        buttonColor={theme.primaryColor}
        useNativeFeedback={true}
        icon={<Icon size={ICON_SIZE} name={icon || 'share'} style={{ color: theme.lightText }} />}
        onPress={onSelect}
        offsetX={25}
        offsetY={25}
      />
    );
  }
}

FloatingButtonSingle.propTypes = {
  onSelect: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

export default FloatingButtonSingle;
