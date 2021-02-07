import React, {
  useState,
  useEffect,
  useMemo,
  FunctionComponent,
  ReactElement,
} from 'react';
import { View, Alert, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import analytics from '@react-native-firebase/analytics';
import st from 'utils/st';
import { TAdventureSingle, TDataState } from 'utils/types';
import Flex from 'components/Flex';
import Image from 'components/Image';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
import VokeIcon from 'components/VokeIcon';

import { deleteAdventure, getMyAdventures } from '../../actions/requests';
import { RootState } from '../../reducers';

import ProgressDots from './ProgressDots';
import styles from './styles';

interface Props {
  adventureId: string;
  adventureItem: TAdventureSingle;
}

const AdventureCardRender: FunctionComponent<Props> = ({
  adventureId,
  adventureItem,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation('journey');
  const { name, progress, conversation } = adventureItem;

  const available = progress.total;
  const { completed } = progress;
  const totalSteps = new Array(available).fill(1);

  const adventureImage = adventureItem?.item?.content?.thumbnails?.large;
  const thumbnail = useMemo(() => adventureImage || '', [adventureImage]);
  const [unreadCount, setUnreadCount] = useState(
    conversation.unread_messages || 0,
  );
  const hasUnread = unreadCount > 0;
  const me = useSelector(({ auth }: RootState) => auth.user);
  const windowDimensions = Dimensions.get('window');
  const messengers = conversation.messengers || [];
  const isSolo = messengers.length === 2;
  const isGroup = adventureItem.kind === 'multiple';
  const myAvatar = me?.avatar?.small;
  const usersExceptVokeAndMe = messengers.filter(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );
  const totalGroupUsers = usersExceptVokeAndMe.length;
  const maxNumberOfAvatars = windowDimensions.width < 400 ? 3 : 4;
  let subGroup = usersExceptVokeAndMe;
  let numberMore = 0;
  let groupName = '';

  if (totalGroupUsers > maxNumberOfAvatars) {
    subGroup = usersExceptVokeAndMe.slice(0, maxNumberOfAvatars - 1);
    numberMore = totalGroupUsers - subGroup.length;
  }
  if (isGroup) {
    groupName = (adventureItem.journey_invite || {}).name || '';
  }

  useEffect(() => {
    setUnreadCount(conversation.unread_messages);
  }, [conversation.unread_messages]);

  const onDeleteAdventure = (advId: string): void => {
    Alert.alert(t('unsubscribeTitle'), t('unsubscribeBody'), [
      {
        text: t('cancel'),
        onPress: (): void => {
          // do nothing.
        },
        style: 'cancel',
      },
      {
        text: t('delete'),
        onPress: async (): Promise<void> => {
          await dispatch(deleteAdventure(advId));
          dispatch(getMyAdventures());
        },
      },
    ]);
  };

  const getCardTitle = (): string => {
    let title = '';
    if (isSolo) {
      // Solo:
      title = t('yourAdventure');
    } else if (isGroup) {
      // Group:
      title = groupName
        ? groupName + ' ' + t('adventure')
        : t('archivedAdventure');
    } else {
      // Duo:
      title = t('adventureWith') + ' ' + usersExceptVokeAndMe[0].first_name;
    }
    return title;
  };

  const getAdventureType = (): 'solo' | 'group' | 'duo' => {
    let type: 'solo' | 'group' | 'duo' | '' = '';
    if (isSolo) {
      // Solo:
      type = 'solo';
    } else if (isGroup) {
      // Group:
      type = 'group';
    } else {
      // Duo:
      type = 'duo';
    }
    return type;
  };

  return (
    <Flex style={styles.wrapper}>
      <Touchable
        onPress={(): void => {
          // Google Analytics: Record content selection.
          // https://rnfirebase.io/reference/analytics#logSelectItem
          analytics().logSelectItem({
            content_type: 'Adventure Active',
            item_list_id: 'Adventures',
            item_list_name: 'My Adventures',
            items: [
              {
                item_variant: adventureItem.kind,
                item_name: adventureItem.name,
                item_category: 'Adventure Active',
                item_category2: adventureItem?.language?.name,
              },
            ],
          });

          navigation.navigate('AdventureActive', {
            adventureId: adventureItem.id,
          });
        }}
      >
        <Flex
          style={styles.card}
          direction="row"
          align="center"
          justify="center"
        >
          <Flex>
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
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
              {getCardTitle()}
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
              <Touchable
                disabled={isSolo}
                isAndroidOpacity={true}
                onPress={(): void =>
                  navigation.navigate('AllMembersModal', {
                    adventureId: adventureItem.id,
                    isJoined: true,
                  })
                }
              >
                <Flex
                  direction="row"
                  align="center"
                  style={{ paddingBottom: 0 }}
                >
                  <Image source={{ uri: myAvatar }} style={styles.avatar} />

                  {subGroup.map(i => (
                    <Image
                      source={{ uri: i?.avatar?.small }}
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
              {/* UNREAD COUNTER */}
              {hasUnread ? (
                <Flex
                  direction="row"
                  align="center"
                  justify="center"
                  style={styles.unreadBubble}
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
                <Text numberOfLines={1} style={styles.completedLine}>
                  {completed}/{available} {t('completed').toLowerCase()}
                </Text>
                <Text
                  style={
                    styles[(getAdventureType() + 'tag') as keyof typeof styles]
                  }
                >
                  {t(getAdventureType())}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    </Flex>
  );
};

function AdventureCard({ adventureId }: { adventureId: string }): ReactElement {
  const adventureItem: TAdventureSingle =
    useSelector(
      ({ data }: RootState) =>
        data.myAdventures.byId[
          adventureId as keyof TDataState['myAdventures']['byId']
        ],
    ) || {};
  // Don't even try to render item if there is no data for it in the store.
  if (adventureItem?.id && adventureItem?.status !== 'canceled') {
    return (
      <AdventureCardRender
        adventureId={adventureId}
        adventureItem={adventureItem}
      />
    );
  } else {
    console.log('🛑 adventureItem?.id:', adventureItem?.id);
    return <></>;
  }
}

export default AdventureCard;
