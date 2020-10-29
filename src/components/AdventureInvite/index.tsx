/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import OldButton from '../OldButton';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import useInterval from '../../utils/useInterval';
import { getExpiredTime } from '../../utils/get';
import {
  resendAdventureInvitation,
  deleteAdventureInvitation,
  getAdventuresInvitations,
  getAvailableAdventures,
} from '../../actions/requests';
import theme from '../../theme';

import styles from './styles';

const THUMBNAIL_WIDTH = 140;

type InviteItemProps = {
  inviteID: string;
};

const AdventureInvite = ({ inviteID }: InviteItemProps): React.ReactElement => {
  // const inviteItem = {
  //   code: '',
  //   conversation: {},
  //   progress: {},
  //   item: { content: { thumbnails: { small: '' } } },
  //   name: '',
  //   expires_at: '',
  //   ...item,
  // };

  const inviteItem = useSelector(
    ({ data }) => data.adventureInvitations.byId[inviteID],
  );

  const [isExpired, setIsExpired] = useState(false);
  const [time, setTime] = useState('');
  const [timer, setTimer] = useState(60000); // 1 minute timer step
  const { organization_journey, name, code } = inviteItem;
  const orgJourney = organization_journey || {};
  const orgJourneyImage = orgJourney?.image?.small;
  const isGroup = inviteItem.kind === 'multiple';
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation(['adventuresTab', 'adventuresList']);

  const thumbnail = useMemo(() => orgJourneyImage || '', [orgJourneyImage]);

  if (!code) {
    return <></>;
  }

  const updateExpire = () => {
    const { str, isTimeExpired } = getExpiredTime(inviteItem.expires_at);
    setIsExpired(isTimeExpired);
    setTime(str);
  };

  useEffect(() => {
    updateExpire();
  }, []);

  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      updateExpire();
      return (): void => {
        // When the screen is unfocused:
      };
    }, []),
  );

  // Create a live expiration countdown timer.
  // Function will fire by itself after required time passes..
  useInterval(() => {
    updateExpire();
    // Clear the interval when it is expired
    if (isExpired) {
      setTimer(null);
    }
  }, timer);

  const resendInvite = async inviteID => {
    try {
      await dispatch(resendAdventureInvitation(inviteID));
    } finally {
      navigation.navigate('AdventureShareCode', {
        invitation: inviteItem,
        withGroup: isGroup,
        isVideoInvite: false,
      });
    }
  };

  const deleteInvite = inviteID => {
    // dispatch(
    Alert.alert(
      t('areYouSureDelete', { name: inviteItem?.name || '' }),
      t('deleteCannotBeUndone'),
      [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: async () => {
            await dispatch(deleteAdventureInvitation(inviteID));
            await dispatch(getAdventuresInvitations());
            // await dispatch(getAvailableAdventures());
          },
        },
      ],
    );
    // );
  };

  return (
    <Flex style={styles.InviteWrapper}>
      <Touchable
        onPress={async (): Promise<void> => {
          navigation.navigate('AdventureActive', {
            adventureId: inviteItem.messenger_journey_id,
          });
        }}
        testID={code}
      >
        <Flex
          style={[styles.InviteBlock]}
          direction="row"
          align="center"
          // justify="start"
        >
          <Flex>
            <Image uri={thumbnail} style={styles.thumbnail} />
          </Flex>
          <Flex
            value={1}
            direction="column"
            align="start"
            justify="center"
            style={[styles.InviteBlockContent]}
          >
            <Text numberOfLines={2} style={[st.white, st.fs4]}>
              {isExpired
                ? t('adventuresList:codeExpired', { name })
                : isGroup
                ? `${name}: \n` + t('adventuresList:waitingForGroup')
                : t('adventuresList:waitingForFriend', { name })}
            </Text>
            <Flex value={1} direction="column" align="left" justify="between">
              <Flex
                value={1}
                direction="row"
                align="center"
                style={styles.CodeBlock}
              >
                <Text numberOfLines={1} style={styles.Code}>
                  {' '}
                  {t('adventuresList:code')}
                </Text>
                <Text
                  selectable
                  style={[st.white, st.bold]}
                  testID={'inviteCode'}
                >
                  {code}
                </Text>
              </Flex>
              <Flex style={{ width: '100%' }}>
                {!isExpired && !isGroup ? (
                  <Text
                    numberOfLines={1}
                    style={[st.white, st.fs6]}
                    testID="expiresIn"
                  >
                    {t('adventuresList:expiresIn', { time })}
                  </Text>
                ) : (
                  <OldButton
                    onPress={() => resendInvite(inviteID)}
                    style={styles.ButtonReset}
                    buttonTextStyle={[st.fs6]}
                  >
                    <Text style={styles.ButtonResetLabel}>{t('resend')}</Text>
                  </OldButton>
                )}
              </Flex>
            </Flex>
          </Flex>
          {isExpired ? (
            <Flex
              align="center"
              justify="center"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
              }}
            >
              <Touchable
                onPress={(): void => {
                  deleteInvite(inviteID);
                }}
                style={[st.br2, st.borderTransparent, st.bw1, st.pd(7)]}
              >
                <VokeIcon name="close" style={styles.iconDelete} />
              </Touchable>
            </Flex>
          ) : null}
        </Flex>
      </Touchable>
    </Flex>
  );
};

export default AdventureInvite;
