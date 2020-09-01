import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { RootState } from '../../reducers';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';

const NotificationBanner = (): React.ReactElement => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation('notifications');
  const [modalOpen, setModalOpen] = useState(false);
  const me = useSelector(({ auth }: RootState) => auth.user);
  // Current premissions status stroed in
  // store.info.pushNotificationPermission
  const { pushNotificationPermission } = useSelector(
    ({ info }: RootState) => info,
  );
  // Ignore component if permissions already granted.
  if (pushNotificationPermission === 'granted') {
    return <></>;
  }

  const toggleModal = () => {
    navigation.navigate('CustomModal', {
      modalId: 'notifications',
      primaryAction: () => {},
    });
  };

  return (
    <>
      <Flex direction="row" style={styles.banner}>
        <VokeIcon name="notification" style={styles.iconNotification} />
        <Text style={styles.bannerText}>{t('off')}</Text>

        <Button
          isAndroidOpacity
          onPress={() => toggleModal()}
          style={styles.buttonEnable}
        >
          <Text style={styles.bannerButtonLabel}>{t('turnOn')}</Text>
        </Button>
      </Flex>
    </>
  );
};

const styles = StyleSheet.create({
  iconNotification: {
    marginRight: 15,
    fontSize: 24,
    color: theme.colors.primary,
  },
  banner: {
    padding: 15,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    color: theme.colors.white,
  },
  buttonEnable: {
    marginLeft: 30,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 32,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  bannerButtonLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
});

export default NotificationBanner;
