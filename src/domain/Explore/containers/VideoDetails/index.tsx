import React, { useEffect, useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';
import { View, ScrollView, StatusBar, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import Flex from 'components/Flex';
import Text from 'components/Text';
import OldButton from 'components/OldButton';
import Triangle from 'components/Triangle';
import Video from 'components/Video';
import VokeIcon from 'components/VokeIcon';
import Touchable from 'components/Touchable';
import {
  reportVideoInteraction,
  toggleFavoriteVideo,
  sendVideoInvitation,
} from 'actions/requests';
import { AdventureStackParamList, VideoStackParamList } from 'utils/types';
import theme from 'utils/theme';
import st from 'utils/st';
import useOrientation from 'hooks/useOrientation';

import styles from './styles';

type NavigationPropType = StackNavigationProp<
  VideoStackParamList,
  'VideoDetails'
>;

type RoutePropType = RouteProp<VideoStackParamList, 'VideoDetails'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function VideoDetails(props: Props) {
  const { t } = useTranslation('videos');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const { item } = props.route.params;
  const [isFavorited, setIsFavorited] = useState(item['favorite?']);

  async function handleFavorite() {
    setIsFavorited(!isFavorited);
    await dispatch(toggleFavoriteVideo(!isFavorited, item));
  }

  function handleShare() {
    navigation.navigate('AdventureName', {
      item,
      withGroup: false,
      isVideoInvite: true,
    });
  }

  useEffect(() => {
    // Google Analytics: Record content selection.
    // https://rnfirebase.io/reference/analytics#logSelectItem
    analytics().logSelectItem({
      content_type: 'Video',
      item_list_id: 'Explore',
      item_list_name: 'Videos',
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.content_type,
          item_category2: item.language.name,
        },
      ],
    });
  }, []);

  return (
    <Flex value={1}>
      <>
        <View
          style={{
            height: orientation === 'portrait' ? insets.top : 0,
            backgroundColor:
              orientation === 'portrait' && insets.top > 0
                ? '#000'
                : 'transparent',
          }}
        >
          <StatusBar
            animated={true}
            barStyle="light-content"
            translucent={true} // Android. The app will draw under the status bar.
            backgroundColor="transparent" // Android. The background color of the status bar.
          />
        </View>
        <ScrollView
          bounces={true}
          scrollEnabled={orientation === 'portrait' ? true : false}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {/* This View stays outside of the screen on top
            and covers blue area with solid black on pull. */}
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'black',
              left: 0,
              right: 0,
              top: -300,
              height: 300,
              zIndex: 1,
            }}
          />
          {/* Video Player */}
          <Video
            autoPlay={true}
            item={item.media}
            onPlay={(time): void => {
              if (time > 1) {
                dispatch(
                  reportVideoInteraction({
                    videoId: item.id,
                    context: 'resource',
                    action: 'resumed',
                    time: time,
                  }),
                );
              } else {
                dispatch(
                  reportVideoInteraction({
                    videoId: item.id,
                    context: 'resource',
                    action: 'started',
                    time: time,
                  }),
                );
              }
            }}
            onPause={(time): void => {
              dispatch(
                reportVideoInteraction({
                  videoId: item.id,
                  context: 'journey',
                  action: 'paused',
                  time: time,
                }),
              );
            }}
            onStop={(time): void => {
              dispatch(
                reportVideoInteraction({
                  videoId: item.id,
                  context: 'journey',
                  action: 'finished',
                  time: time,
                }),
              );
            }}
          />
          {orientation === 'portrait' && (
            <Flex
              direction="column"
              style={[
                st.bgWhite,
                st.f1,
                st.p4,
                { paddingBottom: insets.bottom + 25 },
              ]}
            >
              {/* <OldButton
                style={
                  isFavorited
                    ? styles.buttonLikeActive
                    : styles.buttonLikeInactive
                }
                onPress={handleFavorite}
              >
                <VokeIcon
                  name="heart"
                  style={[st.bgTransparent, st.white]}
                  size={20}
                />
              </OldButton> */}
              <Text style={[st.blue, st.fs20, st.semi]}>{item.name}</Text>
              <Text style={[st.darkGrey, st.fs14, st.mb7]}>
                {t('shares', { total: item.shares })}
              </Text>
              <Text style={[st.darkGrey, st.fs14, st.mb7]}>
                {item.description}
              </Text>
              <Text style={[st.blue, st.fs16, st.mb6, st.semi]}>
                {t('themes')}
              </Text>
              <Flex direction="row">
                {(item.tags || []).map((t, index) => (
                  <Text
                    key={`${t.id}_${index}`}
                    style={[st.darkGrey, st.fs14, st.mb7]}
                  >
                    {t.name}
                    {index !== item.tags.length - 1 ? ', ' : null}
                  </Text>
                ))}
              </Flex>
              <Text style={[st.blue, st.fs16, st.mb6, st.semi]}>
                {t('kickstarters')}
              </Text>
              {item.questions.map(q => (
                <Flex key={q.id} direction="column">
                  <Text style={[st.darkGrey, st.fs14, st.mb7]}>
                    {q.content}
                  </Text>
                  <Flex style={[st.bbDarkGrey, st.bbw1, st.w(20), st.mv5]} />
                </Flex>
              ))}
            </Flex>
          )}
        </ScrollView>
        {/* Call to action button: */}
        {orientation === 'portrait' && (
          <Touchable
            isAndroidOpacity={true}
            onPress={handleShare}
            activeOpacity={0.6}
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              bottom: insets.bottom + 25,
              right: 25,
              backgroundColor: theme.colors.primary,
              width: 66,
              height: 66,
              borderRadius: theme.radius.xxl,
              ...theme.shadow,
            }}
          >
            <VokeIcon
              name="share"
              style={{ fontSize: 36, color: theme.colors.white }}
            />
          </Touchable>
        )}
      </>
    </Flex>
  );
}

export default VideoDetails;
