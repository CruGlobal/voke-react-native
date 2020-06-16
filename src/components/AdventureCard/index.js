import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import moment from 'moment';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { useSelector, useDispatch } from 'react-redux';
import { useMount, momentUtc, useInterval } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import ProgressDots from './ProgressDots';
import styles from './styles';

const THUMBNAIL_HEIGHT = 78;
const THUMBNAIL_WIDTH = 140;


function AdventureCard({ adventureId }) {
  const me = useSelector(({ auth }) => auth.user);
  const adventureItem = useSelector(({ data }) => data.myAdventures.byId[adventureId])||null;
  if (adventureItem==null) {
    return <></>;
  }

/*   const adventureItem = {
    code: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { medium: '' } } },
    name: '',
    ...item,
  };
 */
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const conversation = adventureItem.conversation;
  const progress = adventureItem.progress;
  const thumbnail = adventureItem.item.content.thumbnails.large;
  const [unreadCount, setUnreadCount] = useState(conversation.unread_messages || 0)
  const hasUnread = unreadCount > 0;
  const available = progress.total;
  const totalSteps = new Array(available).fill(1);
  const completed = progress.completed;

  const messengers = conversation.messengers || [];

  const isSolo = messengers.length === 2;
  const isGroup = adventureItem.kind === 'multiple';
  const myUser = messengers.find(i => i.id === me.id) || {};
  const otherUser =
    messengers.find(i => i.id !== me.id && i.first_name !== 'VokeBot') || {};

  const usersExceptVokeAndMe = messengers.filter(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );
  const totalGroupUsers = usersExceptVokeAndMe.length;
  let subGroup = usersExceptVokeAndMe;
  let numberMore = 0;
  if (totalGroupUsers > 4) {
    subGroup = usersExceptVokeAndMe.slice(0, 3);
    numberMore = totalGroupUsers - 4;
  }
  let groupName;
  if (isGroup) {
    groupName = (adventureItem.journey_invite || {}).name || '';
  }

  const name = adventureItem.name;
  const inviteCode = adventureItem?.journey_invite?.code || '';

  if (adventureItem.code) {
    // return <InviteItem item={adventureItem} />;
  }

  if ( !adventureItem.id ) {
    return <></>;
  }

  useEffect(() => {
    setUnreadCount(conversation.unread_messages);
    return () => {
      // cleanup
    }
  }, [adventureItem])

  return (
    <Flex style={styles.Wrapper}>
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('AdventureActive', {
            adventureId: adventureItem.id,
          })
        }
      >
        <Flex
          style={[styles.Card]}
          direction="row"
          align="center"
          justify="center"
        >
          <Flex>
            <Image
              source={{ uri: thumbnail }}
              style={[st.f1, st.w(THUMBNAIL_WIDTH),st.ml6, st.mt6, st.mb6]}
            />
          </Flex>
          <Flex
            value={1}
            direction="column"
            align="start"
            justify="start"
            style={[styles.Content]}
          >
             <Touchable
                  isAndroidOpacity={true}
                  onPress={() => alert("Delete pressed")
                  }
                  style={{position: "absolute",right:2, top:4}}
                >
              <VokeIcon
                name="close-circle"
                style={[ st.grey2 ]}
                size={26}
              />
              </Touchable>
            <Text numberOfLines={2} style={styles.Participants}>
              {isSolo ? 'Your Adventure' : isGroup ? groupName + ' Adventure' : 'Adventure with ' + otherUser.first_name}
            </Text>
            <Text numberOfLines={2} style={styles.Title}>
              {name}
            </Text>
            <Flex value={1} direction="row" align="center" justify="between"
              style={{
                width:'100%',
                paddingBottom: 10,
              }}
            >
              {/* { hasUnread ?
              <VokeIcon
                name="speech-bubble-full"
                style={[ st.orange ]}
                size={20}
              /> :
              <VokeIcon
                name="speech-bubble"
                style={[ st.darkGrey, st.mr5 ]}
                size={20}
              />
              } */}
              {/* */}

              {/* AVATARS */}
              {!isGroup ? (
                <Flex value={1} style={[{paddingBottom:10}]} direction="row" align="center">
                  <View>
                    <Image
                      source={{
                        uri: (myUser.avatar || {}).small || undefined,
                      }}
                      style={[st.circle(36), { borderWidth: 2, borderColor: st.colors.white, marginLeft: -3 }]}
                    />
                  </View>
                  {!isSolo ? (
                    <Image
                      source={{ uri: (otherUser.avatar || {}).small || undefined }}
                      style={[st.circle(36),{marginLeft: -12}, { borderWidth: 2, borderColor: st.colors.white }]}
                    />
                  ) : null}
                  <Text
                    style={[
                      st.charcoal,
                      st.tac,
                      { marginLeft: 10 },
                    ]}
                  >
                    {isSolo ? 'You' : isGroup ? 'Group' : 'You and ' +otherUser.first_name}
                  </Text>
                </Flex>
              ) : (
                <Touchable
                  isAndroidOpacity={true}
                  onPress={() =>
                    navigation.navigate('AllMembersModal', {
                      adventure: adventureItem,
                      isJoined: true,
                    })
                  }
                >
                  <Flex direction="row" align="center" style={[{paddingBottom:0}]}>
                    <Image
                      source={{
                        uri: (myUser.avatar || {}).small || undefined,
                      }}
                      style={[
                        st.circle(36),
                        { borderWidth: 2, borderColor: st.colors.white, marginLeft: -3 }
                      ]}
                    />
                    {subGroup.map((i, index) => (
                      <Image
                        source={{ uri: (i.avatar || {}).small || undefined }}
                        style={[
                          st.circle(36),
                          // st.abstl,
                          // { left: (index + 1) * 10 },
                          { borderWidth: 2, borderColor: st.colors.white, marginLeft: -12 },
                        ]}
                      />
                    ))}
                    {numberMore ? (
                      <View
                        style={[
                          st.circle(22),
                          st.abstl,
                          { left: 50 },
                          st.bgBlue,
                          { borderWidth: 1, borderColor: st.colors.orange },
                        ]}
                      >
                        <Flex self="stretch" align="center" justify="center">
                          <Text style={[{ fontSize: 12 }]}>+{numberMore}</Text>
                        </Flex>
                      </View>
                    ) :
                      <Text
                        style={[
                          st.charcoal,
                          st.tac,
                          { marginLeft: 10 },
                        ]}
                      >
                        { (totalGroupUsers+1) + ' members' }
                      </Text>
                    }
                  </Flex>
                </Touchable>
              )}
              {/* UNREAD COUNTER */}
              {hasUnread ? (
                <Flex
                  direction="row"
                  align="center"
                  justify="center"
                  style={[ st.br2, st.bgOrange, st.mr4, st.p6, st.pl5, st.pr5,
                  {
                    // position: "absolute",
                    // right: -2,
                    // top: 0,
                  }
                  ]}
                >
                  <VokeIcon
                    name="speech-bubble-full"
                    style={[ st.white, {marginTop: -1, marginRight: 6} ]}
                    size={14}
                  />
                  <Text style={[st.white, {fontWeight: 'bold'}]}>
                    {unreadCount > 99 ? '99' : unreadCount}
                  </Text>
                </Flex>
              ) : null}
            </Flex>
            <Flex value={1} direction="column" align="start" style={{width:'100%'}}>
              <Flex value={1} direction="row" align="center">
                {totalSteps.map((i, index) => (
                  <ProgressDots key={index} isFilled={index < completed} />
                ))}
              </Flex>
              <Flex value={1} direction="row" align="center" justify="between" style={{width:'100%'}}>
                <Text numberOfLines={1} style={[st.charcoal, st.fs5]}>
                  {completed}/{available} {'completed'}
                </Text>
                {isSolo ? <Text style={styles.SoloTag}>Solo</Text> : isGroup ? <Text style={styles.GroupTag}>Group</Text> : <Text style={styles.DuoTag}>Duo</Text>}

                {/* {inviteCode ? <Text style={styles.InviteCode}>{inviteCode}</Text>:<></>} */}
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
