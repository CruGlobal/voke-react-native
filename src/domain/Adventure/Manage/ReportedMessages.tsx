import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import Flex from 'components/Flex';
import Text from 'components/Text';
import OldButton from 'components/OldButton';
import Image from 'components/Image';
import VokeIcon from 'components/VokeIcon';
import Spacer from 'components/Spacer';
import Button from 'components/Button';

import {
  getComplains,
  ignoreComplain,
  approveComplain,
} from '../../../actions/requests';

import styles from './styles';

const ReportedMessages = ({ adventureId }) => {
  const { t } = useTranslation('manageGroup');
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  const [complains, setComplains] = useState([]);
  const [currentReport, setCurrentReport] = useState({});
  const modalizeRef = useRef<Modalize>(null);
  const isAndroid = Platform.OS === 'android';

  const getAdventureComplains = async (adventureId) => {
    const complains = await dispatch(
      getComplains({ adventureId: adventureId }),
    );
    if (complains?.reports.length) {
      setComplains(complains?.reports);
    }
  };

  useEffect(() => {
    if (adventureId) {
      getAdventureComplains(adventureId);
    }
  }, []);

  const complainActionAllow = async ({ adventureId, reportId }) => {
    const result = await dispatch(
      ignoreComplain({
        adventureId: adventureId,
        reportId: reportId,
      }),
    );

    if (result?.status === 'denied') {
      const modifiedComplains = [...complains];
      complains.forEach((complain, index) => {
        if (complain.id === reportId) {
          modifiedComplains[index].status = 'denied';
        }
      });
      setComplains(modifiedComplains);
    }
  };

  const complainActionBlock = async ({ adventureId, reportId }) => {
    const result = await dispatch(
      approveComplain({
        adventureId: adventureId,
        reportId: reportId,
      }),
    );

    if (result?.status === 'accepted') {
      const modifiedComplains = [...complains];
      complains.forEach((complain, index) => {
        if (complain.id === reportId) {
          modifiedComplains[index].status = 'accepted';
        }
      });
      setComplains(modifiedComplains);
    }
  };

  const closeModal = (): void => {
    setCurrentReport({});
    modalizeRef.current?.close();
  };

  const SingleReport = ({ item, index }) => {
    return (
      <View style={styles.complain}>
        <View style={styles.reportedMessage}>
          <View style={styles.reportedUser}>
            <Image
              source={{ uri: item.reported.avatar.small }}
              style={styles.reportedUserAvatar}
            />
            <Text style={styles.reportedUserName}>
              {item.reported.first_name} {item.reported.last_name}
            </Text>
          </View>
          <View style={styles.reportedMessageContent}>
            <Text style={styles.reportedMessageText}>
              {item.message_content}
            </Text>
          </View>
        </View>
        <View style={styles.reportedMessageSecondary}>
          <View style={styles.reporter}>
            <Text style={styles.reporterName}>{t('reportedBy')}</Text>
            <Image
              source={{ uri: item.reporter.avatar.small }}
              style={styles.reporterAvatar}
            />
            <Text style={styles.reporterName}>
              {item.reporter.first_name} {item.reporter.last_name}
            </Text>
          </View>
          <Text style={styles.reportedComment}>{item.comment}</Text>
          <View style={styles.complainActions}>
            {item.status === 'pending' ? (
              <>
                <OldButton
                  onPress={() => {
                    modalizeRef.current?.open();
                    setCurrentReport(item);
                  }}
                  testID={'ctaContinue' + index}
                  touchableStyle={styles.complainActionBlock}
                  disabled={item.status !== 'pending' ? true : false}
                >
                  <Text style={styles.complainActionBlockLabel}>
                    {t('block')}
                  </Text>
                </OldButton>
                <OldButton
                  onPress={() =>
                    complainActionAllow({
                      adventureId: adventureId,
                      reportId: item.id,
                    })
                  }
                  testID={'ctaContinue' + index}
                  touchableStyle={styles.complainActionAllow}
                  disabled={item.status !== 'pending' ? true : false}
                >
                  <Text style={styles.complainActionAllowLabel}>
                    {t('allow')}
                  </Text>
                </OldButton>
              </>
            ) : (
              <VokeIcon
                name={'check_circle'}
                style={styles.complainActionIcon}
                size={26}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.complains}>
      <View style={styles.complainsTitle}>
        <Text style={styles.sectionTitle}>{t('reportedMessages')}</Text>
      </View>
      {!complains.length ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={styles.complainsBlock}
        >
          <Text style={styles.complainsEmpty}>{t('noReportedMessages')}</Text>
        </Flex>
      ) : (
        <Carousel
          firstItem={0}
          data={complains}
          renderItem={SingleReport}
          sliderWidth={width}
          itemWidth={width - 80}
          layout={'default'}
          removeClippedSubviews={false}
        />
      )}
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={height > 600 ? height / 6 : 0}
          handlePosition={'inside'}
          openAnimationConfig={{
            timing: { duration: 300 },
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
              {currentReport?.status === 'pending' ? (
                <OldButton
                  onPress={() => closeModal()}
                  touchableStyle={styles.actionButton}
                >
                  <Text style={styles.actionButtonLabel}>{t('cancel')}</Text>
                </OldButton>
              ) : (
                <OldButton
                  onPress={() => closeModal()}
                  touchableStyle={styles.actionButton}
                >
                  <Text style={styles.actionButtonLabel}>{t('done')}</Text>
                </OldButton>
              )}
            </SafeAreaView>
          }
        >
          <SafeAreaView edges={['bottom']}>
            {isAndroid ? (
              <View style={styles.modalBlurAndroid} />
            ) : (
              <BlurView blurType="xlight" style={styles.modalBlur} />
            )}
            <View style={styles.modalContent}>
              {currentReport?.status === 'accepted' ? (
                <>
                  <VokeIcon
                    name="check_circle"
                    style={styles.confirmationIcon}
                    size={50}
                  />
                  <Text style={styles.confirmationTitle}>
                    {t('memberBlockedTitle', {
                      name: currentReport?.reported?.first_name || '',
                    })}
                  </Text>
                  <Text style={styles.confirmationText}>
                    {t('memberBlockedText', {
                      name: currentReport?.reported?.first_name || '',
                    })}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>{t('reportModalTitle')}</Text>
                  <Text style={styles.modalText}>{t('reportModalText')}</Text>
                  <Spacer size="l" />
                  <Button
                    onPress={() => {
                      complainActionBlock({
                        adventureId: adventureId,
                        reportId: currentReport?.id,
                      });
                    }}
                    touchableStyle={styles.complainActionBlock}
                    disabled={
                      currentReport?.status !== 'pending' ? true : false
                    }
                    size="l"
                    color="secondary"
                  >
                    {t('block')}
                  </Button>
                </>
              )}
            </View>
          </SafeAreaView>
        </Modalize>
      </Portal>
    </View>
  );
};

export default ReportedMessages;
