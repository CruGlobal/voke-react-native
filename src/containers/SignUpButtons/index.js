import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import FacebookButton from '../FacebookButton';
import styles from './styles';
import { buildTrackingObj } from '../../utils/common';

class SignUpButtons extends Component {
  render() {
    const { t, filled, trackingPage, isSignIn } = this.props;
    return (
      <Flex align="center" justify="center" style={styles.actions}>
        <Flex style={styles.buttonWrapper}>
          <Button
            text={t('signUpEmail')}
            icon="mail-outline"
            type={filled ? 'filled' : undefined}
            style={[styles.actionButton, filled ? styles.filled : null]}
            onPress={() => {
              this.props.dispatch(navigatePush('voke.SignUpAccount'));
              this.props.onNavigate && this.props.onNavigate();
            }}
          />
        </Flex>
        <Flex style={styles.buttonWrapper}>
          <FacebookButton
            isSignIn={isSignIn || undefined}
            type={filled ? 'filled' : undefined}
            style={filled ? styles.filled : undefined}
            onNavigate={() => this.props.onNavigate && this.props.onNavigate()}
          />
        </Flex>
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={styles.haveAccount}
        >
          <Text style={[styles.signIn, filled ? styles.signInFilled : null]}>
            {t('haveAccount')}
          </Text>
          <Button
            text={t('signIn')}
            type="transparent"
            buttonTextStyle={styles.signInText}
            onPress={() => {
              this.props.dispatch(
                navigatePush('voke.LoginInput', {
                  trackingObj: buildTrackingObj(
                    trackingPage || 'overlay',
                    'signup',
                  ),
                }),
              );
              this.props.onNavigate && this.props.onNavigate();
            }}
          />
        </Flex>
      </Flex>
    );
  }
}

export default translate()(connect()(SignUpButtons));
