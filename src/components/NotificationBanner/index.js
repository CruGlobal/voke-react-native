import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Image from '../Image';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import Touchable from '../Touchable';
import { momentUtc } from '../../utils';
import DateComponent from '../DateComponent';
import VokeIcon from '../VokeIcon';
import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../../constants';
import theme from '../../theme';

function renderText(item) {
  const notification = item;

  if (!notification || !notification.content) return null;
  return (
    <Flex
      style={[st.ph4, st.pv5, st.br5, st.ml0, st.bgWhite]}
      direction="row"
      align="center"
      justify="start"
    >
      <Text selectable style={[st.fs16, st.lh(22), st.blue]}>
        {notification.content}
      </Text>
    </Flex>
  );
}
function NotificationBanner({ item, onSelectVideo }) {
  const navigation = useNavigation();
  function handleShare() {
    navigation.navigate('AdventureName', {
      item,
      withGroup: false,
      isVideoInvite: true,
    });
  }

  return (
    <>
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
          onPress={() => {}}
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
