import React from 'react';
import { View } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import Button from '../Button';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

function AdventureStepCard({ item, adventure }) {
  item = item || {};
  adventure = adventure || {};
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);

  const messengers = (adventure.conversation || {}).messengers || [];
  const thumbnail = (((item.item || {}).content || {}).thumbnails || {}).small;
  const isActive = item.status === 'active';
  const isCompleted = item.status === 'completed';
  const isLocked = !isCompleted && !isActive;
  const isWaiting = isActive && item['completed_by_messenger?'];
  const unreadCount = item.unread_messages;
  const hasUnread = unreadCount > 0;
  let otherUser = messengers.find(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );

  // if (messengers.length === 2 && inviteName) {
  //   otherUser = { first_name: inviteName };
  // }

  return (
    <Touchable
      highlight={false}
      disabled={isLocked}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AdventureStepModal', { step: item, adventure })
      }
    >
      <Flex
        style={[
          isActive ? st.bgWhite : st.bgOffBlue,
          isLocked ? st.op50 : null,
          st.mv6,
          st.mh4,
          st.br5,
        ]}
        align="center"
        justify="start"
      >
        <Flex direction="row" style={[st.minh(84)]}>
          <Flex style={[st.m5, st.rel]}>
            <Image
              source={{ uri: thumbnail }}
              style={[st.w(100), st.bgBlack, st.f1]}
              resizeMode="contain"
            />
            <Flex style={[st.absfill]} align="center" justify="center">
              <VokeIcon
                type="image"
                name={isLocked ? 'lock' : 'play_filled'}
                size={30}
                style={[st.white, st.op90, st.w(30), st.h(30)]}
              />
            </Flex>
          </Flex>
          <Flex value={1} direction="column" self="start" style={[st.pv6]}>
            <Text
              numberOfLines={1}
              style={[st.fs4, isActive ? st.darkBlue : st.white]}
            >
              {item.name}
            </Text>
            <Text style={[st.fs5, isActive ? st.darkBlue : st.white]}>
              {'Part'} {item.position}
            </Text>
            {isActive || isCompleted ? (
              <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="Chat"
                  style={[
                    hasUnread
                      ? st.orange
                      : isCompleted
                      ? st.white
                      : st.charcoal,
                  ]}
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
              </Flex>
            ) : null}
          </Flex>
          {isLocked ? null : (
            <Flex
              style={[
                st.absbr,
                st.isAndroid ? st.bottom(0) : st.bottom(5),
                st.right(15),
                st.mh5,
              ]}
            >
              <Button
                type="transparent"
                isAndroidOpacity={true}
                onPress={() => {}}
                activeOpacity={0.6}
                touchableStyle={[st.abs, st.right(15), st.top(-35), st.mh5]}
              >
                <VokeIcon
                  type="image"
                  name="to-chat"
                  style={{ width: 50, height: 50 }}
                />
              </Button>
            </Flex>
          )}
          <Flex
            style={[
              st.absbr,
              st.isAndroid ? st.bottom(-23) : st.bottom(-28),
              st.mh5,
            ]}
          >
            <Text style={[isWaiting ? st.orange : st.blue, st.fs(72)]}>
              {item.position}
            </Text>
          </Flex>
        </Flex>
        {isWaiting && messengers.length > 2 ? (
          <Flex
            align="center"
            style={[st.bgOrange, st.w100, st.pd6, st.brbl5, st.brbr5]}
          >
            <Text style={[st.fs4]}>'waiting for answer'</Text>
          </Flex>
        ) : null}
        {isCompleted ? (
          <Flex
            style={[
              st.abs,
              st.top(-5),
              st.right(-5),
              st.bgDarkerBlue,
              st.pd6,
              st.br2,
            ]}
          >
            <VokeIcon name="check" size={16} style={[st.white]} />
          </Flex>
        ) : null}
      </Flex>
    </Touchable>
  );
}

export default AdventureStepCard;
