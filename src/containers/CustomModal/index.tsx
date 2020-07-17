import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useDispatch } from 'react-redux';
import {ScrollView, Text, View  } from 'react-native';
import Modal from 'react-native-modal';
import st from '../../st';
import Flex from '../../components/Flex';
// import Text from '../Text';
import Button from '../../components/Button';
import VokeIcon from '../../components/VokeIcon';
import theme from '../../theme';
import BotTalking from '../../components/BotTalking';
import Image from 'react-native-scalable-image';
import { useNavigation } from '@react-navigation/native';
import { requestPremissions } from '../../actions/auth';
import { useFocusEffect } from '@react-navigation/native';

import { REDUX_ACTIONS } from '../../constants';

import ChatExample from '../../assets/ChatExample.png';
import VideoExample from '../../assets/VideoExample.png';
import InviteCodeExample from '../../assets/InviteCodeExample2.png';
import GroupWelcomeExample from '../../assets/GroupWelcomeExample.png';

import ModalSharingCode from '../../assets/ModalSharingCode.png';
import ModalSharingLink from '../../assets/ModalSharingLink.png';
import ModalSharingNotification from '../../assets/ModalSharingNotification.png';
import ModalSharingPersonalize from '../../assets/ModalSharingPersonalize.png';

import { useTranslation } from 'react-i18next';

