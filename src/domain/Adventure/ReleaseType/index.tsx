import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useKeyboard } from '@react-native-community/hooks';
import Carousel from 'react-native-snap-carousel';
import { View, Dimensions } from 'react-native';
import VokeIcon from 'components/VokeIcon';
import Flex from 'components/Flex';
import Text from 'components/Text';
import OldButton from 'components/OldButton';
import BotTalking from 'components/BotTalking';
import Screen from 'components/Screen';
import theme from 'utils/theme';

import styles from './styles';

function GroupReleaseType(props: any): ReactElement {
  const {
    groupName,
    itemId,
    releaseSchedule,
    releaseDate,
    editing = false,
    adventureId,
  } = props.route.params;
  const { t } = useTranslation('share');
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  const keyboard = useKeyboard();

  const cardAction = (type) => {
    navigation.navigate('GroupReleaseDate', {
      groupName: groupName,
      itemId: itemId,
      releaseSchedule: type,
      editing: editing,
      releaseDate: releaseDate,
      adventureId: adventureId,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.card} testID={'releaseOption-' + (index + 1)}>
        <VokeIcon name={item.icon} style={styles.cardIcon} size={50} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardRecommended}>
          {index === 0 ? t('recommended') : ''}
        </Text>
        <OldButton
          onPress={item.buttonAction}
          testID={'ctaContinueOption-' + (index + 1)}
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
            {t('select')}
          </Text>
        </OldButton>
      </View>
    );
  };

  const initalItem = (currentSchedule) => {
    switch (currentSchedule) {
      case 'daily':
        return 1;
        break;
      case 'weekly':
        return 0;
        break;
      case 'manual':
        return 2;
      default:
        return 0;
        break;
    }
  };

  return (
    <Screen testID="groupReleaseType" noKeyboard>
      <Flex value={1} direction="column" justify="center">
        {keyboard.keyboardShown && (
          <View style={{ minHeight: theme.spacing.xl }} />
        )}
        <Flex
          // align="center"
          justify="center"
          style={{
            display: keyboard.keyboardShown ? 'none' : 'flex',
            // paddingBottom: theme.spacing.xl,
            // paddingTop: height > 800 ? theme.spacing.xl : 0,
            // minHeight: 200,
            paddingBottom: theme.spacing.l,
          }}
        >
          <BotTalking
            heading={t('groupReleaseSchedule')}
            style={{
              opacity: keyboard.keyboardShown ? 0 : 1,
            }}
          />
        </Flex>
        <View style={{ minHeight: theme.spacing.xxl }} />
        <Flex direction="column" justify="center">
          <Carousel
            firstItem={initalItem(releaseSchedule)}
            containerCustomStyle={{
              marginHorizontal:
                theme.window.width < 375 ? -theme.spacing.l : -theme.spacing.xl,
            }}
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
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 80}
            layout={'default'}
            removeClippedSubviews={false}
            // onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
          />
        </Flex>
        <View style={{ minHeight: theme.spacing.xxl }} />
      </Flex>
    </Screen>
  );
}

export default GroupReleaseType;
