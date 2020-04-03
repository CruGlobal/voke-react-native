import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
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
import { getMyAdventure } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';

const THUMBNAIL_HEIGHT = 78;
const THUMBNAIL_WIDTH = 64;
const TIMER_INTERVAL = 60;

const ProgressDots = React.memo(function({ isFilled }) {
  return (
    <View
      style={[
        isFilled ? st.bgBlue : [st.bgTransparent, st.bw1, st.borderCharcoal],
        st.mr6,
        st.circle(10),
      ]}
    />
  );
});

function getExpiredTime(date) {
  const diff = momentUtc(date).diff(moment());
  const diffDuration = moment.duration(diff);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();
  // const seconds = diffDuration.seconds();

  const str = `${days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}${
    hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''
  }${minutes >= 0 ? `${minutes} min ` : ''}`;
  return { str, isTimeExpired: diff < 0 };
}

function InviteItem({ item }) {
  const adventureItem = {
    code: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    name: '',
    expires_at: '',
    ...item,
  };
  const [isExpired, setIsExpired] = useState(false);
  const [time, setTime] = useState('');
  const { organization_journey, name, code } = item;
  const orgJourney = organization_journey || {};
  const orgJourneyImage = (orgJourney.image || {}).small || undefined;
  const isGroup = item.kind === 'multiple';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const { str, isTimeExpired } = getExpiredTime(item.expires_at);
      // Clear the interval when it is expired
      if (isExpired && !this.state.isExpired) {
        clearInterval(interval);
      }
      setIsExpired(isTimeExpired);
      setTime(str);
    }, TIMER_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      style={[
        st.mt6,
        st.w(st.fullWidth - 30),
        st.bgDarkBlue,
        st.br6,
        st.ovh,
        st.asc,
        st.shadow,
      ]}
      direction="row"
      align="center"
      justify="start"
    >
      <Flex>
        <Image
          source={{ uri: orgJourneyImage }}
          style={[st.f1, st.w(THUMBNAIL_WIDTH), st.brbl6, st.brtl6]}
        />
      </Flex>
      <Flex
        value={1}
        direction="column"
        align="start"
        justify="start"
        style={[st.pv6, st.ph4]}
      >
        <Text numberOfLines={1} style={[st.white, st.fs4]}>
          {isGroup ? `${name}: Waiting for group` : `waiting for ${name}`}
        </Text>
        <Flex direction="column" align="start" style={[st.pb6]}>
          {!isExpired && !isGroup ? (
            <Text numberOfLines={1} style={[st.white, st.fs6]}>
              Expires in: {time}
            </Text>
          ) : (
            <Button
              text={'Resend'}
              onPress={() => {}}
              style={[
                st.bgOrange,
                st.ph5,
                st.pv(2),
                st.bw0,
                st.br0,
                st.br3,
                st.aic,
              ]}
              buttonTextStyle={[st.fs6]}
            />
          )}
          <Flex direction="row">
            <Text numberOfLines={1} style={[st.white, st.fs6, st.tal]}>
              Code
            </Text>
            <Text selectable={true} style={[st.white, st.fs6, st.bold, st.tal]}>
              {code}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        <Touchable
          onPress={async () => {
            const adv = await dispatch(
              getMyAdventure(adventureItem.messenger_journey_id),
            );
            navigation.navigate('ActiveAdventureModal', {
              adventure: adv,
            });
          }}
          style={[st.pd(7)]}
        >
          <Text style={[st.bold, st.white, st.fs6, st.tac]}>
            {'Get Started'
              .toUpperCase()
              .split(' ')
              .join('\n')}
          </Text>
        </Touchable>
      </Flex>
      <Flex align="center" justify="center" style={[st.tac, st.mr4, st.ml6]}>
        {isExpired ? (
          <Touchable
            onPress={() => {}}
            style={[st.br2, st.borderWhite, st.bw1, st.pd(7)]}
          >
            <VokeIcon name="close" style={[st.white, st.fs6]} />
          </Touchable>
        ) : null}
      </Flex>
    </Flex>
  );
}

