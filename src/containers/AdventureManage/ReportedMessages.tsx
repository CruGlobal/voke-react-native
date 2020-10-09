import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import { getComplains } from '../../actions/requests';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Image from '../../components/Image';

import styles from './styles';

const Message = ({ item, index }) => {
  const t = text => {
    return i18n.t(text);
  };
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
          <Text style={styles.reportedMessageText}>{item.message_content}</Text>
        </View>
      </View>
      <View style={styles.reportedMessageSecondary}>
        <View style={styles.reporter}>
          <Text style={styles.reporterName}>{t('manageGroup:reportedBy')}</Text>
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
          <Button
            onPress={item.buttonAction}
            testID={'ctaContinue' + index}
            touchableStyle={styles.complainActionBlock}
          >
            <Text style={styles.complainActionBlockLabel}>
              {t('manageGroup:block')}
            </Text>
          </Button>
          <Button
            onPress={item.buttonAction}
            testID={'ctaContinue' + index}
            touchableStyle={styles.complainActionAllow}
          >
            <Text style={styles.complainActionAllowLabel}>
              {t('manageGroup:allow')}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

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
          renderItem={Message}
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
