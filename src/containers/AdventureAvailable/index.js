import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { View, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../reducers';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import Video from '../../components/Video';
import VokeIcon from '../../components/VokeIcon';
import theme from '../../theme';
import { startAdventure, interactionVideoPlay } from '../../actions/requests';
import { REDUX_ACTIONS } from '../../constants';

function ActionButton(props) {
  return (
    <Button
      isAndroidOpacity={true}
      style={[
        st.pd4,
        st.br1,
        st.bgBlue,
        st.mb3,
        st.w(st.fullWidth - 50),
        {
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOpacity: 0.5,
          elevation: 2,
          shadowRadius: 3,
          shadowOffset: { width: 1, height: 5 },
        },
      ]}
      onPress={() => props.onPress()}
    >
      <Flex direction="row" align="center" justify="center">
        <VokeIcon
          name={props.icon}
          size={props.icon == 'group' ? 32 : 26}
          style={{ paddingRight: 10, color: theme.colors.white }}
        />
        <Text style={[st.white, st.fs20]}>{props.text}</Text>
      </Flex>
    </Button>
  );
}

function AdventureAvailable(props) {
  const { t } = useTranslation('journey');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
  const { item, alreadyStartedByMe } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [soloStarted, setSoloStarted] = useState(alreadyStartedByMe);
  const [withGroup, setWithGroup] = useState(0);
  const { duoTutorialCount, groupTutorialCount } = useSelector(
    ({ info }: RootState) => info,
  );

  const updateCountDown = withGroup => {
    if (withGroup) {
      const countdown = groupTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_GROUP,
        groupTutorialCount: countdown,
        description:
          'Tutorial Countdown group updated. Called from TipsModal.updateCountDown()',
      });
    } else {
      const countdown = duoTutorialCount + 1;
      dispatch({
        type: REDUX_ACTIONS.TUTORIAL_COUNTDOWN_DUO,
        duoTutorialCount: countdown,
        description:
          'Tutorial Countdown duo updated. Called from TipsModal.updateCountDown()',
      });
    }
  };

  async function startByMyself() {
    try {
      setIsLoading(true);
      const result = await dispatch(
        startAdventure({ organization_journey_id: item.id }),
      );

      setSoloStarted(true);

      navigation.navigate('AdventureActive', {
        adventureId: result.id,
      });
    } catch (e) {
      console.log('Error starting adventure by myself', e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex value={1} style={[st.bgWhite]}>
      <View
        style={{
          height: isPortrait ? insets.top : 0,
          backgroundColor:
            isPortrait && insets.top > 0 ? '#000' : 'transparent',
        }}
      >
        <StatusBar
          animated={true}
          barStyle="light-content"
          translucent={true} // Android. The app will draw under the status bar.
          backgroundColor="transparent" // Android. The background color of the status bar.
        />
      </View>
      <Video
        onOrientationChange={(orientation: string): void => {
          setIsPortrait(orientation === 'portrait' ? true : false);
        }}
        item={item?.item?.content}
        onPlay={() => {
          dispatch(
            interactionVideoPlay({
              videoId: item?.item?.id,
              context: 'journey',
            }),
          );
        }}
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
            {item.name}
          </Text>
          <Flex
            style={{
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.4)',
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
              {t('watchTrailer')}
            </Text>
          </Flex>
        </Flex>
      </Video>
      {isPortrait && (
        <ScrollView bounces={false} style={{ paddingBottom: insets.bottom }}>
          <Flex style={[st.pd3]}>
            <Text style={[st.fs2, st.blue]}>{item.name}</Text>
            <Text style={[st.pt5, st.charcoal]}>
              {item.total_steps}-{t('partSeries').toLowerCase()}
            </Text>
            <Text style={[st.charcoal, st.pv4]}>{item.description}</Text>
          </Flex>
          <Flex justify="end" style={[st.bgWhite]}>
            <Text style={[st.fs3, st.pb5, st.ml2]}>{t('whoCanYouTake')}</Text>
            <Flex
              style={{
                borderBottomColor: theme.colors.secondary,
                borderBottomWidth: 2,
                width: 140,
                marginLeft: 30,
              }}
            />
            <Flex direction="row" justify="center" style={[st.w100, st.mt4]}>
              <Flex value={1} align="center">
                <ActionButton
                  text={t('goWithFriend')}
                  icon="couple"
                  onPress={() => {
                    if (duoTutorialCount > 2) {
                      navigation.navigate('AdventureName', {
                        item,
                        withGroup: false,
                      });
                    } else {
                      updateCountDown(false);
                      navigation.navigate('CustomModal', {
                        modalId: 'howDuoWorks',
                        primaryAction: () => {
                          navigation.navigate('AdventureName', {
                            item,
                            withGroup: false,
                          });
                        },
                      });
                    }
                  }}
                />
                <ActionButton
                  text={t('goWithGroup')}
                  icon="group"
                  onPress={() => {
                    if (groupTutorialCount > 2) {
                      navigation.navigate('AdventureName', {
                        item,
                        withGroup: true,
                      });
                    } else {
                      updateCountDown(true);
                      navigation.navigate('CustomModal', {
                        modalId: 'howGroupsWork',
                        primaryAction: () => {
                          navigation.navigate('AdventureName', {
                            item,
                            withGroup: true,
                          });
                        },
                      });
                    }
                  }}
                />
                {soloStarted ? null : (
                  <ActionButton
                    text={t('goByMyself')}
                    icon="person"
                    onPress={startByMyself}
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      )}
    </Flex>
  );
}

export default AdventureAvailable;
