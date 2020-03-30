import React, { useEffect, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import st from '../../st';
import ScrollWheel from '../../components/ScrollWheel';
import ModalBackButton from '../../components/ModalBackButton';
import { useSelector, useDispatch } from 'react-redux';
import { useMount } from '../../utils';

import { getVideoTags } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';

function SearchVideosModal({ route }) {
  const insets = useSafeArea();
  const videoTags = useSelector(({ data }) => data.videoTags);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [tags, setTags] = useState(videoTags);

  const { onSelect } = route.params;

  useMount(() => {
    if (videoTags.length === 0) {
      dispatch(getVideoTags());
    }
  });
  useEffect(() => {
    setTags(videoTags);
  }, [videoTags]);

  return (
    <Flex style={[st.bgTransparent]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)']}
        style={[{ paddingTop: insets.top, height: st.fullHeight }]}
      >
        <ModalBackButton />
        <Flex value={1} justify="center">
          <ScrollWheel
            items={tags}
            onSelect={tagId => {
              onSelect(tagId);
              navigation.goBack();
            }}
          />
        </Flex>
      </LinearGradient>
    </Flex>
  );
}

export default SearchVideosModal;
