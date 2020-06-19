import React, { useState, useEffect } from 'react';
import { RootState } from '../../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'react-native';
import Modal from 'react-native-modal';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';
import BotTalking from '../BotTalking';
import { requestPremissions } from '../../actions/auth';
import { REDUX_ACTIONS } from '../../constants';

import NotificationGraphic from '../../assets/graphic-allownotifications.png';
import auth from 'src/reducers/auth';
const NotificationModal = (): React.ReactElement => {
  const dispatch = useDispatch();
  // Current premissions status stroed in
  // store.info.pushNotificationPermission
  const { pushNotificationPermission, notificationsRequest } = useSelector(({ info }: RootState) => info);
  // Ignore component if permissions already granted.
  if ( pushNotificationPermission === 'granted') {
    return <></>;
  }
  const me = useSelector(({ auth }) => auth.user);

  const toggleModal = () => {
    dispatch({
      type: REDUX_ACTIONS.TOGGLE_NOTIFICATION_REQUEST,
      // props: true,
      description: 'Show notification request modal. Called from NotificationBanner.openModal()'
    });
  }

  return (
    <Modal backdropOpacity={0.9} isVisible={notificationsRequest}>
      <Flex
        style={{ justifyContent: 'space-between', width: '100%' }}
        direction="column"
        align="center"
      >
        <BotTalking type="reverse">{me.firstName}, I play my Ukulele so you don’t miss out when your friends interact or join your adventures!{'\n'}{'\n'}But first, I need your permission to send you notifications.</BotTalking>
        {/* <Flex>
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
              fontSize: 18,
            }}
          >
            Voke sends notifications when your friends join and interact withthe
            adventures you share, but first we need your permission.
          </Text>
        </Flex> */}

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
          onPress={ () =>{
            toggleModal();
            return dispatch(requestPremissions());
          }}
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
          onPress={() => toggleModal()}
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
}

export default NotificationModal;
