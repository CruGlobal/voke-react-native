import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { Alert } from 'react-native';
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

const NotificationBanner = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation('notifications' );
  const [modalOpen, setModalOpen] = useState(false);
  const me = useSelector(({ auth }: RootState) => auth.user);
  // Current premissions status stroed in
  // store.info.pushNotificationPermission
  const { pushNotificationPermission } = useSelector(({ info }: RootState) => info);
  // Ignore component if permissions already granted.
  if ( pushNotificationPermission === 'granted') {
    return <></>;
  }


  const toggleModal = () => {
    dispatch({
      type: REDUX_ACTIONS.TOGGLE_NOTIFICATION_REQUEST,
      // props: true,
      description: 'Show notification request modal. Called from NotificationBanner.toggleModal()'
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
          {t('off')}
        </Text>

        <Button
          isAndroidOpacity
          onPress={() => toggleModal()}
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
        >
          <Text style={{ color: theme.colors.white, fontSize: 18 }}>
            {t('turnOn')}
          </Text>
        </Button>
      </Flex>
    </>
  );
}

export default NotificationBanner;
