import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-native-snap-carousel';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import Button from '../../components/Button';
import VokeIcon from '../../components/VokeIcon';
import Image from '../../components/Image';

import styles from './styles';
import theme from '../../theme';

const Message = ({ item, index }) => {
  // const { t } = useTranslation('manageGroup');
  // const { width, height } = Dimensions.get('window');
  const t = (text) => {
    return text;
  }
  const width = 200
  return (
    <View
      style={{
        backgroundColor: 'floralwhite',
        borderRadius: theme.radius.l,
        height: width * 0.8,
        // width: 100,
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text>Jesica Davis</Text>
      <Text>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</Text>
      <View style={styles.reportedMessageSecondary}>
        <Text>Reported by: Ben Franklin</Text>
        <Text>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</Text>
        <Button
          onPress={item.buttonAction}
          // isLoading={isLoading}
          testID={'ctaContinue' + index}
          touchableStyle={{
            padding: theme.spacing.s,
            backgroundColor: theme.colors.secondary,
            borderRadius: theme.radius.xxl,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            width: '60%',
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSizes.l,
              lineHeight: theme.fontSizes.l * 1.5,
              textAlign: 'center',
              color: theme.colors.white,
            }}
          >
            {t('block')}
          </Text>
        </Button>
        <Button
          onPress={item.buttonAction}
          // isLoading={isLoading}
          testID={'ctaContinue' + index}
          touchableStyle={{
            padding: theme.spacing.s,
            backgroundColor: theme.colors.secondary,
            borderRadius: theme.radius.xxl,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5,
            shadowOffset: { width: 1, height: 8 },
            width: '60%',
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSizes.l,
              lineHeight: theme.fontSizes.l * 1.5,
              textAlign: 'center',
              color: theme.colors.white,
            }}
          >
            {t('allow')}
          </Text>
        </Button>
      </View>
    </View>
  );
};

const ReportedMessages = ({ adventureId }) => {
  const { t } = useTranslation('manageGroup');
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.complains}>
      <Text style={styles.sectionTitle}>{t('reportedMessages')}</Text>
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={styles.complainsBlock}
      >
        <Text style={styles.complainsEmpty}>{t('noReportedMessages')}</Text>
      </Flex>
      <Carousel
        firstItem={0}
        containerCustomStyle={
          {
            // backgroundColor: 'rgba(0,0,0,.3)'
          }
        }
        // ref={(c) => { this._carousel = c; }}
        data={[
          {
            icon: 'month',
            title: 'Weekly Releases',
            description: 'Automatically release videos once a week.',
            buttonLabel: 'Select',
            buttonAction: () => cardAction('weekly'),
          },
          {
            icon: 'date',
            title: 'Daily Releases',
            description: 'Automatically release videos every day.',
            buttonLabel: 'Select',
            buttonAction: () => cardAction('daily'),
          },
          {
            icon: 'cog',
            title: 'Manual Releases',
            description: 'Release videos manually, whenever you’re ready.',
            buttonLabel: 'Select',
            buttonAction: () => cardAction('manual'),
          },
        ]}
        renderItem={Message}
        sliderWidth={width}
        itemWidth={width - 80}
        layout={'default'}
        removeClippedSubviews={false}
        // onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
      />
    </View>
  );
};

export default ReportedMessages;
