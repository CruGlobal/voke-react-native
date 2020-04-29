import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Alert } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';
import BotTalking from '../BotTalking';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

function NotificationBanner() {
  const [isVisible, setVisible] = useState(false);
  const me = useSelector(({ auth }: RootState) => auth.user);

  //NotificationModal
  const notificationModal = (
    <Modal isVisible={isVisible} backdropOpacity={0.9}>
      <Flex
        style={{ justifyContent: 'space-between', width: '100%' }}
        direction="column"
        align="center"
      >
        <Flex>
          <BotTalking type="reverse">
            {`${me.firstName}, I play my ukelele when your friends start watching the videos you share, and I let you know. But first, I need your permission to send notifications.`}
          </BotTalking>
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
          onPress={() => setVisible(false)}
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

  return (
    <>
      {notificationModal}
      <Flex
        direction="row"
        style={{ padding: 15, backgroundColor: '#000', height: 60 }}
        align="start"
      >
        <VokeIcon
          name="notification"
          style={[
            st.mt6,
            st.mr4,
            { fontSize: 22, color: theme.colors.primary },
          ]}
        />
        <Text style={[st.mt7, { color: theme.colors.white, fontSize: 18 }]}>
          Notifications turned off.
        </Text>

        <Button
          isAndroidOpacity
          style={[
            st.ml2,
            {
              alignSelf: 'flex-end',
              borderColor: theme.colors.primary,
              borderWidth: 2,
              borderRadius: 32,
              paddingRight: 15,
              paddingLeft: 15,
            },
          ]}
          onPress={() => setVisible(true)}
        >
          <Text style={{ color: theme.colors.white, fontSize: 18 }}>
            Turn On
          </Text>
        </Button>
      </Flex>
    </>
  );
}

export default NotificationBanner;
