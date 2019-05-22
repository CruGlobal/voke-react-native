import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TO_CHAT from '../../../images/newShare.png';

import { Image, Touchable, Icon, Flex } from '../common';
import styles from './styles';

const SIZE = 68;
class FloatingButtonSingle extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <Touchable
        isAndroidOpacity={true}
        onPress={onSelect}
        activeOpacity={0.6}
        style={[
          styles.wrapper,
          { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
        ]}
      >
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <Icon name="message" size={30} />
        </Flex>
        <Image
          source={TO_CHAT}
          style={{
            width: SIZE + 8,
            height: SIZE + 8,
            borderRadius: SIZE / 2,
            marginTop: 3,
          }}
        />
      </Touchable>
    );
  }
}

FloatingButtonSingle.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default FloatingButtonSingle;
