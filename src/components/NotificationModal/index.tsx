import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useDispatch } from 'react-redux';
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

import NotificationGraphic from '../../assets/graphic-allownotifications.png';
const NotificationModal = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const me = useSelector(({ auth }: RootState) => auth.user);
  // Current premissions status stroed in
  // store.info.pushNotificationPermission
  const { pushNotificationPermission } = useSelector(({ info }: RootState) => info);
  // Ignore component if permissions already granted.
  if ( pushNotificationPermission === 'granted') {
    return <></>;
  }

  return (
    <Modal backdropOpacity={0.9}>
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
          onPress={ () =>{ return dispatch(requestPremissions()) } }
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
          onPress={() => setModalOpen(false)}
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