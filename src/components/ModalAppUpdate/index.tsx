import React, { ReactElement, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Text from '../Text';
import theme from '../../theme';
import { useCheckUpdate } from '../../hooks/useCheckUpdate';
import Button from '../Button';
import UkeBot from '../../assets/UkeBot.png';
import Image from '../Image';
import Spacer from '../Spacer';

import styles from './styles';
import { getStoreUrl } from '../../utils/get';

function ModalAppUpdate(): ReactElement {
  const { t } = useTranslation('modal');
  const modalizeRef = useRef<Modalize>(null);
  // const updateNeeded = useCheckUpdate();
  const updateNeeded = 'major';
  const storeUrl = getStoreUrl();
  console.log( "🐸 storeUrl:", storeUrl );

  useEffect(() => {
    if (updateNeeded) {
      modalizeRef.current?.open();
    }
  }, [updateNeeded]);

  const onRemindMeLater = (): void => {
    // Remind me later - does not show the update message again
    // until a 5 day / 120 hour period.
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        // Make modal permanent if it's a major udpate.
        panGestureEnabled={updateNeeded === 'major' ? false : true}
        closeOnOverlayTap={updateNeeded === 'major' ? false : true}
        withHandle={updateNeeded === 'major' ? false : true}
        // ----------------------
        adjustToContentHeight={true}
        handlePosition={'inside'}
        openAnimationConfig={{
          timing: { duration: 300 },
        }}
        onClose={(): void => {
          // Do nothing.
        }}
        rootStyle={{
          elevation: 5, // need it here to solve issue with button shadow.
        }}
        modalStyle={{
          backgroundColor: theme.colors.white,
        }}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={styles.container}>
            <Text style={styles.modalTitle}>{t('newImproved')}</Text>
            <Image
              resizeMode="contain"
              source={UkeBot}
              style={{
                height: 106,
                width: 106,
              }}
            />
            <Text style={styles.modalHeader}>
              {updateNeeded === 'minor' ? t('getLatestVoke') : t('majorUpdate')}
            </Text>
            <View style={styles.callToActionBlock}>
              <Button size="m" radius="m">
                {t('updateApp')}
              </Button>
            </View>
            {updateNeeded === 'minor' ? (
              <Text onClick={onRemindMeLater} style={styles.secondaryAction}>
                {t('remindMeLater')}
              </Text>
            ) : (
              <Text style={styles.subActionText}>{t('updateToKeepUsing')}</Text>
            )}
          </View>
        </SafeAreaView>
      </Modalize>
    </Portal>
  );
}

export default ModalAppUpdate;
