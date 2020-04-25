import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import st from '../../st';
import { ScrollView, Linking, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount } from '../../utils';
import { getAdventureSteps } from '../../actions/requests';
import AdventureStepCard from '../../components/AdventureStepCard';
import Text from '../../components/Text';

type AdventureActiveProps = {
  route: {
    params: {
      adventureId: string;
    };
  };
}

function AdventureActive({ route }: AdventureActiveProps): React.ReactElement {
  const { adventureId } = route.params;
  const { myAdventures } = useSelector(({ data }: RootState) => data) || {};
  const adventure =
    myAdventures.find((item: { id: string }) => item.id === adventureId) || {};
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [isPortrait, setIsPortrait] = useState(true);
  const steps = useSelector(({ data }) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventureId] || []);
  useMount(() => {
    dispatch(getAdventureSteps(adventureId));
  });
  useEffect(() => {
    setCurrentSteps(steps[adventureId]);
  }, [steps]);

  return (
    <Flex value={1}>
      <ScrollView bounces style={[st.bgBlue, { paddingBottom: insets.bottom }]}>
        <Video
          onOrientationChange={(orientation: string): void => {
            if (orientation === 'portrait') {
              setIsPortrait(true);
            } else {
              setIsPortrait(false);
            }
          }}
          item={adventure.item.content}
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

        {isPortrait && (
          <FlatList
            renderItem={props => (
              <AdventureStepCard
                {...props}
                adventure={adventure} //!!!
              />
            )}
            data={currentSteps}
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
