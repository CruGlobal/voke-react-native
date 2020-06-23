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
import { useTranslation } from 'react-i18next';
const NotificationModal = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation('overlays');
  // Current premissions status stroed in
  // store.info.pushNotificationPermission
  const { pushNotificationPermission, notificationsRequest } = useSelector(({ info }: RootState) => info);
  const me = useSelector(({ auth }) => auth.user);
  // Ignore component if permissions already granted.
  if ( pushNotificationPermission === 'granted') {
    return <></>;
  }

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
        <BotTalking type="reverse">{t('playUkulele', {name: me.firstName})}</BotTalking>
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
            {t('allowNotifications')}
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
            {t('noThanks')}
          </Text>
        </Button>
      </Flex>
    </Modal>
  );
}

export default NotificationModal;