function MyAdventureItem({ item }) {
  const me = useSelector(({ auth }) => auth.user);
  const adventureItem = {
    code: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    name: '',
    ...item,
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const conversation = adventureItem.conversation;
  const progress = adventureItem.progress;
  const thumbnail = adventureItem.item.content.thumbnails.small;
  const unreadCount = conversation.unread_messages;
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

  const name = isGroup ? groupName : adventureItem.name;

  if (adventureItem.code) {
    return <InviteItem item={adventureItem} />;
  }

  return (
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ActiveAdventureModal', {
          adventure: adventureItem,
        })
      }
    >
      <Flex
        style={[
          st.mt6,
          st.w(st.fullWidth - 30),
          st.bgWhite,
          st.br6,
          st.ovh,
          st.asc,
          st.shadow,
        ]}
        direction="row"
        align="center"
        justify="center"
      >
        <Flex>
          <Image
            source={{ uri: thumbnail }}
            style={[st.f1, st.w(THUMBNAIL_WIDTH), st.brbl6, st.brtl6]}
          />
        </Flex>
        <Flex
          value={1}
          direction="column"
          align="start"
          justify="start"
          style={[st.pv6, st.ph4]}
        >
          <Text numberOfLines={1} style={[st.pb6, st.blue, st.fs4]}>
            {name}
          </Text>
          <Flex direction="row" align="center" style={[st.pb6]}>
            <VokeIcon
              name="Chat"
              style={[
                hasUnread ? st.orange : st.darkGrey,
                hasUnread ? undefined : st.mr5,
              ]}
              size={20}
            />
            {hasUnread ? (
              <Flex
                align="center"
                justify="center"
                style={[st.circle(20), st.bgOrange, st.ml6]}
              >
                <Text style={[st.white]}>
                  {unreadCount > 99 ? '99' : unreadCount}
                </Text>
              </Flex>
            ) : null}
            {!isGroup ? (
              <Text style={[st.charcoal, st.ml5, st.fs5]}>
                {isSolo ? 'me' : otherUser.first_name}
              </Text>
            ) : (
              <Touchable
                isAndroidOpacity={true}
                onPress={() =>
                  navigation.navigate('AllMembersModal', {
                    adventure: item,
                    isJoined: true,
                  })
                }
                style={[st.pr1, st.ml5, { width: 100 }]}
              >
                <Flex direction="row" style={[]}>
                  <Image
                    source={{
                      uri: (myUser.avatar || {}).small || undefined,
                    }}
                    style={[
                      st.circle(22),
                      { borderWidth: 1, borderColor: st.colors.orange },
                    ]}
                  />
                  {subGroup.map((i, index) => (
                    <Image
                      source={{ uri: (i.avatar || {}).small || undefined }}
                      style={[
                        st.circle(22),
                        st.abstl,
                        { left: (index + 1) * 10 },
                        { borderWidth: 1, borderColor: st.colors.orange },
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
                  ) : null}
                </Flex>
              </Touchable>
            )}
          </Flex>
          <Flex direction="column" align="start" style={[st.mt6]}>
            <Flex direction="row" align="center">
              {totalSteps.map((i, index) => (
                <ProgressDots key={index} isFilled={index < completed} />
              ))}
            </Flex>
            <Text numberOfLines={2} style={[st.mt6, st.charcoal, st.fs5]}>
              {completed}/{available} {'complete'}
            </Text>
          </Flex>
        </Flex>
        {!isGroup ? (
          <Flex align="center" justify="center" style={[st.bgWhite]}>
            <Flex style={[st.mh5]}>
              <Touchable onPress={() => {}}>
                <Image
                  source={{
                    uri: (myUser.avatar || {}).small || undefined,
                  }}
                  style={[st.circle(36)]}
                />
              </Touchable>
              {!isSolo ? (
                <Image
                  source={{ uri: (otherUser.avatar || {}).small || undefined }}
                  style={[st.circle(36), st.abstl, { left: -10 }]}
                />
              ) : null}
              <Text
                style={[
                  st.charcoal,
                  st.tac,
                  !isSolo ? { marginLeft: -10 } : { marginLeft: -3 },
                ]}
              >
                {isSolo ? '1 player' : isGroup ? 'Group' : '2 player'}
              </Text>
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Touchable>
  );
}

export default MyAdventureItem;
