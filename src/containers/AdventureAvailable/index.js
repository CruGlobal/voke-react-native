import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Modal from 'react-native-modal'
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import { View, ScrollView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import VokeIcon from '../../components/VokeIcon';
import { RotationGestureHandler } from 'react-native-gesture-handler';
import theme from '../../theme';
import { startAdventure } from '../../actions/requests';
import BotTalking from '../../components/BotTalking'
import Image from 'react-native-scalable-image';

import ChatExample from '../../assets/ChatExample.png';
import VideoExample from '../../assets/VideoExample.png';
import InviteCodeExample from '../../assets/InviteCodeExample.png';
import GroupWelcomeExample from '../../assets/GroupWelcomeExample.png';

function GroupOnboardingModal(props){
return(
<Modal backdropOpacity={0.9} isVisible={props.isVisible} style={{margin:0}}>
      <ScrollView   bounces={false}
          style={ { paddingBottom: props.insets.bottom, paddingTop: props.insets.Top }}>
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
    onPress={() => props.onPressStart()}
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
    onPress={() => props.onPressCancel()}
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
            }}>Then chat with your friend about the video and their answers.</Text>
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
              }}>Share the Link / Adventure Code to the friend you want to join.</Text>
              <Image width={130} source={InviteCodeExample}/>

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
    onPress={() => props.onPressStart()}
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
    onPress={() => props.onPressCancel()}
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
)
}
function DuoOnboardingModal(props){
  return(
    <Modal backdropOpacity={0.9} isVisible={props.isVisible} style={{margin:0}}>
      <ScrollView   bounces={false}
          style={ { paddingBottom: props.insets.bottom, paddingTop: props.insets.Top }}>
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
    onPress={() => props.onPressStart()}
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
    onPress={() => props.onPressCancel()}
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
            }}>How Duo Adventures Work</Text>
  <Flex direction="row" align="center" justify="center" style={{marginVertical:10, marginHorizontal:20}}>
              <Image width={130} source={VideoExample}/>
            <Text style={{
              fontSize: 18,
              paddingHorizontal: 25,
              paddingVertical: 4,
              color: 'white',
              width:"60%"
            }}>Watch each episode, answer the question, and unlock your friend's answers.</Text>
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
    onPress={() => props.onPressStart()}
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
    onPress={() => props.onPressCancel()}
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
  )
}

function ActionButton(props){
  return(
    <Button
    isAndroidOpacity={true}
    style={[
      st.pd4,
      st.br1,
      st.bgBlue,
      st.mb3,
      st.w(st.fullWidth - 50),
    ]}
    onPress={() => props.onPress()}
  >
    <Flex direction="row" align="center" justify="center">
    <VokeIcon
                name={props.icon}
                size={props.icon=="group"?32:26}
                style={{paddingRight:10}} />
  <Text style={[st.white, st.fs20]}>{props.text}</Text>
    </Flex>
  </Button>
  )
}


function AdventureAvailable(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
  const { item, alreadyStartedByMe } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [showGroupTips, setShowGroupTips] = useState(false);
  const [showDuoTips, setShowDuoTips] = useState(false);
  const [soloStarted, setSoloStarted] = useState(alreadyStartedByMe);

  async function startByMyself() {
    try {
      setIsLoading(true);
      const result = await dispatch(
        startAdventure({ organization_journey_id: item.id }),
      );

      setSoloStarted(true);

      navigation.navigate('AdventureActive', {
        adventureId: result.id,
      })
    } catch (e) {
      console.log('Error starting adventure by myself', e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex value={1} style={[st.bgWhite]}>
      <View style={{
        // flex:1,
        height: insets.top,
        backgroundColor: isPortrait && insets.top > 0 ? '#000' : 'transparent',
      }}>
        
        <StatusBar
          animated={true}
          barStyle="light-content"
          translucent={ isPortrait && insets.top > 0 ? false : true } // Android. The app will draw under the status bar.
          backgroundColor="transparent" // Android. The background color of the status bar.
        />
      </View>
      <Video
        onOrientationChange={(orientation: string): void => {
          setIsPortrait( orientation === 'portrait' ? true : false);
        }}
        item={item?.item?.content}
      >
        <Flex direction="column" align="center">
          {/* Call to action overlay to be rendered over the video. */}
          <Text
            style={{
              fontSize: 24,
              paddingHorizontal: 25,
              paddingVertical: 4,
              color: 'white',
            }}
          >
            {item.name}
          </Text>
          <Flex
            style={{
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.8)',
              alignSelf: 'center',
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: 10,
                textAlign: 'center',
                color: 'white',
              }}
            >
              Watch Trailer
            </Text>
          </Flex>
        </Flex>
      </Video>
      {isPortrait && (
        <ScrollView
          bounces={false}
          style={ { paddingBottom: insets.bottom }}
        >
          <Flex style={[st.pd3]}>
            <Text style={[st.fs2]}>{item.name}</Text>
            <Text style={[st.pt5, st.charcoal]}>
              {item.total_steps}-{'part series'}
            </Text>
            <Text style={[st.charcoal, st.pv4]}>{item.description}</Text>
          </Flex>
          <Flex justify="end" style={[st.bgWhite]}>
            <Text style={[st.fs3, st.pb5, st.ml2]}>
              {'Who can you take with you?'}
            </Text>
            <Flex
              style={{
                borderBottomColor: theme.colors.secondary,
                borderBottomWidth: 2,
                width:140,
                marginLeft: 30
              }}
            />
            <Flex direction="row" justify="center" style={[st.w100, st.mt4]}>
              <Flex value={1} align="center">
                <ActionButton
                  text="Go with a friend"
                  icon="couple"
                  onPress={() => setShowDuoTips(true)

                    // navigation.navigate('AdventureName', {
                    //   item,
                    //   withGroup: false,
                    // })
                  }/>
                <ActionButton
                  text="Go with a group"
                  icon="group"
                  onPress={() => setShowGroupTips(true)

                    // navigation.navigate('AdventureName', {
                    //   item,
                    //   withGroup: true,
                    // })
                  }/>
                {soloStarted ? null : (
                  <ActionButton text="Go by myself" icon="person" onPress={startByMyself}/>
                )}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      )}
      <GroupOnboardingModal isVisible={showGroupTips} insets={insets} onPressCancel={()=>setShowGroupTips(false)} onPressStart={()=> navigation.navigate('AdventureName', {
                      item,
                      withGroup: true,
                    })}/>
      <DuoOnboardingModal isVisible={showDuoTips} insets={insets}  onPressCancel={()=>setShowDuoTips(false)}  onPressStart={()=>  navigation.navigate('AdventureName', {
                      item,
                      withGroup: false,
                    })}/>

    </Flex>
  );
}

export default AdventureAvailable;
