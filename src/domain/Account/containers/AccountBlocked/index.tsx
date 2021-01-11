/**
 * Modal informing the user that he was reported and blocked out of Voke.
 * We show this modal when getting WS message with action: 'block'.
 */
import React from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMount, lockToPortrait } from 'utils';
import BotTalking from 'components/BotTalking';
import CONSTANTS from 'utils/constants';
import Screen from 'components/Screen';
import Text from 'components/Text';

import styles from './styles';

const AccountBlocked = (): React.ReactElement => {
  const { t } = useTranslation('modal');

  useMount(() => {
    lockToPortrait(); // TODO: move this into the <Screen> component?
  });

  const linkTOS = () => (
    <Text
      onPress={(): Promise<void> => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
      style={styles.link}
    >
      {t('tos')}
    </Text>
  );

  return (
    <Screen>
      <BotTalking
        heading={t('removedFromVokeTitle')}
        style={styles.botMessageBlock}
        type="sad"
      />
      <Text style={styles.textReason}>
        {t('removedFromVokeBody') + ' '}
        {linkTOS()}
        {'. \n' + t('removedFromVokeWhatWrong')}
      </Text>
      <Text style={styles.textConclusion}>
        {t('modal:removedFromVokeContactLeader')}
      </Text>
    </Screen>
  );
};

export default AccountBlocked;
