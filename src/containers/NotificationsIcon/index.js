import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, VokeIcon } from '../../components/common';

import theme from '../../theme';

const ICON_SIZE = theme.isAndroid ? 29 : 30;

class BadgeHomeIcon extends Component {
  render() {
    const { unReadBadgeCount, isActive } = this.props;

    return (
      <Flex
        align="center"
        justify="center"
        style={styles.container}
        animation="bounceIn"
      >
        <VokeIcon
          type={'image'}
          name={isActive ? 'notificationBell' : 'notificationBellBlue'}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
          }}
        />
        {unReadBadgeCount ? (
          <Flex align="center" justify="center" style={styles.badgeWrap}>
            <Text allowFontScaling={false} style={styles.badge}>
              {unReadBadgeCount}
            </Text>
          </Flex>
        ) : null}
      </Flex>
    );
  }
}

BadgeHomeIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
  unReadNotificationsBadgeCount: PropTypes.number, // Redux
};

const mapStateToProps = ({ messages }) => {
  return {
    unReadBadgeCount: messages.unReadBadgeCount,
  };
};

export default translate()(connect(mapStateToProps)(BadgeHomeIcon));
