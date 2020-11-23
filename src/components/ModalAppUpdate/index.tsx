import React, { ReactElement, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import UkeBot from 'src/assets/UkeBot.png';
import theme from 'utils/theme';

import Text from '../Text';
import useCheckUpdate from '../../hooks/useCheckUpdate';
import Button from '../Button';
import Image from '../Image';
import useStoreUrl from '../../hooks/useStoreUrl';
import { remindToUpdate } from '../../actions/info';
import { RootState } from '../../reducers';

import styles from './styles';

function ModalAppUpdate(): ReactElement {
  const { t } = useTranslation('modal');
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const updateNeeded = useCheckUpdate();
  // const updateNeeded = 'minor'; // - left here for testing
  const storeUrl = useStoreUrl('1056168356');
  const remindToUpdateOn: string = useSelector(
    ({ info }: RootState) => info.remindToUpdateOn,
  );

  useEffect(() => {
    const timeDiff = moment(remindToUpdateOn).diff(moment());
    // If update needed and reminder timeout has expired.
    if (updateNeeded && timeDiff < 0) {
      // remindToUpdateOn
      modalizeRef.current?.open();
    }
  }, [updateNeeded, remindToUpdateOn]);

  const onRemindMeLater = (): void => {
    // Remind me later - does not show the update message again
    // until a 5 day / 120 hour period.
    dispatch(remindToUpdate(moment().add(5, 'days').format()));
    modalizeRef.current?.close();
  };

  const onUpdateNow = (): void => {
    Linking.openURL(storeUrl);
    onRemindMeLater();
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
              <Button size="m" radius="m" onPress={onUpdateNow}>
                {t('updateApp')}
              </Button>
            </View>
            {updateNeeded === 'minor' ? (
              <Text onPress={onRemindMeLater} style={styles.secondaryAction}>
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
