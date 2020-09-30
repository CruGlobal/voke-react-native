import React, { useState } from 'react';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, Alert } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import st from '../../st';
import theme from '../../theme';
import Button from '../../components/Button';

// import { MONTHLY_PRICE } from '../../constants';

import Touchable from '../../components/Touchable';
import VokeIcon from '../../components/VokeIcon';
import DEFAULT_AVATAR from '../../assets/defaultAvatar.png';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import styles from './styles';

function AllMembersModal(props) {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { adventure, isJoined } = props.route.params;
  const adventureId = props.route.params.adventure.messenger_journey_id;
  const allMessengers = adventure.conversation.messengers || [];
  const messengers = allMessengers.filter(
    i => i.first_name !== 'VokeBot',
    // i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
  );
  const isLeaderView = messengers.find(i => i.id == me.id && i.group_leader) || false
  const smallCircle = st.fullWidth / 2 - 90;
  const smallBox = st.fullWidth / 2 - 50;
  const leaderBox = st.fullWidth / 2 - 30;

  const handleJoinGroup = (): void => {
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView>
        <Flex direction="row" align="center">
          <Flex value={1}>
            <Touchable
              style={[st.p5, st.pl4]}
              onPress={() => navigation.goBack()}
            >
              <VokeIcon
                name="chevron-back-outline"
                size={18}
              />
            </Touchable>
          </Flex>
          <Flex value={3}>
            <Text style={[st.white, st.fs18, st.tac]}>
              {adventure.journey_invite.name || adventure.name || ''}
            </Text>
          </Flex>
          <Flex value={1} />
        </Flex>

        <Flex style={[st.mb4]}>
          <Flex align="center" justify="center">
            <Flex align="center" self="stretch">
              {isJoined ? (
                <>
                  <Text style={[st.white, { textAlign: 'center' }]}>
                    {t('inviteCode')}:
                  </Text>
                  <Text style={[st.white, { fontSize: 21, marginTop: -6 }]}>
                    {adventure.journey_invite.code}
                  </Text>
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
        <Flex
          align="center"
          justify="center"
          style={{ paddingBottom: theme.spacing.xl }}
        >
          <Flex direction="row" wrap="wrap" align="end" justify="center">
            {messengers.map((messenger, index) => (
              <Flex
                key={messenger.id}
                direction="column"
                align="center"
                style={[
                  messenger.group_leader ? st.bgDarkBlue : st.bgOffBlue,
                  st.pd5,
                  st.m5,
                  {
                    width: messenger.group_leader ? leaderBox : smallBox,
                    height: messenger.group_leader ? leaderBox : smallBox,
                    marginRight: 15,
                  },
                ]}
              >
                { isLeaderView && !messenger.group_leader?
                  <Touchable style={{ position:'absolute', right:-15, top:-10}}
                  //TODO: Hook up Remove
                    onPress={()=> Alert.alert("Remove Pressed")}> 
                    <VokeIcon name="close-circle" size={34} />
                  </Touchable>
                  :null
                }

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
                    textAlign:'center',
                  }}
                  numberOfLines={1}
                >
                  {messenger.first_name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AllMembersModal;
