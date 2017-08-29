import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';

import theme from '../../theme';
import ACTION_BUTTON from '../../../images/to-chat-button.png';

// https://github.com/mastermoo/react-native-action-button
class FloatingButtonSingle extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <ActionButton
        buttonColor={theme.primaryColor}
        useNativeFeedback={true}
        icon={<Image source={ACTION_BUTTON} />}
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
