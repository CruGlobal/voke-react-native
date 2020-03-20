import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Button } from '../../components/common';
import theme, { COLORS } from '../../theme';

class ProfileProgress extends Component {
  render() {
    const { t, user, isAnonUser, onHandleSignUpAccount } = this.props;

    let percentage = 100;
    if (isAnonUser) percentage = 50;

    return (
      <Flex direction="column" align="center" style={styles.wrap}>
        <Flex direction="row" align="center" style={styles.textWrap}>
          <Text style={[styles.text, { textAlign: 'left' }, styles.textFilled]}>
            {t('guest')}
          </Text>
          <Text
            style={[
              styles.text,
              { textAlign: 'right' },
              !isAnonUser ? styles.textFilled : null,
            ]}
          >
            {t('user')}
          </Text>
        </Flex>
        <Flex direction="row" align="center">
          <Flex style={styles.lineWrap}>
            <Flex style={[styles.line, { width: `${percentage}%` }]} />
          </Flex>
          <Flex direction="row" align="center" style={styles.absoluteWrap}>
            <Flex value={1} align="start">
              <Flex
                style={[styles.round, styles.positionStart, styles.filled]}
              />
            </Flex>
            <Flex value={1} align="end">
              <Button
                isAndroidOpacity={true}
                type="transparent"
                style={styles.progressButton}
                onPress={() =>
                  user.email ? undefined : onHandleSignUpAccount()
                }
              >
                <Flex
                  style={[
                    styles.round,
                    styles.positionEnd,
                    !isAnonUser ? styles.filled : null,
                  ]}
                />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

const DOT_SIZE = 20;
const grey = COLORS.LIGHT_GREY;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 25,
  },
  textWrap: {
    paddingBottom: 15,
  },
  lineWrap: {
    flex: 1,
    height: 2,
    backgroundColor: grey,
  },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  round: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: grey,
    backgroundColor: theme.white,
    zIndex: 5,
  },
  absoluteWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  positionStart: {
    alignSelf: 'flex-start',
  },
  position2: {
    alignSelf: 'center',
  },
  positionEnd: {
    alignSelf: 'flex-end',
  },
  filled: {
    backgroundColor: theme.primaryColor,
    borderWidth: 0,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: grey,
  },
  textFilled: {
    color: theme.primaryColor,
  },
});

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
  isAnonUser: auth.isAnonUser,
});

ProfileProgress.propTypes = {
  onHandleVerifyNumber: PropTypes.func,
  onHandleSignUpAccount: PropTypes.func,
};

export default translate('profile')(connect(mapStateToProps)(ProfileProgress));