export default function CustomModal(props:any): React.ReactElement {
  // const AccountForgotPassword: React.FC = (): React.ReactElement => {
  const { t } = useTranslation('modal');
  const { modalId, primaryAction } = props.route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Current user tutorial mode status stored in
  // store.info.groupTutorialCount
  const {duoTutorialCount, groupTutorialCount, tutorialMode } = useSelector(({ info }: RootState) => info);
  const withGroup = (props.group==='withGroup')? true: false;
  const { pushNotificationPermission, notificationsRequest } = useSelector(({ info }: RootState) => info);
  const me = useSelector(({ auth }) => auth.user);

  const navigateToNextScreen=()=>{
    let item =props.item;
    navigation.navigate('AdventureName', {
      item,
      withGroup: withGroup,
    })
  }


  const updateCountDown=()=>{
    if(withGroup) {
      let countdown = groupTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_GROUP,
        groupTutorialCount: countdown,
        description: 'Tutorial Countdown group updated. Called from TipsModal.updateCountDown()'
      });
    } else {
      let countdown = duoTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_DUO,
        duoTutorialCount: countdown,
        description: 'Tutorial Countdown duo updated. Called from TipsModal.updateCountDown()'
      });
    }
  }

  const toggleModal = () => {
    updateCountDown();
  }

  const handleGetStarted=()=>{
    toggleModal();
    updateCountDown();
    navigateToNextScreen()
  }

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen is focused:

      // If notifications enabled close modal.
      if ( (modalId === 'notifications') && ( pushNotificationPermission !== 'granted') ) {
         props.navigation.popToTop()
      }
      return (): void => {
        // When the screen is unfocused:
      };
    }, [])
  );

  return (
    <View /* backdropOpacity={0.9} isVisible={true} style={{margin:0}} */>
      {/* // HOW DUO and GROUP WORKS */}
      {( modalId === 'howDuoWorks' || modalId === 'howGroupsWork' ) &&
        <ScrollView bounces={false}>
          <Flex
            style={{ justifyContent: 'space-between', width: '100%' }}
            direction="column"
            align="center"
          >
            <BotTalking
              type="overlay"
              heading={
                modalId === 'howDuoWorks' ?
                t('howDuoWorksBotTitle') :
                t('howGroupsWorkBotTitle')
              }>
              {
                modalId === 'howDuoWorks' ?
                t('howDuoWorksBotBody') :
                t('howGroupsWorkBotBody')
              }
            </BotTalking>
            <Flex value={1} style={{marginTop:-55}}>
              <Button
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
              </Button>
              {/* <Button
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
              </Button> */}
            </Flex>
            <View style={{minHeight:theme.spacing.xl}} />
            <Flex align="center" justify="center">
              <Text style={{
                  fontSize: 24,
                  paddingHorizontal: 25,
                  paddingVertical: 8,
                  color: 'white',
                  // marginTop:10
              }}>{
                modalId === 'howDuoWorks' ?
                t('howDuoWorksTitle') :
                t('howGroupsWorkTitle')
              }</Text>
              <View style={{minHeight:theme.spacing.l}} />

              { modalId === 'howDuoWorks' ?
                <>{/* DUO */}
                  <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
                    <Image width={130} source={VideoExample}/>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howItWorksWatch')}</Text>
                  </Flex>
                  <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howDuoWorksChat')}</Text>
                    <Image width={130} source={ChatExample}/>
                  </Flex>
                  <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                    <Image width={130} source={InviteCodeExample}/>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howDuoWorksShare')}</Text>
                  </Flex>
                </>:<>
                  {/* GROUP */}
                  <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
                    <Image width={130} source={VideoExample}/>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howItWorksWatch')}</Text>
                  </Flex>
                  <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                    <Text style={{
                        fontSize: 18,
                        paddingHorizontal: 25,
                        paddingVertical: 4,
                        color: 'white',
                        width:"60%"
                      }}>{t('howGroupsWorkChat')}</Text>
                    <Image width={130} source={ChatExample}/>
                  </Flex>
                  <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                    <Image width={130} source={GroupWelcomeExample}/>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howGroupsWorkLimit')}</Text>
                  </Flex>
                  <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                    <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howGroupsWorkShare')}</Text>
                    <Image width={130} source={InviteCodeExample}/>
                  </Flex>
                </>
              }
              <View style={{minHeight:theme.spacing.l}} />
              <Text style={{
                fontSize: 20,
                paddingHorizontal: 25,
                paddingVertical: 25,
                color: 'white',
                textAlign:"center"
                }}>{modalId === 'howDuoWorks' ?
                t('howDuoWorksStart') :
                t('howGroupsWorkStart')}</Text>
              <View style={{minHeight:theme.spacing.l}} />
              <Flex>
                <Button
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
                </Button>
                <View style={{minHeight:theme.spacing.xxl}} />
                {/* <Button
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
                </Button> */}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      }{
        (modalId === 'howSharingWorks') &&
        <ScrollView bounces={false}>
          <Flex
            style={{ justifyContent: 'space-between', width: '100%' }}
            direction="column"
            align="center"
          >
            <BotTalking
              type="overlay"
              /* heading={
                t('howSharingWorks')
              } */>
              {
                 t('howSharingWorksBotBody')
              }
            </BotTalking>
            <Flex value={1} style={{marginTop:-55}}>
              {/* <Button
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
              </Button> */}
              {/* <Button
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
              </Button> */}
            </Flex>
            <View style={{minHeight:theme.spacing.xl}} />
            <Flex align="center" justify="center">
              {/* <Text style={{
                  fontSize: 24,
                  paddingHorizontal: 25,
                  paddingVertical: 8,
                  color: 'white',
                  // marginTop:10
              }}>{
                modalId === 'howDuoWorks' ?
                t('howDuoWorksTitle') :
                t('howGroupsWorkTitle')
              }</Text> */}
              {/* <View style={{minHeight:theme.spacing.l}} /> */}

              <>
                {/* GROUP */}
                <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
                  <Image width={130} source={ModalSharingLink}/>
                  <Text style={{
                    fontSize: 18,
                    paddingHorizontal: 25,
                    paddingVertical: 4,
                    color: 'white',
                    width:"60%"
                  }}>{t('howSharingWorksLink')}</Text>
                </Flex>
                <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                  <Text style={{
                      fontSize: 18,
                      paddingHorizontal: 25,
                      paddingVertical: 4,
                      color: 'white',
                      width:"60%"
                    }}>{t('howSharingWorksPersonalize')}</Text>
                  <Image width={130} source={ModalSharingPersonalize}/>
                </Flex>
                <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                  <Image width={130} source={ModalSharingNotification}/>
                  <Text style={{
                    fontSize: 18,
                    paddingHorizontal: 25,
                    paddingVertical: 4,
                    color: 'white',
                    width:"60%"
                  }}>{t('howSharingWorksLetYouKnow')}</Text>
                </Flex>
                <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                  <Text style={{
                    fontSize: 18,
                    paddingHorizontal: 25,
                    paddingVertical: 4,
                    color: 'white',
                    width:"60%"
                  }}>{t('howSharingWorksLinkAccess')}</Text>
                  <Image width={130} source={ModalSharingCode}/>
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
              <View style={{minHeight:theme.spacing.xxl}} />
              <Flex>
                <Button
                  isAndroidOpacity={true}
                  style={[
                    st.pd4,
                    st.bgBlue,
                    st.mb4,
                    st.br6,
                    st.w(st.fullWidth - 120),
                  ]}
                  onPress={() => {
                    props.navigation.popToTop() // Reset all modal of modal stacks. (this is available since 1.0.0 I think).
                    // props.navigation.goBack(null) // Then close modal itself to display the main app screen nav.
                  }}
                >
                  <Flex direction="row" align="center" justify="center">
                    <Text style={[st.white, st.fs20]}>{t('gotIt')}</Text>
                  </Flex>
                </Button>
                <View style={{minHeight:theme.spacing.xxl}} />
                {/* <Button
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
                </Button> */}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView> 
      }{
        ( (modalId === 'notifications') && ( pushNotificationPermission !== 'granted') ) && <Flex
          style={{ justifyContent: 'space-between', width: '100%' }}
          direction="column"
          align="center"
        >
          <BotTalking type="reverse">{t('overlays:playUkulele', {name: me.firstName})}</BotTalking>
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
              // toggleModal();
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
            onPress={() => props.navigation.popToTop()}
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
      }

    </View>
  );
}
