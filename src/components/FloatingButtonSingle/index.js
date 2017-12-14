import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import TO_CHAT from '../../../images/to-chat-button.png';

import { Touchable } from '../common';
import styles from './styles';

const SIZE = 68;
class FloatingButtonSingle extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <Touchable
        isAndroidOpacity={true}
        onPress={onSelect}
        activeOpacity={0.6} style={[
          styles.wrapper,
          { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
        ]}>
        <Image
          source={TO_CHAT}
          style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
        />
      </Touchable>
    );
  }
}

FloatingButtonSingle.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default FloatingButtonSingle;
