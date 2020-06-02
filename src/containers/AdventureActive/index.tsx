import React, { useState, useEffect, useCallback } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMyAdventure, getMyAdventures, getAdventureSteps } from '../../actions/requests';
import { setCurrentScreen } from '../../actions/info';
import { useFocusEffect } from '@react-navigation/native';
import AdventureStepCard from '../../components/AdventureStepCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Video from '../../components/Video';
import st from '../../st';
import { TDataState } from '../../types'
import styles from './styles';

type AdventureActiveProps = {
  route: {
    name: string,
    params: {
      adventureId: string;
    };
  };
};

function AdventureActive({ route }: AdventureActiveProps): React.ReactElement {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const { adventureId } = route.params;
  const adventure = useSelector(({ data }: {data: TDataState}) =>
    data.myAdventures?.byId[adventureId] || {});

  const steps = useSelector(({ data }: {data: TDataState}) =>
    data.adventureSteps[adventureId], shallowEqual)  || {};
  const [isPortrait, setIsPortrait] = useState(true);

  const getPendingAdventure = async () => {
    await dispatch(getMyAdventure(adventureId));
  };

  useEffect(() => {
    // If adventure wasn't accepted by a friend yet and not started.
    if (Object.keys(adventure).length === 0 ) {
      getPendingAdventure();
    }
    // -- ☝️call to import pending adventure info from the server.
  },[]);

  useEffect(() => {
    if (Object.keys(adventure).length > 0 ) {
      dispatch(getAdventureSteps(adventureId));
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  },[adventure?.id]);

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
  )

  return (
    <Flex value={1}>
      <ScrollView bounces style={[st.bgBlue, { paddingBottom: insets.bottom }]}>
        {Object.keys(adventure).length > 0 && (
          <Video
            onOrientationChange={(orientation: string): void => {
              if (orientation === 'portrait') {
                setIsPortrait(true);
              } else {
                setIsPortrait(false);
              }
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
                  Watch Trailer
                </Text>
              </Flex>
            </Flex>
          </Video>
        )}

        {isPortrait && Object.keys(adventure).length > 0 && (
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
            // removeClippedSubviews={true}
          />
        )}
        <Flex value={1} style={{ paddingBottom: insets.bottom }}></Flex>
      </ScrollView>
    </Flex>
  );
}

export default AdventureActive;
