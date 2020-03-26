import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import { ScrollView, Linking, FlatList } from 'react-native';
import { MONTHLY_PRICE, VIDEO_HEIGHT, REDUX_ACTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../actions/auth';
import ModalBackButton from '../../components/ModalBackButton';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount } from '../../utils';
import { getAdventureSteps } from '../../actions/requests';
import AdventureStepCard from '../../components/AdventureStepCard';

function ActiveAdventureModal(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isLandscape, setIsLandscape] = useState(false);
  const { adventure } = props.route.params;
  const steps = useSelector(({ data }) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventure.id] || []);
  useMount(() => {
    dispatch(getAdventureSteps(adventure.id));
  });
  useEffect(() => {
    setCurrentSteps(steps[adventure.id]);
  }, [steps]);
  return (
    <Flex value={1}>
      <Video
        onOrientationChange={orientation =>
          orientation === 'portrait'
            ? setIsLandscape(false)
            : setIsLandscape(true)
        }
      />
      {isLandscape ? null : (
        <ScrollView
          bounces={true}
          style={[st.bgBlue, { paddingBottom: insets.bottom }]}
        >
          <FlatList
            renderItem={props => (
              <AdventureStepCard {...props} adventure={adventure} />
            )}
            data={currentSteps}
            style={[
              st.w(st.fullWidth),
              st.pt4,
              { paddingBottom: insets.bottom },
            ]}
            removeClippedSubviews={true}
          />
        </ScrollView>
      )}
    </Flex>
  );
}

export default ActiveAdventureModal;
