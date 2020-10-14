import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, View } from 'react-native';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import HeaderSpacer from '../../components/HeaderSpacer';
import st from '../../st';
import theme from '../../theme';
import Button from '../../components/Button';
import Touchable from '../../components/Touchable';
import VokeIcon from '../../components/VokeIcon';
import DEFAULT_AVATAR from '../../assets/defaultAvatar.png';
import { deleteMember, getMyAdventure } from '../../actions/requests';

import styles from './styles';

function AllMembersModal(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.user);
  const { adventure, isJoined } = props.route.params;
  const adventureId = props.route.params.adventure.messenger_journey_id;
  const allMessengers = adventure?.conversation?.messengers || [];

  const [messengers, setMessengers] = useState([]);
  const [isLeaderView, setIsLeaderView] = useState(false);

  const smallCircle = st.fullWidth / 2 - 90;

  const handleJoinGroup = (): void => {
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    });
  };

  useEffect(() => {
    setMessengers(allMessengers.filter(i => i.first_name !== 'VokeBot'));
  }, [allMessengers.length]);

  useEffect(() => {
    setIsLeaderView(
      messengers.find(i => i.id == me.id && i.group_leader) || false,
    );
  }, [messengers.length]);

  useEffect(() => {
    // Set title dynamically.
    navigation.setOptions({
      title: adventure.journey_invite.name || adventure.name || '',
    });
  }, []);

  const onDeleteMember = async ({ adventure, messenger }) => {
    const result = await dispatch(
      deleteMember({
        conversationId: adventure.conversation.id,
        messengerId: messenger.id,
      }),
    );

    if (result['blocked?']) {
      // Remove element instantly
      // without waiting for an adventure update from the server.
      messengers.splice(
        messengers.findIndex(i => i.id == messenger.id),
        1,
      );
      setMessengers(messengers => messengers.splice(0, messengers.length));
      // Update current adventure to reflect changes.
      dispatch(getMyAdventure(adventure.id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HeaderSpacer />
      <ScrollView>
        <Flex style={[st.mb4]}>
          <Flex align="center" justify="center">
            <Flex align="center" self="stretch">
              {isJoined ? (
                <>
                  <Flex align="center" justify="center">
                    <Text style={styles.invite}>
                      {t('inviteCode')}:{' '}
                      <Text style={styles.inviteCode}>
                        {adventure.journey_invite.code}
                      </Text>
                    </Text>
                  </Flex>
                </>
              ) : (
                <Button
                  onPress={handleJoinGroup}
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
                    <Text style={[st.white, st.fs16]}>{t('joinGroup')}</Text>
                  </Flex>
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={styles.members}>
          <Flex direction="row" wrap="wrap" justify="center">
            {messengers.map((messenger, index) => (
              <View
                style={
                  messenger.group_leader
                    ? styles.adminOuter
                    : styles.memberOuter
                }
              >
                <Flex
                  key={messenger.id}
                  direction="column"
                  style={
                    messenger.group_leader
                      ? styles.adminInner
                      : styles.memberInner
                  }
                  /* style={[
                  messenger.group_leader ? st.bgDarkBlue : st.bgOffBlue,
                  st.pd5,
                  st.m5,
                  {
                    width: messenger.group_leader ? leaderBox : smallBox,
                    height: messenger.group_leader ? leaderBox : smallBox,
                    marginRight: 15,
                  },
                ]} */
                >
                  {isLeaderView && !messenger.group_leader ? (
                    <Touchable
                      style={styles.iconDeleteBlock}
                      //TODO: Hook up Remove
                      onPress={() => {
                        onDeleteMember({ adventure, messenger });
                      }}
                    >
                      <VokeIcon
                        name="close-circle"
                        size={34}
                        style={styles.iconDelete}
                      />
                    </Touchable>
                  ) : null}

                  {!messenger.avatar ? (
                    <Flex align="center" justify="center" style={[st.pt3]}>
                      <Image
                        resizeMode="contain"
                        source={DEFAULT_AVATAR}
                        style={{
                          height: smallCircle,
                          width: smallCircle,
                          borderRadius: smallCircle / 2,
                          borderWidth: st.isAndroid || index !== 0 ? 1 : 2,
                          borderColor: st.colors.white,
                        }}
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
                          borderWidth: 2,
                          borderColor: st.colors.white,
                        },
                      ]}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: theme.fontSizes.l,
                      paddingTop: 3,
                      color: theme.colors.white,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {messenger.first_name}
                  </Text>
                </Flex>
              </View>
            ))}
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AllMembersModal;
