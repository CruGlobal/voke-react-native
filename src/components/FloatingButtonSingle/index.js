import React, { Component } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import TO_CHAT from '../../../images/to-chat-button.png';

import { Touchable } from '../common';
import styles from './styles';

const SIZE = 68;
class FloatingButtonSingle extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <View
        style={[
          styles.wrapper,
          { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
        ]}>
        <Touchable isAndroidOpacity={true} onPress={onSelect} activeOpacity={0.6}>
          <Image
            source={TO_CHAT}
            style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
          />
        </Touchable>
      </View>
    );
  }
}

FloatingButtonSingle.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default FloatingButtonSingle;
