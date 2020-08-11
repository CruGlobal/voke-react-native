import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import Button from '../../components/Button';
import Touchable from '../../components/Touchable';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';

function GroupModal(props) {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const adventureId = props.route.params.adventure.messenger_journey_id;
  const myAdventures = useSelector(({ data }) => data.myAdventures.byId);
  const adventure = myAdventures[adventureId];
  const allMessengers = adventure.conversation.messengers;
  const messengers = allMessengers.filter(
    i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
  );
  const hasMoreMembers = messengers.length > 5;

  if (messengers.length < 5) {
    for (let m; messengers.length < 5; m++) {
      messengers.push({ first_name: '' });
    }
  }

  const smallCircle = st.fullWidth / 2 - 90;
  const smallBox = st.fullWidth / 2 - 50;
  const largeCircle = st.fullWidth / 2 - 80;
  const largeBox = st.fullWidth / 2 - 30;

  function handleJoinGroup() {
   /*  if ((((me || {}).avatar || {}).medium || '').includes('/avatar.jpg')) {
      navigation.navigate('AccountPhoto');
    } else { */
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    })
      // navigation.reset({ index: 0, routes: [{ name: 'Adventures' }] });
    // }
  }

  return (
    <>
      <StatusBar />
      <ScrollView
        style={[st.f1, st.w100, st.h100, st.bgBlue, { paddingTop: insets.top }]}
      >
        <Flex style={[st.mt1, st.mb4]}>
          <Flex align="center" justify="center">
            <Flex
              style={[st.br5, st.bgOffBlue, st.p4, st.w(st.fullWidth - 100)]}
            >
              <Text style={[st.white, st.fs16, st.tac]}>
                {t('modal:welcomeTo')}{ adventure.journey_invite.name || adventure.name || ''}!
              </Text>
            </Flex>
            <Flex
              align="start"
              justify="start"
              style={[st.w(st.fullWidth - 100)]}
            >
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                slant="down"
                flip={true}
                style={[st.rotate(90), st.mt(-6)]}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={[]}>
          <Flex
            direction="row"
            wrap="wrap"
            align="end"
            justify="end"
            style={[st.w(st.fullWidth - 20)]}
          >
            {messengers.slice(0, 5).map((messenger, index) => (
              <Flex
                key={messenger.id}
                direction="column"
                align="center"
                style={[
                  st.bgOffBlue,
                  st.pd5,
                  st.m5,
                  {
                    width: index === 0 ? largeBox : smallBox,
                    height: index === 0 ? largeBox : smallBox,
                    marginRight: 15,
                  },
                ]}
              >
                {!messenger.avatar ? (
                  <Flex align="center" justify="center" style={[st.pt3]}>
                    <VokeIcon
                      name="person"
                      size={80}
                    />
                  </Flex>
                ) : (
                  <Image
                    resizeMode="contain"
                    source={{ uri: messenger.avatar.medium }}
                    style={[
                      {
                        height: index === 0 ? largeCircle : smallCircle,
                        width: index === 0 ? largeCircle : smallCircle,
                        borderRadius:
                          index === 0 ? largeCircle / 2 : smallCircle / 2,
                        borderWidth: 2,
                        borderColor: st.colors.white,
                      },
                    ]}
                  />
                )}

                <Text style={[st.fs5, st.white, st.tac]}>
                  {messenger.first_name}
                </Text>
              </Flex>
            ))}
            <Flex
              direction="column"
              align="center"
              style={[
                st.bgOrange,
                st.pd5,
                st.m5,
                {
                  width: smallBox,
                  height: smallBox,
                },
              ]}
            >
              <Touchable onPress={handleJoinGroup}>
                <>
                  <Flex justify="end">
                    <Image
                      resizeMode="contain"
                      source={{ uri: me.avatar.medium }}
                      style={[
                        {
                          height: st.fullWidth / 2 - 140,
                          width: st.fullWidth / 2 - 140,
                          borderRadius: (st.fullWidth / 2 - 140) / 2,
                        },
                      ]}
                    />
                  </Flex>
                  <Flex
                    direction="row"
                    align="center"
                    justify="between"
                    value={1}
                    self="stretch"
                  >
                    <Text
                      style={[
                        st.white,
                        st.tal,
                        { fontSize: st.isAndroid ? 16 : 20, maxWidth: 80 },
                      ]}
                    >
                      {t('joinGroup')}
                    </Text>
                    <VokeIcon
                      name="arrow-left2"
                      size={40}
                      style={{transform: [{ rotate: '180deg'}]}}
                    />
                  </Flex>
                </>
              </Touchable>
            </Flex>
          </Flex>
        </Flex>
        {hasMoreMembers ? (
          <Flex align="center" self="stretch">
            <Button
              onPress={() =>
                navigation.navigate('AllMembersModal', {
                  adventure,
                  isJoined: false,
                })
              }
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
                <Text style={[st.white, st.fs16]}>{t('allMembers')}</Text>
              </Flex>
            </Button>
          </Flex>
        ) : null}
      </ScrollView>
    </>
  );
}

export default GroupModal;
