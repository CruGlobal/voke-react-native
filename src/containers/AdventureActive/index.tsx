import React, { useState, useEffect, useCallback } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
// import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';
import { View, ScrollView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { getMyAdventure, getAdventureStepMessages, getAdventureSteps } from '../../actions/requests';
import { setCurrentScreen } from '../../actions/info';
import {
  getCurrentUserId,
} from '../../utils/get';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import AdventureStepCard from '../../components/AdventureStepCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Video from '../../components/Video';
import st from '../../st';
import { TDataState } from '../../types'
import styles from './styles';
import VokeIcon from '../../components/VokeIcon';
import Touchable from '../../components/Touchable';

type AdventureActiveProps = {
  navigation: any,
  route: {
    name: string,
    params: {
      adventureId: string;
    };
  };
};

function AdventureActive({ navigation, route }: AdventureActiveProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const store = useStore()
  const allMessages = store.getState().data.adventureStepMessages;
  const { adventureId } = route.params;
  const adventure = useSelector(({ data }: {data: TDataState}) =>
    data.myAdventures?.byId[adventureId] || {});
  const steps = useSelector(({ data }: {data: TDataState}) =>
    data.adventureSteps[adventureId], shallowEqual)  || {byId:{}, allIds: []};
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isGroup = adventure.kind === 'multiple';
  const allMessengers = adventure.conversation.messengers || [];
  const userId = getCurrentUserId();
  const isLeader = allMessengers.find(m => m.group_leader && m.id == userId ) || false;

  const getPendingAdventure = async () => {
    setIsLoading(true);
    await dispatch(getMyAdventure(adventureId));
    setIsLoading(false);
    getSteps();
  };

  /* useEffect(() => {
    // If adventure wasn't accepted by a friend yet and not started.
    if (Object.keys(adventure).length === 0 ) {
      getPendingAdventure();
    }
    // -- ☝️call to import pending adventure info from the server.
  },[]); */

  const getSteps = async () => {
    await dispatch(getAdventureSteps(adventureId));
  }

  useEffect(() => {
    if (Object.keys(adventure).length > 0 ) {
      getSteps()
    } else {
      getPendingAdventure();
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  },[adventure?.id]);

  // Prefetch data for the next active step and the steps with new messages.
  useEffect(() => {
    for (let [key, step] of Object.entries(steps?.byId)) {
      preFetchStep(step);
    }
  }, [steps?.allIds.length]);

  const preFetchStep = async(step: any) => {
    const existingMessages = allMessages[step?.id] || [];
    if (step?.unread_messages > 0 ||
        (step?.status === 'active' && existingMessages.length > 0 ) ) {
      await dispatch(
        getAdventureStepMessages(adventure.conversation.id, step.id)
      );
    }
  }

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Actions to run when the screen focused:
      // Save current screen and it's parammeters in store.
      dispatch(setCurrentScreen({
        screen: route?.name,
        data: {
          adventureId,
        },
      }));

      return () => {
        // Actions to run when the screen unfocused:
      };
    }, [])
  );

  return (
    <Flex value={1}>
      <View style={{
        // flex:1,
        height: insets.top,
        backgroundColor: isPortrait && insets.top > 0 ? '#000' : 'transparent',
      }}>
        <StatusBar
          animated={true}
          barStyle="light-content"
          translucent={true} // Android. The app will draw under the status bar.
          backgroundColor="transparent" // Android. The background color of the status bar.
        />
      </View>
      <ScrollView
        scrollEnabled={isPortrait? true: false}
        bounces
        style={[
        isPortrait ? st.bgBlue: st.bgDeepBlack,
        { paddingBottom: isPortrait ? insets.bottom : 0 }]}>
        {/* <Flex value={1} direction="row" align="center" justify="center" style={{padding:5}}>
          <Text style={[st.fs18,{ color:'white'}]}>
            {isGroup? adventure.journey_invite.name : adventure.name}
          </Text>
        </Flex> */}
        {isLoading &&
          <ActivityIndicator
            size="large"
            color="rgba(255,255,255,.5)"
            style={{
              paddingTop: 50
            }}
          />}

        { ( !isLoading && Object.keys(adventure).length > 0 ) && (
            <Video
              onOrientationChange={(orientation: string): void => {
                setIsPortrait( orientation === 'portrait' ? true : false);
              }}
              item={adventure?.item?.content}
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
                  {adventure.name}
                </Text>
                <Flex
                  style={{
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    // minWidth: '50%',
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
                    {t('watchTrailer')}
                  </Text>
                </Flex>
              </Flex>
          </Video>
        )}

        {isGroup && isLeader? (<Touchable onPress={ () =>
            navigation.navigate('AdventureManage', {
              adventureId: adventure.id
            })}>
              <Flex direction="row" justify="end" style={{marginTop:10, marginRight:10}}>
                <Text style={{fontSize: 18, marginRight:5, color: 'white', textDecorationLine: 'underline'}}>Manage Group</Text>
                <VokeIcon name="stats-chart-1" size={24}/>
              </Flex>
            </Touchable>):null}

            { ( !isLoading && isPortrait && Object.keys(adventure).length > 0 ) && (
          
          <FlatList
            data={steps.allIds}
            renderItem={({item}): React.ReactElement => (
              item && <AdventureStepCard
                // {...props}
                // step={steps.byId[stepId].item}
                stepId = {item}
                adventureId={adventureId}
                // steps={currentSteps}
                // adventure={adventure} //! !!
              />
            )}
            style={[styles.ListOfSteps]}
            // removeClippedSubviews={true} // vc-1022
          />
        )}
        <Flex value={1} style={{ paddingBottom: insets.bottom }}></Flex>
      </ScrollView>
    </Flex>
  );
}

export default AdventureActive;
