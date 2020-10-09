import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Dimensions, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { createComplain } from '../../actions/requests';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import { RootState } from '../../reducers';
import { REDUX_ACTIONS } from '../../constants';
import theme from '../../theme';
import Button from '../Button';

import styles from './styles';

const Complain = () => {
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('reportModal');
  const { width, height } = Dimensions.get('window');
  const complain = useSelector(({ info }: RootState) => info.complain);
  const [complainSubmited, setComplainSubmited] = useState(false);
  const dispatch = useDispatch();
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
        modalTopOffset={height / 4}
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
        FooterComponent={
          <SafeAreaView edges={['bottom']}>
            {!complainSubmited ? (
              <Button
                onPress={() => closeModal()}
                touchableStyle={styles.actionButton}
                testID={'ctaComplainClose'}
              >
                <Text style={styles.actionButtonLabel}>{t('cancel')}</Text>
              </Button>
            ) : (
              <Button
                onPress={() => closeModal()}
                touchableStyle={styles.actionButton}
                testID={'ctaComplainDone'}
              >
                <Text style={styles.actionButtonLabel}>{t('done')}</Text>
              </Button>
            )}
          </SafeAreaView>
        }
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text numberOfLines={2} style={styles.modalTitle}>
              {t('modalTitle')}
            </Text>
          </View>
          {!complainSubmited ? (
            <>
              <Text style={styles.causeTitle}>{t('introText')}</Text>
              <ScrollView style={styles.causeOptions}>
                <Button
                  onPress={() => {
                    sendComplain(t('bullying'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaBullying'}
                >
                  <Text style={styles.causeOptionLabel}>{t('bullying')}</Text>
                </Button>
                <Button
                  onPress={() => {
                    sendComplain(t('spam'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaSpam'}
                >
                  <Text style={styles.causeOptionLabel}>{t('spam')}</Text>
                </Button>
                <Button
                  onPress={() => {
                    sendComplain(t('inappropriate'));
                  }}
                  touchableStyle={styles.causeOption}
                  testID={'ctaInappropriate'}
                >
                  <Text style={styles.causeOptionLabel}>
                    {t('inappropriate')}
                  </Text>
                </Button>
              </ScrollView>
            </>
          ) : (
            <ScrollView style={styles.complainConfirmation}>
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
              <Text style={styles.modalFooterHighlight} onPress={() => {}}>
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
