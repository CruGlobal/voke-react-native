import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMyAdventure, getAdventureSteps } from '../../actions/requests';
import { RootState } from '../../reducers';
import { useMount } from '../../utils';
import AdventureStepCard from '../../components/AdventureStepCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Video from '../../components/Video';
import st from '../../st';

type AdventureActiveProps = {
  route: {
    params: {
      adventureId: string;
    };
  };
};

function AdventureActive({ route }: AdventureActiveProps): React.ReactElement {
  const { adventureId } = route.params;
  const { myAdventures } = useSelector(({ data }: RootState) => data) || {};
  const [adventure, setAdventure] = useState(
    myAdventures.find((item: { id: string }) => item.id === adventureId) || {}
  );

  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [isPortrait, setIsPortrait] = useState(true);
  const steps = useSelector(({ data }: RootState) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventureId] || []);

  const getPendingAdventure = async (): Promise<void> => {
    const pendingAdventure = await dispatch(getMyAdventure(adventureId));
    if (pendingAdventure && pendingAdventure?.id) {
      setAdventure(pendingAdventure);
    }
  };

  useMount(() => {
    // If adventure wasn't accepeted by a friend yet and not started.
    // (if adventure.status = pending)
    if (Object.keys(adventure).length === 0) {
      getPendingAdventure();
    }
    dispatch(getAdventureSteps(adventureId));
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  });

  useEffect(() => {
    setCurrentSteps(steps[adventureId]);
  }, [adventure, steps, currentSteps]);

  return (
    <Flex value={1}>
      <ScrollView bounces style={[st.bgBlue, { paddingBottom: insets.bottom }]}>
        {adventure && (
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

        {isPortrait && (
          <FlatList
            data={currentSteps}
            renderItem={(step): React.ReactElement => (
              <AdventureStepCard
                // {...props}
                step={step.item}
                steps={currentSteps}
                adventure={adventure} //! !!
              />
            )}
            style={[
              st.w(st.fullWidth),
              st.pt4,
              { paddingBottom: insets.bottom },
            ]}
            // removeClippedSubviews={true}
          />
        )}
      </ScrollView>
    </Flex>
  );
}

export default AdventureActive;
