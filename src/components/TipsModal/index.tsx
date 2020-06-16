import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useDispatch } from 'react-redux';
import {ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import theme from '../../theme';
import BotTalking from '../BotTalking';
import Image from 'react-native-scalable-image';
import { useNavigation } from '@react-navigation/native';

import { REDUX_ACTIONS } from '../../constants';

import ChatExample from '../../assets/ChatExample.png';
import VideoExample from '../../assets/VideoExample.png';
import InviteCodeExample from '../../assets/InviteCodeExample.png';
import GroupWelcomeExample from '../../assets/GroupWelcomeExample.png';

const TipsModal = (props: { group: any; item:any }): React.ReactElement => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Current user tutorial mode status stored in
  // store.info.groupTutorialCount
  const {duoTutorialCount, groupTutorialCount, tutorialMode } = useSelector(({ info }: RootState) => info);
  const withGroup = (props.group==='withGroup')? true: false;

  console.log("props-------", props)

  console.log("DUO-------", duoTutorialCount)
  console.log("GROUP-------", groupTutorialCount)


  const navigateToNextScreen=()=>{
    let item =props.item;
    navigation.navigate('AdventureName', {
      item,
      withGroup: withGroup,
    })
  }


  const updateCountDown=()=>{
    if(withGroup){
      let countdown =  groupTutorialCount+1
    dispatch({
      type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_GROUP,
      groupTutorialCount: countdown,
      description: 'Tutorial Countdown group updated. Called from TipsModal.updateCountDown()'
    });
  }else{
  let countdown= duoTutorialCount +1
  dispatch({
    type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_DUO,
    duoTutorialCount: countdown,
    description: 'Tutorial Countdown duo updated. Called from TipsModal.updateCountDown()'
  });
  }
}

  const toggleModal = () => {
    dispatch({
      type: REDUX_ACTIONS.TOGGLE_TIPS,
      description: 'Show Tips Modal. Called from TipsModal.toggleModal()'
    });
    updateCountDown();
  }

  const handleGetStarted=()=>{
    toggleModal();
    updateCountDown();
    navigateToNextScreen()
  }


if (withGroup){
  return (
<Modal backdropOpacity={0.9} isVisible={tutorialMode} style={{margin:0}}>
      <ScrollView   bounces={false}
          // style={ { paddingBottom: props.insets.bottom, paddingTop: props.insets.Top }}>
          >
    <Flex
      style={{ justifyContent: 'space-between', width: '100%' }}
      direction="column"
      align="center"
    >
    <BotTalking type="overlay" heading="Welcome to Groups!"> 
    Learn more about how they work below, or get started right away.</BotTalking>
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
    onPress={() => handleGetStarted()}
  >
    <Flex direction="row" align="center" justify="center">

  <Text style={[st.white, st.fs20]}>Get Started</Text>
    </Flex>
  </Button>
  <Button
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

  <Text style={[st.white, st.fs20]}>Cancel</Text>
    </Flex>
  </Button>
  </Flex>
  <Flex align="center" justify="center">
  <Text style={{
              fontSize: 24,
              paddingHorizontal: 25,
              paddingVertical: 8,
              color: 'white',
              marginTop:10
            }}>How Groups Work</Text>
  <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
              <Image width={130} source={VideoExample}/>
            <Text style={{
              fontSize: 18,
              paddingHorizontal: 25,
              paddingVertical: 4,
              color: 'white',
              width:"60%"
            }}>Watch each episode, answer the question, and unlock your friends’ answers.</Text>
            </Flex>
            <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
            <Text style={{
              fontSize: 18,
              paddingHorizontal: 25,
              paddingVertical: 4,
              color: 'white',
              width:"60%"
            }}>Then chat with your friends about the video and their answers.</Text>
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
              }}>You can have up to 20 members in your Voke Group.</Text>
              </Flex>
            <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
              <Text style={{
                fontSize: 18,
                paddingHorizontal: 25,
                paddingVertical: 4,
                color: 'white',
                width:"60%"
              }}>Share the Link / Adventure Code to the friends you want to join.</Text>
              <Image width={130} source={InviteCodeExample}/>

              </Flex>
              <Text style={{
              fontSize: 20,
              paddingHorizontal: 25,
              paddingVertical: 25,
              color: 'white',
              textAlign:"center"
            }}>Hit ‘Get Started’ if you’re ready to start your Group.</Text>    
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
    onPress={() => handleGetStarted()}
  >
    <Flex direction="row" align="center" justify="center">

  <Text style={[st.white, st.fs20]}>Get Started</Text>
    </Flex>
  </Button>
  <Button
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

  <Text style={[st.white, st.fs20]}>Cancel</Text>
    </Flex>
  </Button>
  </Flex>  
  </Flex>
      </Flex>
      </ScrollView>
      </Modal>
);
  }
  return (
    <Modal backdropOpacity={0.9} isVisible={tutorialMode} style={{margin:0}}>
          <ScrollView   bounces={false}
              // style={ { paddingBottom: props.insets.bottom, paddingTop: props.insets.Top }}>
              >
        <Flex
          style={{ justifyContent: 'space-between', width: '100%' }}
          direction="column"
          align="center"
        >
        <BotTalking type="overlay" heading="Welcome to Duo Adventures!"> 
        Learn more about it works, or get started right away.</BotTalking>
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
        onPress={() => handleGetStarted()}
      >
        <Flex direction="row" align="center" justify="center">
    
      <Text style={[st.white, st.fs20]}>Get Started</Text>
        </Flex>
      </Button>
      <Button
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
    
      <Text style={[st.white, st.fs20]}>Cancel</Text>
        </Flex>
      </Button>
      </Flex>
      <Flex align="center" justify="center">
      <Text style={{
                  fontSize: 24,
                  paddingHorizontal: 25,
                  paddingVertical: 8,
                  color: 'white',
                  marginTop:10
                }}>How Duo Works</Text>
      <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
                  <Image width={130} source={VideoExample}/>
                <Text style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width:"60%"
                }}>Watch each episode, answer the question, and unlock your friends’ answers.</Text>
                </Flex>
                <Flex direction="row" align="center" justify="center" style={{marginTop:20}}>
                <Text style={{
                  fontSize: 18,
                  paddingHorizontal: 25,
                  paddingVertical: 4,
                  color: 'white',
                  width:"60%"
                }}>Then chat with your friend about the video and their answers.</Text>
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
                  }}>Share the Link / Adventure Code to the friend you want to join.</Text>
                  </Flex>
                  <Text style={{
                  fontSize: 20,
                  paddingHorizontal: 25,
                  paddingVertical: 25,
                  color: 'white',
                  textAlign:"center"
                }}>Hit ‘Get Started’ if you’re ready to start with a friend.</Text>    
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
        onPress={() => handleGetStarted()}
      >
        <Flex direction="row" align="center" justify="center">
    
      <Text style={[st.white, st.fs20]}>Get Started</Text>
        </Flex>
      </Button>
      <Button
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
    
      <Text style={[st.white, st.fs20]}>Cancel</Text>
        </Flex>
      </Button>
      </Flex>  
      </Flex>
          </Flex>
          </ScrollView>
          </Modal>
    );
}

export default TipsModal;
