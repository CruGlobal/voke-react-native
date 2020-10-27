import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Dimensions, ScrollView, Platform, Linking } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { BlurView } from '@react-native-community/blur';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { createComplain } from '../../actions/requests';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import { RootState } from '../../reducers';
import CONSTANTS, { REDUX_ACTIONS } from '../../constants';
import theme from '../../theme';
import OldButton from '../OldButton';

import styles from './styles';

const Complain = () => {
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('reportModal');
  const { width, height } = Dimensions.get('window');
  const complain = useSelector(({ info }: RootState) => info.complain);
  const [complainSubmited, setComplainSubmited] = useState(false);
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
    const result = await dispatch(
      createComplain({
        messageId: complain?.messageId,
        adventureId: complain?.adventureId,
        comment: reason,
      }),
    );
    // clearComplain();
    if (result) {
      setComplainSubmited(true);
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
        rootStyle={styles.rootStyle}
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
                <OldButton
                  onPress={() => {
                    sendComplain(t('bullying'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaBullying'}
                >
                  <Text style={styles.causeOptionLabel}>{t('bullying')}</Text>
                </OldButton>
                <OldButton
                  onPress={() => {
                    sendComplain(t('spam'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaSpam'}
                >
                  <Text style={styles.causeOptionLabel}>{t('spam')}</Text>
                </OldButton>
                <OldButton
                  onPress={() => {
                    sendComplain(t('inappropriate'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaInappropriate'}
                >
                  <Text style={styles.causeOptionLabel}>
                    {t('inappropriate')}
                  </Text>
                </OldButton>
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
