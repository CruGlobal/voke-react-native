import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import { View, ScrollView, StatusBar, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import VokeIcon from '../../components/VokeIcon';
import Touchable from '../../components/Touchable';
import { interactionVideoPlay } from '../../actions/requests';

import {
  toggleFavoriteVideo,
  sendVideoInvitation,
} from '../../actions/requests';

function VideoDetails(props) {
  const { t } = useTranslation('videos');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
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

  return (
    <Flex value={1}>
      <>
        <View style={{
          height: isPortrait ? insets.top : 0,
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
          bounces={true}
          scrollEnabled={isPortrait? true: false}
        >
          {/* This View stays outside of the screen on top
            and covers blue area with solid black on pull. */}
          <View
            style={{
              position:'absolute',
              backgroundColor: 'black',
              left: 0,
              right: 0,
              top: -300,
              height: 300,
              zIndex:1,
            }}
          ></View>
          {/* Video Player */}
          <Video
            onOrientationChange={(orientation: string): void => {
              setIsPortrait( orientation === 'portrait' ? true : false);
            }}
            autoPlay={true}
            item={item.media}
            onPlay={
              () => {
                dispatch( interactionVideoPlay({
                  videoId: item.id,
                  context: 'resource'
                }))
              }
            }
          />
          { isPortrait && (
            <Flex
              direction="column"
              style={[st.bgWhite, st.f1, st.p4, { paddingBottom: insets.bottom + 25 }]}
            >
              <Button
                style={[
                  st.w(50),
                  st.h(50),
                  st.br1,
                  st.ph0,
                  st.aic,
                  st.jcc,
                  isFavorited ? st.bgBlue : st.bgLightGrey3,
                ]}
                onPress={handleFavorite}
              >
                <VokeIcon name="heart" style={[st.bgTransparent]} size={20} />
              </Button>
              <Text style={[st.blue, st.fs20, st.semi]}>{item.name}</Text>
              <Text style={[st.darkGrey, st.fs14, st.mb7]}>
                {t('shares', {total:item.shares})}
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
        { isPortrait && <Touchable
          isAndroidOpacity={true}
          onPress={handleShare}
          activeOpacity={0.6}
          style={[
            st.abs,
            st.aic,
            st.jcc,
            { bottom: insets.bottom + 25, right: 25 },
          ]}
        >
          <Flex align="center" justify="center" style={[]}>
            <VokeIcon
              type="image"
              name="to-chat"
              style={{ width: 70, height: 70 }}
            />
          </Flex>
        </Touchable> }
      </>
    </Flex>
  );
}

export default VideoDetails;
