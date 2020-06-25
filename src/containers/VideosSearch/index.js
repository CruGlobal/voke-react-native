import React, { useEffect, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import st from '../../st';
import ScrollWheel from '../../components/ScrollWheel';
import BackButton from '../../components/BackButton';
import { useSelector, useDispatch } from 'react-redux';
import { useMount } from '../../utils';

import { getVideoTags } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

function VideosSearch({ route }) {
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
      <BackButton />
      <Flex value={1} justify="center">
        <ScrollWheel
          items={tags}
          onSelect={tagId => {
            onSelect(tagId);
            navigation.goBack();
          }}
        />
      </Flex>
    </Flex>
  );
}

export default VideosSearch;
