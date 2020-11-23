/* eslint-disable camelcase */
import React, { useState, useEffect, ReactElement } from 'react';
import { View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import lodash from 'lodash';
import { useTranslation } from 'react-i18next';
import { TAdventureSingle, TAvailableAdventure } from 'utils/types';

import Image from '../Image';
import Touchable from '../Touchable';
import Text from '../Text';
import OldButton from '../OldButton';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
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
        <Image uri={thumbUri} style={styles.thumb} />
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
          {/* <Text
            style={[st.fs(24), st.white, st.light, st.tac]}
            numberOfLines={2}
          >
            {adventureData.slogan}
          </Text> */}

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
          // value={0.5}
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
                touchableStyle={styles.shareIcon}
                testID={'ctaShareIcon'}
              >
                <VokeIcon
                  type="image"
                  name="to-chat"
                  style={styles.inviteIcon}
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
