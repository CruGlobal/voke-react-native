import React, { useEffect, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import Flex from 'components/Flex';
import ScrollWheel from 'components/ScrollWheel';
import BackButton from 'components/BackButton';
import { getVideoTags } from 'actions/requests';
import { VideoStackParamList } from 'utils/types';;
import { useMount } from 'utils';

import st from 'utils/st';

type NavigationPropType = StackNavigationProp<
  VideoStackParamList,
  'VideosSearch'
>;

type RoutePropType = RouteProp<VideoStackParamList, 'VideosSearch'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function VideosSearch(props: Props) {
  const insets = useSafeArea();
  const videoTags = useSelector(({ data }) => data.videoTags);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [tags, setTags] = useState(videoTags);

  const { onSelect } = props.route.params;

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
