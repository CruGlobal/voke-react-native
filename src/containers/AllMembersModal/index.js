import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';

import { Share, ScrollView } from 'react-native';

import VOKE_BOT from '../../assets/vokebot_whole.png';
import Touchable from '../../components/Touchable';
import CONSTANTS from '../../constants';
import VokeIcon from '../../components/VokeIcon';
import DEFAULT_AVATAR from '../../assets/defaultAvatar.png';
function AllMembersModal(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { adventure, isJoined } = props.route.params;

  const allMessengers = adventure.conversation.messengers || [];
  const messengers = allMessengers.filter(
    i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
  );

  const smallCircle = st.fullWidth / 2 - 90;
  const smallBox = st.fullWidth / 2 - 50;

  return (
    <>
      <StatusBar />
      <ScrollView
        style={[st.f1, st.w100, st.h100, st.bgBlue, { paddingTop: insets.top }]}
      >
        <Flex direction="row" align="center">
          <Flex value={1}>
            <Touchable
              style={[st.p5, st.pl4]}
              onPress={() => navigation.goBack()}
            >
              <VokeIcon
                type="image"
                name="buttonArrow"
                style={[st.rotate('180deg'), st.h(22), st.w(22)]}
              />
            </Touchable>
          </Flex>
          <Flex value={1}>
            <Text style={[st.white, st.fs16, st.tac]}>{adventure.name}!</Text>
          </Flex>
          <Flex value={1} />
        </Flex>

        <Flex style={[st.mb4]}>
          <Flex align="center" justify="center">
            <Flex align="center" self="stretch">
              {isJoined ? (
                <Text style={[st.white]}>
                  Group Code: {adventure.journey_invite.code}
                </Text>
              ) : (
                <Button
                  onPress={() => {}}
                  style={[
                    st.bgOrange,
                    st.ph6,
                    st.pv5,
                    st.bw0,
                    st.br3,
                    st.mt5,
                    st.aic,
                    { width: st.fullWidth - 90 },
                  ]}
                >
                  <Flex direction="row" align="center">
                    <Text style={[st.white, st.fs16]}>Join the Group</Text>
                  </Flex>
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={[]}>
          <Flex
            direction="row"
            wrap="wrap"
            align="end"
            justify="start"
            style={[st.w(st.fullWidth - 20)]}
          >
            {messengers.map((messenger, index) => (
              <Flex
                key={messenger.id}
                direction="column"
                align="center"
                style={[
                  st.bgOffBlue,
                  st.pd5,
                  st.m5,
                  {
                    width: smallBox,
                    height: smallBox,
                    marginRight: 15,
                  },
                ]}
              >
                {!messenger.avatar ? (
                  <Flex align="center" justify="center" style={[st.pt3]}>
                    <Image
                      resizeMode="contain"
                      source={DEFAULT_AVATAR}
                      style={[st.h(70), st.w(70)]}
                    />
                  </Flex>
                ) : (
                  <Image
                    resizeMode="contain"
                    source={{ uri: messenger.avatar.medium }}
                    style={[
                      {
                        height: smallCircle,
                        width: smallCircle,
                        borderRadius: smallCircle / 2,
                        borderWidth: st.isAndroid || index !== 0 ? 0 : 1,
                        borderColor: st.colors.red,
                      },
                    ]}
                  />
                )}

                <Text style={[st.fs5, st.white, st.tac]}>
                  {messenger.first_name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </ScrollView>
    </>
  );
}

export default AllMembersModal;
