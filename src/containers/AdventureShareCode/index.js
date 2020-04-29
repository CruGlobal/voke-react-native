import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import st from '../../st';
import Button from '../../components/Button';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import theme from '../../theme';
import NotificationGraphic from '../../assets/graphic-allownotifications.png';
import { Share, Alert } from 'react-native';

import VOKE_BOT from '../../assets/vokebot_whole.png';
import Touchable from '../../components/Touchable';
import CONSTANTS from '../../constants';

function AdventureShareCode(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true); //Set TO Truue FOR NOW-----PLEASE CHANGE ONCE FUNCTIONALITY IS HOOKED UP

  const { invitation, withGroup, isVideoInvite } = props.route.params;

  //NotificationModal
  const notificationModal = (
    <Modal isVisible={isModalVisible} backdropOpacity={0.9}>
      <Flex
        style={{ justifyContent: 'space-between', width: '100%' }}
        direction="column"
        align="center"
      >
        <Flex>
          <Image
            source={NotificationGraphic}
            style={{
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              color: theme.colors.white,
              textAlign: 'center',
              paddingRight: 20,
              paddingLeft: 20,
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            Voke sends notifications when your friends join and interact withthe
            adventures you share, but first we need your permission.
          </Text>
        </Flex>

        <Button
          isAndroidOpacity
          style={[
            {
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              paddingLeft: 40,
              paddingRight: 40,
              paddingTop: 10,
              height: 50,
              width: 250,
              marginBottom: 10,
              marginTop: 10,
            },
          ]}
          onPress={() => Alert.alert('pressed')}
        >
          <Text
            style={{
              color: theme.colors.white,
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            Allow Notifications
          </Text>
        </Button>

        <Button
          isAndroidOpacity
          style={[
            {
              alignSelf: 'flex-end',
              alignContent: 'center',
              borderColor: theme.colors.white,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 40,
              paddingRight: 40,
              paddingTop: 10,
              height: 50,
              width: 250,
              marginBottom: 10,
              marginTop: 10,
            },
          ]}
          onPress={() => setModalVisible(false)}
        >
          <Text
            style={{
              color: theme.colors.white,
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            No Thanks
          </Text>
        </Button>
      </Flex>
    </Modal>
  );

  function handleShare() {
    Share.share(
      {
        message: isVideoInvite
          ? `Check out this video from Voke! ${invitation.url}`
          : `Download Voke and join my ${invitation.name} Adventure. Use code: ${invitation.code} ${CONSTANTS.APP_URL}`,
      },
      {
        dialogTitle: 'Share',
      },
    ).catch(err => console.log('Share Error', err));
  }

  return (
    <>
      {/* Notification Modal */}
      {notificationModal}

      <StatusBar />
      <Flex
        direction="column"
        justify="start"
        style={[st.w100, st.h100, st.bgBlue, { paddingTop: insets.top }]}
      >
        <Flex direction="column" self="stretch" align="center">
          <Flex self="stretch" align="end">
            <Touchable
              style={[st.p5, st.pr4, st.mb3]}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Adventures' }],
                })
              }
            >
              <Text style={[st.fs18, st.white]}>Done</Text>
            </Touchable>
          </Flex>
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={[st.mb4]}
          >
            <Flex direction="column" align="center" style={[]}>
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5, st.mh3]}>
                <Text style={[st.white, st.fs20, st.tac]}>
                  {withGroup
                    ? `${invitation.name}’s  invite code is ready! Hit Share and choose how you’d like to send this invite code to each of your group members.`
                    : isVideoInvite
                    ? 'Your link is ready! Hit share and choose how you want to send it.'
                    : `${invitation.name}’s invite code is ready! Hit Share and choose how you’d like to send this trailer with ${invitation.name}.`}
                </Text>
              </Flex>
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                slant="down"
                flip
                style={[st.rotate(90), st.mt(-6), st.mr1]}
              />
            </Flex>
            <Flex justify="center" style={[st.pt4]}>
              <Image
                source={VOKE_BOT}
                resizeMode="contain"
                style={[st.w(120), st.h(120)]}
              />
            </Flex>
          </Flex>
          <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            <Text style={[st.fs22, st.white, st.pb4]}>Invite Code:</Text>
            <Touchable>
              <Flex
                style={[
                  st.bw1,
                  st.borderWhite,
                  st.br5,
                  st.bgOffBlue,
                  st.pv5,
                  st.ph2,
                ]}
              >
                <Text style={[st.white, st.fs24]}>
                  {isVideoInvite ? invitation.url : invitation.code}
                </Text>
              </Flex>
            </Touchable>
            <Button
              isAndroidOpacity
              style={[
                st.pd4,
                st.br1,
                st.bgOrange,
                st.w(st.fullWidth - 50),
                st.mt1,
              ]}
              onPress={handleShare}
            >
              <Text style={[st.white, st.fs20, st.tac]}>Share</Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default AdventureShareCode;
