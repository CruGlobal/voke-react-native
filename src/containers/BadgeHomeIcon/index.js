import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text } from '../../components/common';

import HOME_ICON from '../../../images/chats_icon.png';
import HOME_ICON_INACTIVE from '../../../images/chatsInactive.png';

class BadgeHomeIcon extends Component {
  render() {
    const { isActive, unReadBadgeCount } = this.props;

    return (
      <Flex
        align="center"
        justify="center"
        style={styles.container}
        animation="bounceIn"
      >
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          source={isActive ? HOME_ICON : HOME_ICON_INACTIVE}
          style={styles.image}
        />
        {unReadBadgeCount ? (
          <Flex align="center" justify="center" style={styles.badgeWrap}>
            <Text style={styles.badge}>{unReadBadgeCount}</Text>
          </Flex>
        ) : null}
      </Flex>
    );
  }
}

BadgeHomeIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
  unReadBadgeCount: PropTypes.number, // Redux
};

const mapStateToProps = ({ messages }) => ({
  unReadBadgeCount: messages.unReadBadgeCount,
  // unReadBadgeCount: 5,
});

export default translate()(connect(mapStateToProps)(BadgeHomeIcon));
