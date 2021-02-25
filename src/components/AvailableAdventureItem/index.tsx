import React, { useState, useEffect, ReactElement } from 'react';
import { View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import lodash from 'lodash';
import { useTranslation } from 'react-i18next';
import { TAdventureSingle, TAvailableAdventure } from 'utils/types';
import theme from 'utils/theme';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Image from 'components/Image';
import Touchable from 'components/Touchable';
import Text from 'components/Text';

import OldButton from '../OldButton';
import { RootState } from '../../reducers';
import Button from '../Button';

import styles from './styles';

function AvailableAdventureItem(
  adventureData: TAvailableAdventure,
): ReactElement {
  const { t } = useTranslation('journey');
  const windowDimensions = Dimensions.get('window');
  const myAdventures = useSelector(
    ({ data }: RootState) => data.myAdventures.byId,
  );
  const navigation = useNavigation();
  const [shouldInviteFriend, setShouldInviteFriend] = useState(
    lodash.find(
      myAdventures,
      // TODO try to optimize
      function (adv: TAdventureSingle) {
        return adv?.organization_journey_id === adventureData.id;
      },
    ),
  );
  const thumbUri = adventureData.image?.medium;

  useEffect(() => {
    setShouldInviteFriend(
      lodash.find(
        myAdventures,
        // TODO try to optimize
        function (adv: TAdventureSingle) {
          return adv?.organization_journey_id === adventureData.id;
        },
      ),
    );
  }, [myAdventures, adventureData.id]);

  return (
    <Touchable
      onPress={(): void =>
        navigation.navigate('AdventureAvailable', {
          item: adventureData,
          alreadyStartedByMe: shouldInviteFriend,
        })
      }
      style={styles.wrapper}
    >
      <Flex align="center" justify="center" style={styles.card}>
        <Image source={{ uri: thumbUri }} style={styles.thumb} />
        <View style={styles.backFill} />
        <Flex value={1} align="center" justify="center">
          {shouldInviteFriend ? (
            <Flex direction="row" align="center" style={styles.badgeStarted}>
              <Text style={styles.badgeStartedText}>
                {t('started').toUpperCase()}
              </Text>
              <VokeIcon name="play-full" style={styles.badgeStartedIcon} />
            </Flex>
          ) : (
            <Text style={styles.badgeStartedText}>
              {t('adventure').toUpperCase()}
            </Text>
          )}
          <Text style={styles.title} testID={'adventureTitle'}>
            {adventureData.name}
          </Text>

          {shouldInviteFriend ? (
            <Flex justify="center">
              <Button
                onPress={(): void =>
                  navigation.navigate('AdventureName', {
                    item: {
                      id: adventureData.id,
                    },
                    withGroup: false,
                  })
                }
                size="s"
                color="accent"
                icon="share"
                testID={'ctaShareInviteFriend'}
              >
                {t('inviteFriend')}
              </Button>
            </Flex>
          ) : (
            <Flex style={{ minHeight: 10 }} />
          )}
        </Flex>

        <Flex
          justify="between"
          align="center"
          direction="row"
          self="stretch"
          style={styles.bottomLine}
        >
          <Flex direction="row" align="center">
            <VokeIcon name="copy" style={styles.partsIcon} />
            <Text style={styles.smallText}>
              {adventureData.total_steps}-{t('partSeries').toUpperCase()}
            </Text>
          </Flex>
          <Flex direction="row" align="center">
            {windowDimensions.width > 320 && (
              <Text style={styles.smallText}>
                {t('videos:shares', {
                  total: adventureData.total_shares || 0,
                }).toUpperCase()}
              </Text>
            )}
            {shouldInviteFriend ? null : (
              <OldButton
                testID={'ctaShareIcon'}
                type="transparent"
                isAndroidOpacity
                onPress={(): void =>
                  navigation.navigate('AdventureName', {
                    item: {
                      id: adventureData.id,
                    },
                    withGroup: false,
                  })
                }
                activeOpacity={0.6}
                touchableStyle={{
                  top: -15,
                  marginLeft: 10,
                  backgroundColor: theme.colors.primary,
                  width: 50,
                  height: 50,
                  borderRadius: theme.radius.xxl,
                  ...theme.shadow,
                  // Inner Icon Alignment:
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <VokeIcon
                  name="share"
                  style={{
                    fontSize: 30,
                    borderRadius: 25,
                    color: theme.colors.white,
                  }}
                />
              </OldButton>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  );
}

export default AvailableAdventureItem;
