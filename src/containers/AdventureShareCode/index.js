import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Clipboard from "@react-native-community/clipboard";
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import st from '../../st';
import theme from '../../theme';
import Button from '../../components/Button';
import { useFocusEffect } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import { Share, Alert } from 'react-native';

import BotTalking from '../../components/BotTalking';
import Touchable from '../../components/Touchable';
import { toastAction } from '../../actions/info';
import CONSTANTS, { REDUX_ACTIONS } from '../../constants';

function AdventureShareCode(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true); //Set TO Truue FOR NOW-----PLEASE CHANGE ONCE FUNCTIONALITY IS HOOKED UP

  const { invitation, withGroup, isVideoInvite } = props.route.params;

  const handleShare = () => {
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

  const copyToClipboard = () => {
    Clipboard.setString(isVideoInvite ? invitation.url : invitation.code);
    dispatch(toastAction( 'Copied', 'short' ));
  };

  // Events firing when user leaves the screen with player or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      // Ask for notifications permissions.
      dispatch({
        type: REDUX_ACTIONS.TOGGLE_NOTIFICATION_REQUEST,
        // props: true,
        description: 'Show notification request modal. Called from AdventureShareCode.useFocusEffect()'
      });
      return (): void => {
        // When the screen is unfocused:
      };
    }, [])
  );

  return (
    <>
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
              <BotTalking>  {withGroup
                    ? `${invitation.name}’s  invite code is ready! Hit Share and choose how you’d like to send this invite code to each of your group members.`
                    : isVideoInvite
                    ? 'Your link is ready! Hit share and choose how you want to send it.'
                    : `${invitation.name}’s invite code is ready! Hit Share and choose how you’d like to send this trailer with ${invitation.name}.`}
</BotTalking>

          </Flex>
          <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            {isVideoInvite ? <Text style={[st.fs22, st.white, st.pb4]}>Invite Link: </Text>: <Text style={[st.fs22, st.white, st.pb4]}>Invite Code:</Text>}
            <Touchable onPress={copyToClipboard}>
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
                st.white,
                st.mt1,
                st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center",shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.5,
                elevation: 4,
                shadowRadius: 5 ,
                shadowOffset : { width: 1, height: 8}}
              ]}
              onPress={handleShare}
            >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>Share</Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default AdventureShareCode;
