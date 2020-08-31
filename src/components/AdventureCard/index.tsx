import React, { useState, useEffect, useMemo } from 'react';
import { View, Alert, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { deleteAdventure, getMyAdventures } from '../../actions/requests';

import ProgressDots from './ProgressDots';
import styles from './styles';

const THUMBNAIL_HEIGHT = 78;

function AdventureCard({ adventureId }) {
  const me = useSelector(({ auth }) => auth.user);
  const adventureItem =
    useSelector(({ data }) => data.myAdventures.byId[adventureId]) || null;
  if (adventureItem == null) {
    return <></>;
  }
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation('journey');

  const { conversation } = adventureItem;
  const { progress } = adventureItem;
  const adventureImage = adventureItem?.item?.content?.thumbnails?.large;
  const thumbnail = useMemo(() => adventureImage || '', [adventureImage]);
  const [unreadCount, setUnreadCount] = useState(
    conversation.unread_messages || 0,
  );
  const hasUnread = unreadCount > 0;
  const available = progress.total;
  const totalSteps = new Array(available).fill(1);
  const { completed } = progress;

  const windowDimensions = Dimensions.get('window');

  const messengers = conversation.messengers || [];

  const isSolo = messengers.length === 2;
  const isGroup = adventureItem.kind === 'multiple';
  const myUser = messengers.find(i => i.id === me.id) || {};
  const myAvatar = useMemo(() => myUser?.avatar?.small, [
    myUser?.avatar?.small,
  ]);
  const otherUser =
    messengers.find(i => i.id !== me.id && i.first_name !== 'VokeBot') || {};

  const otherUserAvatar = useMemo(() => otherUser?.avatar?.small, [
    otherUser?.avatar?.small,
  ]);

  const usersExceptVokeAndMe = messengers.filter(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );
  const totalGroupUsers = usersExceptVokeAndMe.length;
  let subGroup = usersExceptVokeAndMe;
  let numberMore = 0;
  const maxNumberOfAvatars = windowDimensions.width < 400 ? 3 : 4;
  if (totalGroupUsers > maxNumberOfAvatars) {
    subGroup = usersExceptVokeAndMe.slice(0, maxNumberOfAvatars - 1);
    numberMore = totalGroupUsers - maxNumberOfAvatars;
  }
  let groupName;
  if (isGroup) {
    groupName = (adventureItem.journey_invite || {}).name || '';
  }

  const { name } = adventureItem;
  const inviteCode = adventureItem?.journey_invite?.code || '';

  if (adventureItem.code) {
    // return <InviteItem item={adventureItem} />;
  }

  if (!adventureItem.id) {
    return <></>;
  }

  useEffect(() => {
    setUnreadCount(conversation.unread_messages);
    return () => {
      // cleanup
    };
  }, [adventureItem]);

  const onDeleteAdventure = adventureId => {
    // dispatch(
    Alert.alert(t('unsubscribeTitle'), t('unsubscribeBody'), [
      {
        text: t('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('delete'),
        onPress: async () => {
          await dispatch(deleteAdventure(adventureId));
          await dispatch(getMyAdventures());
        },
      },
    ]);
    // );
  };

  return (
    <Flex style={styles.wrapper}>
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={(): void =>
          navigation.navigate('AdventureActive', {
            adventureId: adventureItem.id,
          })
        }
      >
        <Flex
          style={styles.card}
          direction="row"
          align="center"
          justify="center"
        >
          <Flex>
            <Image uri={thumbnail} style={styles.thumbnail} />
          </Flex>
          <Flex
            value={1}
            direction="column"
            align="start"
            justify="start"
            style={styles.content}
          >
            <Touchable
              isAndroidOpacity={true}
              onPress={(): void => {
                onDeleteAdventure(adventureId);
              }}
              style={styles.iconDeleteWrapper}
            >
              <VokeIcon
                name="close-circle"
                style={styles.iconDeleteIcon}
                size={26}
              />
            </Touchable>
            <Text numberOfLines={2} style={styles.participants}>
              {isSolo
                ? t('yourAdventure')
                : isGroup
                ? groupName + ' ' + t('adventure')
                : t('adventureWith') + ' ' + otherUser.first_name}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {name}
            </Text>
            <Flex
              value={1}
              direction="row"
              align="center"
              justify="between"
              style={styles.avatars}
            >
              {/* AVATARS */}
              {!isGroup ? (
                <Flex value={1} direction="row" align="center">
                  <View>
                    <Image uri={myAvatar} style={styles.avatar} />
                  </View>
                  {!isSolo ? (
                    <Image uri={otherUserAvatar} style={styles.avatarSolo} />
                  ) : null}
                </Flex>
              ) : (
                <Touchable
                  isAndroidOpacity={true}
                  onPress={(): void =>
                    navigation.navigate('AllMembersModal', {
                      adventure: adventureItem,
                      isJoined: true,
                    })
                  }
                >
                  <Flex
                    direction="row"
                    align="center"
                    style={{ paddingBottom: 0 }}
                  >
                    <Image uri={myAvatar} style={styles.avatar} />

                    {subGroup.map((i, index) => (
                      <Image
                        uri={i?.avatar?.small}
                        style={styles.avatarInGroup}
                      />
                    ))}
                    {numberMore ? (
                      <View
                        style={[
                          st.circle(36),
                          st.bgBlue,
                          {
                            borderWidth: 2,
                            borderColor: st.colors.white,
                            marginLeft: -14,
                          },
                        ]}
                      >
                        <Flex self="stretch" align="center" justify="center">
                          <Text
                            style={[
                              st.white,
                              {
                                fontSize: 16,
                                height: '100%',
                                lineHeight: 29,
                              },
                            ]}
                          >
                            +{numberMore}
                          </Text>
                        </Flex>
                      </View>
                    ) : (
                      <></>
                    )}
                  </Flex>
                </Touchable>
              )}
              {/* UNREAD COUNTER */}
              {hasUnread ? (
                <Flex
                  direction="row"
                  align="center"
                  justify="center"
                  style={[
                    st.br2,
                    st.bgOrange,
                    st.mr4,
                    st.p6,
                    st.pl5,
                    st.pr5,
                    {
                      // position: "absolute",
                      // right: -2,
                      // top: 0,
                    },
                  ]}
                >
                  <VokeIcon
                    name="speech-bubble-full"
                    style={styles.iconUnread}
                    size={14}
                  />
                  <Text style={[st.white, { fontWeight: 'bold' }]}>
                    {unreadCount > 99 ? '99' : unreadCount}
                  </Text>
                </Flex>
              ) : null}
            </Flex>
            <Flex
              value={1}
              direction="column"
              align="start"
              style={{ width: '100%' }}
            >
              <Flex value={1} direction="row" align="center">
                {totalSteps.map((i, index) => (
                  <ProgressDots key={index} isFilled={index < completed} />
                ))}
              </Flex>
              <Flex
                value={1}
                direction="row"
                align="center"
                justify="between"
                style={{ width: '100%' }}
              >
                <Text numberOfLines={1} style={[st.charcoal, st.fs5]}>
                  {completed}/{available} {t('completed').toLowerCase()}
                </Text>
                {isSolo ? (
                  <Text style={styles.solotag}>{t('solo')}</Text>
                ) : isGroup ? (
                  <Text style={styles.grouptag}>{t('group')}</Text>
                ) : (
                  <Text style={styles.duotag}>{t('duo')}</Text>
                )}

                {/* {inviteCode ? <Text style={styles.InviteCode}>{inviteCode}</Text>:<></>} */}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    </Flex>
  );
}

export default AdventureCard;
