import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import ModalNotifications from '../../components/ModalNotifications';
import { RootState } from '../../reducers';
import Flex from '../Flex';
import Text from '../Text';
import OldButton from '../OldButton';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';

const NotificationBanner = (): React.ReactElement => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('notifications');
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

  return (
    <>
      <Flex direction="row" style={styles.banner}>
        <VokeIcon name="notification" style={styles.iconNotification} />
        <Text style={styles.bannerText}>{t('off')}</Text>

        <OldButton
          isAndroidOpacity
          onPress={() => modalizeRef.current?.open()}
          style={styles.buttonEnable}
        >
          <Text style={styles.bannerButtonLabel}>{t('turnOn')}</Text>
        </OldButton>
      </Flex>
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={0}
          withHandle={false}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          withOverlay={false}
          rootStyle={{
            elevation: 5, // need it here to solve issue with button shadow.
          }}
          modalStyle={{
            backgroundColor: 'rgba(0,0,0,.85)',
            minHeight: '105%',
            borderRadius: 0,
            marginTop:'-5%',
          }}
          FooterComponent={null}
        >
          <ModalNotifications
            closeAction={(): void => {
              modalizeRef.current?.close();
              /* navigation.navigate('AdventureName', {
                item,
                withGroup: true,
              }); */
            }}
          />
        </Modalize>
      </Portal>
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
