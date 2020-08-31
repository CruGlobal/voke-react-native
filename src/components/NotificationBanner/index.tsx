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
      <Flex direction="row" style={styles.banner} align="start">
        <VokeIcon name="notification" style={styles.iconNotification} />
        <Text style={styles.labelOff}>{t('off')}</Text>

        <Button
          isAndroidOpacity
          onPress={() => toggleModal()}
          style={styles.buttonEnable}
        >
          <Text style={styles.labelOn}>{t('turnOn')}</Text>
        </Button>
      </Flex>
    </>
  );
};

const styles = StyleSheet.create({
  banner: { padding: 15, backgroundColor: '#000', height: 60 },
  iconNotification: {
    marginTop: 5,
    marginRight: 15,
    fontSize: 22,
    color: theme.colors.primary,
  },
  buttonEnable: {
    marginLeft: 30,
    alignSelf: 'flex-end',
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 32,
    paddingRight: 15,
    paddingLeft: 15,
  },
  labelOff: {
    marginTop: 2,
    color: theme.colors.white,
    fontSize: 18,
  },
  lavelOn: {
    color: theme.colors.white,
    fontSize: 18,
  },
});

export default NotificationBanner;
