import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, Text, View } from 'react-native';
import Image from 'react-native-scalable-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Modalize } from 'react-native-modalize';
import Flex from 'components/Flex';
import OldButton from 'components/OldButton';
import BotTalking from 'components/BotTalking';
import ChatExample from 'src/assets/ChatExample.png';
import VideoExample from 'src/assets/VideoExample.png';
import InviteCodeExample from 'src/assets/InviteCodeExample2.png';
import GroupWelcomeExample from 'src/assets/GroupWelcomeExample.png';
import ModalSharingCode from 'src/assets/ModalSharingCode.png';
import ModalSharingLink from 'src/assets/ModalSharingLink.png';
import ModalSharingNotification from 'src/assets/ModalSharingNotification.png';
import ModalSharingPersonalize from 'src/assets/ModalSharingPersonalize.png';
import theme from 'utils/theme';
import { REDUX_ACTIONS } from 'utils/constants';
import st from 'utils/st';
import { RootState } from 'reducers';

import { requestPremissions } from '../../../actions/auth';

export default function CustomModal(props: any): React.ReactElement {
  // const AccountForgotPassword: React.FC = (): React.ReactElement => {
  const modalizeRef = useRef<Modalize>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation('modal');
  // const { modalId, primaryAction } = props.route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    modalId,
    primaryAction,
    modalTopOffset = 140,
    onClose = () => {},
  } = props;
  // Current user tutorial mode status stored in
  // store.info.groupTutorialCount
  const { duoTutorialCount, groupTutorialCount, tutorialMode } = useSelector(
    ({ info }: RootState) => info,
  );
  const withGroup = props.group === 'withGroup' ? true : false;
  const { pushNotificationPermission, notificationsRequest } = useSelector(
    ({ info }: RootState) => info,
  );
  const me = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    if (modalId) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [modalId]);

  useEffect(() => {
    if (modalOpen) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
      onClose();
    }
  }, [modalOpen]);

  const navigateToNextScreen = () => {
    const { item } = props;
    navigation.navigate('AdventureName', {
      item,
      withGroup: withGroup,
    });
  };

  const updateCountDown = () => {
    if (withGroup) {
      const countdown = groupTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_GROUP,
        groupTutorialCount: countdown,
        description:
          'Tutorial Countdown group updated. Called from TipsModal.updateCountDown()',
      });
    } else {
      const countdown = duoTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_DUO,
        duoTutorialCount: countdown,
        description:
          'Tutorial Countdown duo updated. Called from TipsModal.updateCountDown()',
      });
    }
  };

  const toggleModal = () => {
    updateCountDown();
  };

  const handleGetStarted = () => {
    toggleModal();
    updateCountDown();
    navigateToNextScreen();
  };

  const checkNotificationsPopupVisibility = () => {
    // If notifications enabled close modal.
    if (
      modalId === 'notifications' &&
      pushNotificationPermission === 'granted'
    ) {
      props.navigation.goBack(null);
      // props.navigation.popToTop(); <- don't use this as it will send user
      // to my adventures screen when back from the settings to enable notifications
    }
  };

  useEffect(() => {
    checkNotificationsPopupVisibility();
    return () => {
      /* cleanup */
    };
  }, [pushNotificationPermission]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:
      checkNotificationsPopupVisibility(); // TODO: Verify how closure affects it?
      return (): void => {
        // When the screen is unfocused:
      };
    }, []),
  );

  return (
    <Modalize
      ref={modalizeRef}
      modalTopOffset={140}
      handlePosition={'inside'}
      openAnimationConfig={{
        timing: { duration: 300 },
      }}
      onClose={() => {
        setModalOpen(false);
      }}
      rootStyle={{
        elevation: 5, // need it here to solve issue with button shadow.
      }}
      modalStyle={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <View>
        {/* // HOW DUO and GROUP WORKS */}
        {(modalId === 'howDuoWorks' || modalId === 'howGroupsWork') && (
          <ScrollView bounces={false} scrollIndicatorInsets={{ right: 1 }}>
            <Flex
              style={{ justifyContent: 'space-between', width: '100%' }}
              direction="column"
              align="center"
            >
              <BotTalking
                type="overlay"
                heading={
                  modalId === 'howDuoWorks'
                    ? t('howDuoWorksBotTitle')
                    : t('howGroupsWorkBotTitle')
                }
              >
                {modalId === 'howDuoWorks'
                  ? t('howDuoWorksBotBody')
                  : t('howGroupsWorkBotBody')}
              </BotTalking>
              <Flex value={1} style={{ marginTop: -15 }}>
                <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.bgBlue,
                    st.mb4,
                    st.br6,
                    st.w(st.fullWidth - 120),
                  ]}
                  onPress={primaryAction}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('getStarted')}</Text>
                  </Flex>
                </OldButton>
                {/* <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.mb3,
                    st.br6,
                    st.w(st.fullWidth - 120),
                    st.bw1,
                    {borderColor: "white"}
                  ]}
                  onPress={() => toggleModal()}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('cancel')}</Text>
                  </Flex>
                </OldButton> */}
              </Flex>
              <View style={{ minHeight: theme.spacing.xl }} />
              <Flex align="center" justify="center">
                <Text
                  style={{
                    fontSize: 24,
                    paddingHorizontal: 25,
                    paddingVertical: 8,
                    color: 'white',
                  }}
                >
                  {modalId === 'howDuoWorks'
                    ? t('howDuoWorksTitle')
                    : t('howGroupsWorkTitle')}
                </Text>
                <View style={{ minHeight: theme.spacing.l }} />

                {modalId === 'howDuoWorks' ? (
                  <>
                    {/* DUO */}
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginVertical: 10, marginHorizontal: 20 }}
                    >
                      <Image width={130} source={VideoExample} />
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howItWorksWatch')}
                      </Text>
                    </Flex>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howDuoWorksChat')}
                      </Text>
                      <Image width={130} source={ChatExample} />
                    </Flex>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginTop: 20 }}
                    >
                      <Image width={130} source={InviteCodeExample} />
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howDuoWorksShare')}
                      </Text>
                    </Flex>
                  </>
                ) : (
                  <>
                    {/* GROUP */}
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginVertical: 10, marginHorizontal: 20 }}
                    >
                      <Image width={130} source={VideoExample} />
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howItWorksWatch')}
                      </Text>
                    </Flex>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howGroupsWorkChat')}
                      </Text>
                      <Image width={130} source={ChatExample} />
                    </Flex>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginTop: 20 }}
                    >
                      <Image width={130} source={GroupWelcomeExample} />
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howGroupsWorkLimit')}
                      </Text>
                    </Flex>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          paddingHorizontal: 25,
                          paddingVertical: 4,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {t('howGroupsWorkShare')}
                      </Text>
                      <Image width={130} source={InviteCodeExample} />
                    </Flex>
                  </>
                )}
                <View style={{ minHeight: theme.spacing.l }} />
                <Text
                  style={{
                    fontSize: 20,
                    paddingHorizontal: 25,
                    paddingVertical: 25,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {modalId === 'howDuoWorks'
                    ? t('howDuoWorksStart')
                    : t('howGroupsWorkStart')}
                </Text>
                <View style={{ minHeight: theme.spacing.l }} />
                <Flex>
                  <OldButton
                    isAndroidOpacity={true}
                    style={[
                      st.pd4,
                      st.bgBlue,
                      st.mb4,
                      st.br6,
                      st.w(st.fullWidth - 120),
                    ]}
                    onPress={() => primaryAction()}
                  >
                    <Flex direction="row" align="center" justify="center">
                      <Text style={[st.white, st.fs20]}>{t('getStarted')}</Text>
                    </Flex>
                  </OldButton>
                  <View style={{ minHeight: theme.spacing.xxl }} />
                  {/* <OldButton
                    isAndroidOpacity={true}
                    style={[
                      st.pd4,
                      st.mb1,
                      st.br6,
                      st.w(st.fullWidth - 120),
                      st.bw1,
                      {borderColor: "white"}
                    ]}
                    onPress={() => toggleModal()}
                    >
                    <Flex direction="row" align="center" justify="center">
                      <Text style={[st.white, st.fs20]}>{t('cancel')}</Text>
                    </Flex>
                  </OldButton> */}
                </Flex>
              </Flex>
            </Flex>
          </ScrollView>
        )}
        {modalId === 'howSharingWorks' && (
          <ScrollView bounces={false} scrollIndicatorInsets={{ right: 1 }}>
            <Flex
              style={{ justifyContent: 'space-between', width: '100%' }}
              direction="column"
              align="center"
            >
              <BotTalking
                type="overlay"
                /* heading={
                  t('howSharingWorks')
                } */
              >
                {t('howSharingWorksBotBody')}
              </BotTalking>
              <Flex value={1} style={{ marginTop: -15 }}>
                {/* <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.bgBlue,
                    st.mb4,
                    st.br6,
                    st.w(st.fullWidth - 120),
                  ]}
                  onPress={() => primaryAction()}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('getStarted')}</Text>
                  </Flex>
                </OldButton> */}
                {/* <OldButton
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.mb3,
                    st.br6,
                    st.w(st.fullWidth - 120),
                    st.bw1,
                    {borderColor: "white"}
                  ]}
                  onPress={() => toggleModal()}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('cancel')}</Text>
                  </Flex>
                </OldButton> */}
              </Flex>
              <View style={{ minHeight: theme.spacing.xl }} />
              <Flex align="center" justify="center">
                <>
                  {/* GROUP */}
                  <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    style={{ marginVertical: 10, marginHorizontal: 20 }}
                  >
                    <Image width={130} source={ModalSharingLink} />
                    <Text
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 25,
                        paddingVertical: 4,
                        color: 'white',
                        width: '60%',
                      }}
                    >
                      {t('howSharingWorksLink')}
                    </Text>
                  </Flex>
                  <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    style={{ marginTop: 20 }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 25,
                        paddingVertical: 4,
                        color: 'white',
                        width: '60%',
                      }}
                    >
                      {t('howSharingWorksPersonalize')}
                    </Text>
                    <Image width={130} source={ModalSharingPersonalize} />
                  </Flex>
                  <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    style={{ marginTop: 20 }}
                  >
                    <Image width={130} source={ModalSharingNotification} />
                    <Text
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 25,
                        paddingVertical: 4,
                        color: 'white',
                        width: '60%',
                      }}
                    >
                      {t('howSharingWorksLetYouKnow')}
                    </Text>
                  </Flex>
                  <Flex
                    direction="row"
                    align="center"
                    justify="center"
                    style={{ marginTop: 20 }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 25,
                        paddingVertical: 4,
                        color: 'white',
                        width: '60%',
                      }}
                    >
                      {t('howSharingWorksLinkAccess')}
                    </Text>
                    <Image width={130} source={ModalSharingCode} />
                  </Flex>
                </>
                {/* <View style={{minHeight:theme.spacing.l}} /> */}
                {/* <Text style={{
                  fontSize: 20,
                  paddingHorizontal: 25,
                  paddingVertical: 25,
                  color: 'white',
                  textAlign:"center"
                  }}>{modalId === 'howDuoWorks' ?
                  t('howDuoWorksStart') :
                  t('howGroupsWorkStart')}</Text> */}
                <View style={{ minHeight: theme.spacing.xxl }} />
                <Flex>
                  <OldButton
                    isAndroidOpacity={true}
                    style={[
                      st.pd4,
                      st.bgBlue,
                      st.mb4,
                      st.br6,
                      st.w(st.fullWidth - 120),
                    ]}
                    onPress={() => {
                      onClose();
                      // props.navigation.popToTop(); // Reset all modal of modal stacks. (this is available since 1.0.0 I think).
                      // props.navigation.goBack(null) // Then close modal itself to display the main app screen nav.
                    }}
                  >
                    <Flex direction="row" align="center" justify="center">
                      <Text style={[st.white, st.fs20]}>{t('gotIt')}</Text>
                    </Flex>
                  </OldButton>
                  <View style={{ minHeight: theme.spacing.xxl }} />
                </Flex>
              </Flex>
            </Flex>
          </ScrollView>
        )}
        {modalId === 'notifications' &&
          pushNotificationPermission !== 'granted' && (
            <Flex
              style={{ justifyContent: 'space-between', width: '100%' }}
              direction="column"
              align="center"
            >
              <BotTalking type="reverse">
                {t('overlays:playUkulele', { name: me.firstName })}
              </BotTalking>
              <OldButton
                isAndroidOpacity
                style={[
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: theme.spacing.m,
                    paddingVertical: theme.spacing.m,
                    width: 250,
                    marginBottom: 10,
                    marginTop: 10,
                  },
                ]}
                onPress={() => {
                  // toggleModal();
                  return dispatch(requestPremissions());
                }}
                testID={'ctaAllowNotifications'}
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
              </OldButton>

              <OldButton
                isAndroidOpacity
                style={[
                  {
                    alignSelf: 'flex-end',
                    alignContent: 'center',
                    borderColor: theme.colors.white,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: theme.spacing.m,
                    paddingVertical: theme.spacing.m,
                    width: 250,
                    marginBottom: 10,
                    marginTop: 10,
                  },
                ]}
                onPress={() => {
                  onClose();
                  // props.navigation.popToTop()
                }}
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
              </OldButton>
            </Flex>
          )}
      </View>
    </Modalize>
  );
}
