import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';

import Flex from '../Flex';
import Text from '../Text';
import st from '../../st';
import Touchable from '../Touchable';
import Icon from '../Icon';
import SLIDER_DOT from '../../assets/sliderDot.png';
import { togglePlayStatus, toggleShuffleStatus, toggleRepeatStatus } from '../../actions/player';
import { useNavigation } from '@react-navigation/native';

function MusicPlayer() {
  const { isPlaying, isShuffle, repeatStatus } = useSelector(({ player }) => player);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [sliderPosition, setSliderPosition] = useState(0);

  function togglePlay() {
    dispatch(togglePlayStatus(!isPlaying));
  }

  function toggleShuffle() {
    dispatch(toggleShuffleStatus(!isShuffle));
  }

  function toggleRepeat() {
    const newStatus = repeatStatus === 2 ? 0 : repeatStatus + 1;
    dispatch(toggleRepeatStatus(newStatus));
  }

  function handleNext() {
    // TODO
  }
  function handlePrev() {
    // TODO
  }

  return (
    <Touchable onPress={() => navigation.navigate('MusicPlayerModal')} activeOpacity={1}>
      <Flex direction="column" align="center" justify="center" style={[st.bgDarkPurple]}>
        <Slider
          value={sliderPosition}
          minimumValue={0}
          maximumValue={100}
          step={1}
          style={[
            st.pv4,
            {
              width: st.fullWidth - 10,
              height: 20,
            },
          ]}
          thumbImage={SLIDER_DOT}
          minimumTrackTintColor={st.colors.orangeLight}
          maximumTrackTintColor={st.colors.dimText}
          onSlidingComplete={(value) => {
            //
          }}
        />
        <Flex direction="row" justify="between" align="center" self="stretch">
          <Text style={[st.dimText, st.fs6, st.ph5]}>00:07</Text>
          <Text numberOfLines={1} style={[st.white, st.fs6, st.ph6, st.bold, st.f1, st.tac]}>
            Name of the Song{` • `}
            <Text style={[st.dimText, st.fs6, st.ellipsis, { fontWeight: 'normal' }]}>Artist Name</Text>
          </Text>
          <Text style={[st.dimText, st.fs6, st.ph5]}>02:07</Text>
        </Flex>
        <Flex direction="row" justify="center" align="center" style={[st.pv4]}>
          <Icon
            name={isShuffle ? 'shuffle' : 'shuffle_inactive'}
            containerStyle={[st.f1, st.aic]}
            style={[{ width: 20 }]}
            onPress={toggleShuffle}
          />
          <Icon name="previous" containerStyle={[st.f1, st.aic]} style={[{ width: 15 }]} onPress={handlePrev} />
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            containerStyle={[st.f1, st.aic]}
            style={[{ height: 55, width: 55 }]}
            onPress={togglePlay}
          />
          <Icon name="next" containerStyle={[st.f1, st.aic]} style={[{ width: 15 }]} onPress={handleNext} />
          <Icon
            name={repeatStatus === 0 ? 'repeat' : repeatStatus === 1 ? 'repeat_all' : 'repeat_one'}
            containerStyle={[st.f1, st.aic]}
            style={[{ width: 25 }]}
            onPress={toggleRepeat}
          />
        </Flex>
      </Flex>
    </Touchable>
  );
}

export default MusicPlayer;
