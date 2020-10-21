import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestPremissions } from '../../actions/auth';
import Flex from '../Flex';
import Text from '../Text';
import theme from '../../theme';
import OldButton from '../OldButton';
import BotTalking from '../BotTalking';

import styles from './styles';
import Screen from '../Screen';

// Renders Cards on this screen https://d.pr/i/WsCCf2
function ModalNotifications({ closeAction }): React.ReactElement {
  const { t } = useTranslation('modal');
  const { pushNotificationPermission, notificationsRequest } = useSelector(
    ({ info }: RootState) => info,
  );
  const me = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // If notifications enabled close modal.
    if (pushNotificationPermission === 'granted') {
      closeAction();
    }
    return () => {
      /* cleanup */
    };
  }, [pushNotificationPermission]);

  return (
    <Screen testID="modalNotifications" background="transparent">
      {/* ScrollView bounces={false} */}
      <Flex style={styles.container} direction="column" align="center">
        <View style={{ minHeight: theme.spacing.xl }} />
        <BotTalking type="reverse">
          {t('overlays:playUkulele', { name: me.firstName })}
        </BotTalking>
        <OldButton
          isAndroidOpacity
          style={styles.buttonAccept}
          onPress={() => {
            closeAction();
            return dispatch(requestPremissions());
          }}
          testID={'ctaAllowNotifications'}
        >
          <Text style={styles.buttonAcceptLabel}>
            {t('allowNotifications')}
          </Text>
        </OldButton>

        <OldButton
          isAndroidOpacity
          style={styles.buttonCancel}
          onPress={() => {
            closeAction();
          }}
        >
          <Text style={styles.buttonCancelLabel}>{t('noThanks')}</Text>
        </OldButton>
      </Flex>
    </Screen>
  );
}

export default ModalNotifications;
