import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, VokeIcon } from '../../components/common';

import theme from '../../theme';

const ICON_SIZE = theme.isAndroid ? 24 : 26;

class BadgeHomeIcon extends Component {
  render() {
    const {
      isAdventure,
      journeysUnreadCount,
      isActive,
      unReadBadgeCount,
    } = this.props;

    return (
      <Flex
        align="center"
        justify="center"
        style={styles.container}
        animation="bounceIn"
      >
        <VokeIcon
          name={isAdventure ? 'adventure' : 'Chat'}
          size={ICON_SIZE}
          style={{
            color: isActive ? theme.white : theme.primaryColor,
          }}
        />
        {unReadBadgeCount && !isAdventure ? (
          <Flex align="center" justify="center" style={styles.badgeWrap}>
            <Text allowFontScaling={false} style={styles.badge}>
              {unReadBadgeCount}
            </Text>
          </Flex>
        ) : null}
        {isAdventure && journeysUnreadCount ? (
          <Flex align="center" justify="center" style={styles.badgeWrap}>
            <Text allowFontScaling={false} style={styles.badge}>
              {journeysUnreadCount}
            </Text>
          </Flex>
        ) : null}
      </Flex>
    );
  }
}

BadgeHomeIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isAdventure: PropTypes.bool,
  unReadBadgeCount: PropTypes.number, // Redux
};

const mapStateToProps = ({ messages, journeys }, { isAdventure }) => {
  let journeysUnreadCount = 0;
  if (!journeys || !journeys.mine || !Array.isArray(journeys.mine)) {
    return {
      unReadBadgeCount: messages.unReadBadgeCount,
      journeysUnreadCount,
    };
  }
  if (isAdventure) {
    (journeys.mine || []).forEach(j => {
      journeysUnreadCount += (j.conversation || {}).unread_messages || 0;
    });
  }
  return {
    unReadBadgeCount: messages.unReadBadgeCount,
    journeysUnreadCount,
  };
};

export default translate()(connect(mapStateToProps)(BadgeHomeIcon));
