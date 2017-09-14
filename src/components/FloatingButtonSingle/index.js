import React, { Component } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// import ActionButton from 'react-native-action-button';
import TO_CHAT from '../../../images/to-chat-button.png';

// import { Touchable, VokeIcon } from '../common';

import styles from './styles';

const SIZE = 68;
// https://github.com/mastermoo/react-native-action-button
class FloatingButtonSingle extends Component {
  render() {
    // const { onSelect, icon } = this.props;
    // return (
    //   <ActionButton
    //     buttonColor={theme.primaryColor}
    //     icon={icon || <Image source={ACTION_BUTTON} />}
    //     onPress={onSelect}
    //     useNativeFeedback={true}
    //     size={60}
    //   />
    // );
    const { onSelect } = this.props;
    return (
      <View
        style={[
          styles.wrapper,
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
          },
        ]}>
        <TouchableOpacity onPress={onSelect} activeOpacity={0.6} borderless={true}>
          <Image source={TO_CHAT} style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }} />
        </TouchableOpacity>
      </View>
    );
  }
}

FloatingButtonSingle.propTypes = {
  onSelect: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

export default FloatingButtonSingle;
