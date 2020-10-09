import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import {
  getComplains,
  ignoreComplain,
  approveComplain,
} from '../../actions/requests';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';

// import SingleReport from './SingleReport';
import styles from './styles';

const ReportedMessages = ({ adventureId }) => {
  const { t } = useTranslation('manageGroup');
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  const [complains, setComplains] = useState([]);

  const getAdventureComplains = async adventureId => {
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

    if (result?.status === 'pending') {
      const modifiedComplains = [...complains];
      complains.forEach((complain, index) => {
        if (complain.id === reportId) {
          modifiedComplains[index].status = 'approved';
        }
      });
      setComplains(modifiedComplains);
    }
  };

  const SingleReport = ({ item, index }) => {
    return (
      <View style={styles.complain}>
        <View style={styles.reportedMessage}>
          <View style={styles.reportedUser}>
            <Image
              uri={item.reported.avatar.small}
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
              uri={item.reporter.avatar.small}
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
                <Button
                  onPress={() =>
                    complainActionBlock({
                      adventureId: adventureId,
                      reportId: item.id,
                    })
                  }
                  testID={'ctaContinue' + index}
                  touchableStyle={styles.complainActionBlock}
                  disabled={item.status !== 'pending' ? true : false}
                >
                  <Text style={styles.complainActionBlockLabel}>
                    {t('block')}
                  </Text>
                </Button>
                <Button
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
                </Button>
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
    </View>
  );
};

export default ReportedMessages;
