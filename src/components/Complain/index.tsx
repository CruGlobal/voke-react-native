import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Dimensions, ScrollView, Platform, Linking } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { BlurView } from '@react-native-community/blur';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import CONSTANTS, { REDUX_ACTIONS } from 'utils/constants';
import theme from 'utils/theme';
import Touchable from 'components/Touchable';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';

import { createComplain } from '../../actions/requests';
import { RootState } from '../../reducers';
import OldButton from '../OldButton';

import styles from './styles';

const Complain = () => {
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('reportModal');
  const { width, height } = Dimensions.get('window');
  const complain = useSelector(({ info }: RootState) => info.complain);
  const [complainSubmited, setComplainSubmited] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const dispatch = useDispatch();
  const isAndroid = Platform.OS === 'android';
  useEffect(() => {
    if (complain?.messageId) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
    return () => {
      // clearComplain();
    };
  }, [complain?.messageId]);

  useEffect(() => {
    clearComplain();
  }, []);

  const clearComplain = () => {
    dispatch({ type: REDUX_ACTIONS.CLEAR_COMPLAIN });
    setComplainSubmited(false);
  };

  const closeModal = (): void => {
    clearComplain();
    modalizeRef.current?.close();
  };

  const sendComplain = async (reason: string): void => {
    setIsBusy(true);
    try {
      await dispatch(
        createComplain({
          messageId: complain?.messageId,
          adventureId: complain?.adventureId,
          comment: reason,
        }),
      );
      setComplainSubmited(true);
      setIsBusy(false);
    } catch (error) {
      LOG('🛑 sendComplain > unexpected return', error);
      if (error?.errors[0] === 'Message has already been taken') {
        setComplainSubmited(true);
      } else {
        LOG('🛑 sendComplain > close modal');
        closeModal();
      }
      setIsBusy(false);
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalTopOffset={height > 600 ? height / 6 : 0}
        handlePosition={'inside'}
        openAnimationConfig={{
          timing: { duration: 300 },
        }}
        onClose={() => {
          clearComplain();
        }}
        rootStyle={{
          elevation: 5, // need it here to solve issue with button shadow.
        }}
        modalStyle={styles.modalStyle}
        childrenStyle={styles.childrenStyle}
        adjustToContentHeight={true}
        disableScrollIfPossible={height > 600 ? true : false}
        FooterComponent={
          <SafeAreaView edges={['bottom']} style={styles.modalActions}>
            {!complainSubmited ? (
              <OldButton
                onPress={() => closeModal()}
                touchableStyle={styles.actionButton}
                testID={'ctaComplainClose'}
              >
                <Text style={styles.actionButtonLabel}>{t('cancel')}</Text>
              </OldButton>
            ) : (
              <OldButton
                onPress={() => closeModal()}
                touchableStyle={styles.actionButton}
                testID={'ctaComplainDone'}
              >
                <Text style={styles.actionButtonLabel}>{t('done')}</Text>
              </OldButton>
            )}
          </SafeAreaView>
        }
      >
        {isAndroid ? (
          <View style={styles.modalBlurAndroid} />
        ) : (
          <BlurView blurType="xlight" style={styles.modalBlur} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text numberOfLines={2} style={styles.modalTitle}>
              {t('modalTitle')}
            </Text>
          </View>
          {!complainSubmited ? (
            <>
              <Text style={styles.causeTitle}>{t('introText')}</Text>
              <ScrollView
                style={styles.causeOptions}
                scrollIndicatorInsets={{ right: 1 }}
              >
                <Touchable
                  highlight={false}
                  activeOpacity={0.8}
                  onPress={(): void => {
                    isBusy ? null : sendComplain(t('bullying'));
                  }}
                  style={styles.causeOption}
                  testID={'ctaBullying'}
                  disabled={isBusy}
                >
                  <Text style={styles.causeOptionLabel}>{t('bullying')}</Text>
                </Touchable>
                <Touchable
                  highlight={false}
                  activeOpacity={0.8}
                  onPress={(): void => {
                    isBusy ? null : sendComplain(t('spam'));
                  }}
                  style={styles.causeOption}
                  testID={'ctaSpam'}
                  disabled={isBusy}
                >
                  <Text style={styles.causeOptionLabel}>{t('spam')}</Text>
                </Touchable>
                <Touchable
                  highlight={false}
                  activeOpacity={0.8}
                  onPress={(): void => {
                    isBusy ? null : sendComplain(t('inappropriate'));
                  }}
                  style={styles.causeOption}
                  testID={'ctaInappropriate'}
                  disabled={isBusy}
                >
                  <Text style={styles.causeOptionLabel}>
                    {t('inappropriate')}
                  </Text>
                </Touchable>
              </ScrollView>
            </>
          ) : (
            <ScrollView
              style={styles.complainConfirmation}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <VokeIcon
                name="check_circle"
                style={styles.complainConfirmationIcon}
                size={40}
              />
              <Text style={styles.complainConfirmationText}>
                {t('submited')}
              </Text>
            </ScrollView>
          )}
          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>
              {t('reportingFooter')}{' '}
              <Text
                style={styles.modalFooterHighlight}
                onPress={(): void => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
              >
                <Text style={styles.modalFooterLink}>{t('learnMore')}</Text>{' '}
                {t('aboutReporting')}
              </Text>
            </Text>
          </View>
        </View>
      </Modalize>
    </Portal>
  );
};

export default Complain;
