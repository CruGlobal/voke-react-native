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
    const { isActive, unReadBadgeCount } = this.props;

    return (
      <Flex
        align="center"
        justify="center"
        style={styles.container}
        animation="bounceIn"
      >
        <VokeIcon
          name="home"
          size={ICON_SIZE}
          style={{
            color: isActive ? 'white' : theme.primaryColor,
          }}
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
});

export default translate()(connect(mapStateToProps)(BadgeHomeIcon));
