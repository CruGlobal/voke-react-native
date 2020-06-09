import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
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
                  onPress={() =>
                    navigation.navigate('AdventureName', {
                      item,
                      withGroup: false,
                    })
                  }/>
                <ActionButton
                  text="Go with a group"
                  icon="group"
                  onPress={() =>
                    navigation.navigate('AdventureName', {
                      item,
                      withGroup: true,
                    })
                  }/>
                {soloStarted ? null : (
                  <ActionButton text="Go by myself" icon="person" onPress={startByMyself}/>
                )}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      )}
    </Flex>
  );
}

export default AdventureAvailable;
