import React, { Component } from 'react';
import { Linking } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import CONSTANTS from '../../constants';
import { Text } from '../common';

class PrivacyToS extends Component {
  render() {
    const { t, type, style } = this.props;
    return (
      <Text style={[styles.privacy, style]}>
        {t(type || 'agree')}
        &nbsp;
        <Text style={styles.underline} onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}>{t('privacy')}</Text>
        &nbsp;
        {t('and')}
        &nbsp;
        <Text style={styles.underline} onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}>{t('tos')}</Text>
      </Text>
    );
  }
}

export default translate('exploring')(PrivacyToS);
