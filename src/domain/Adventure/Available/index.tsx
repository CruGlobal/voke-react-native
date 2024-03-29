import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { View, ScrollView, StatusBar } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'reducers';
import Flex from 'components/Flex';
import Text from 'components/Text';
import st from 'utils/st';
import OldButton from 'components/OldButton';
import Video from 'components/Video';
import VokeIcon from 'components/VokeIcon';
import ModalHowDuoWorks from 'components/ModalHowDuoWorks';
import ModalHowGroupsWork from 'components/ModalHowGroupsWork';
import theme from 'utils/theme';
import CONSTANTS, { REDUX_ACTIONS } from 'utils/constants';
import { AdventureStackParamList } from 'utils/types';
import Touchable from 'components/Touchable';
import analytics from '@react-native-firebase/analytics';
import useOrientation from 'hooks/useOrientation';
import { lockToPortrait, useMount } from 'utils';

import {
  startAdventure,
  reportVideoInteraction,
} from '../../../actions/requests';

import styles from './styles';

function ActionButton(props) {
  return (
    <OldButton
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
      testID={props?.testID}
    >
      <Flex direction="row" align="center" justify="center">
        <VokeIcon
          name={props.icon}
          size={props.icon == 'group' ? 32 : 26}
          style={styles.iconAction}
        />
        <Text style={[st.white, st.fs20]}>{props.text}</Text>
      </Flex>
    </OldButton>
  );
}

type NavigationPropType = StackNavigationProp<
  AdventureStackParamList,
  'AdventureAvailable'
>;

type RoutePropType = RouteProp<AdventureStackParamList, 'AdventureAvailable'>;

type Props = {
  props: NavigationPropType;
  route: RoutePropType;
};

function AdventureAvailable(props: Props): React.ReactElement {
  const modalizeRef = useRef<Modalize>(null);
  const { t } = useTranslation('journey');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const { item, alreadyStartedByMe } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [soloStarted, setSoloStarted] = useState(alreadyStartedByMe);
  const [withGroup, setWithGroup] = useState(false);
  const { duoTutorialCount, groupTutorialCount } = useSelector(
    ({ info }: RootState) => info,
  );

  useMount(() => {
    lockToPortrait();
  });

  useEffect(() => {
    // Google Analytics: Record content selection.
    // https://rnfirebase.io/reference/analytics#logSelectItem
    analytics().logSelectItem({
      content_type: 'Adventure Available',
      item_list_id: 'Adventures',
      item_list_name: 'Find Adventures',
      items: [
        {
          item_name: item.name,
          item_category: 'Adventure Available',
          item_category2: item?.language?.name,
        },
      ],
    });
  }, []);

  const updateCountDown = () => {
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
      <Video
        item={item?.item?.content}
        lockOrientation={true}
        onPlay={(time): void => {
          if (time > 1) {
            dispatch(
              reportVideoInteraction({
                videoId: item?.item?.id,
                context: 'journey',
                action: 'resumed',
                time: time,
              }),
            );
          } else {
            dispatch(
              reportVideoInteraction({
                videoId: item?.item?.id,
                context: 'journey',
                action: 'started',
                time: time,
              }),
            );
          }
        }}
        onPause={(time): void => {
          dispatch(
            reportVideoInteraction({
              videoId: item?.item?.id,
              context: 'journey',
              action: 'paused',
              time: time,
            }),
          );
        }}
        onStop={(time): void => {
          dispatch(
            reportVideoInteraction({
              videoId: item?.item?.id,
              context: 'journey',
              action: 'finished',
              time: time,
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
      {orientation === 'portrait' && (
        <ScrollView
          bounces={false}
          style={{ paddingBottom: insets.bottom }}
          scrollIndicatorInsets={{ right: 1 }}
          testID="scrollAdventureAvailable"
        >
          <Flex style={[st.pd3]}>
            <Text style={[st.fs2, st.blue]} testID="adventureName">
              {item.name}
            </Text>
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
                  testID="ctaGoWithFriend"
                  icon="couple"
                  onPress={(): void => {
                    if (groupTutorialCount > 1) {
                      navigation.navigate('AdventureName', {
                        item,
                        withGroup: false,
                      });
                    } else {
                      setWithGroup(false);
                      modalizeRef.current?.open();
                      updateCountDown();
                    }
                  }}
                />
                <ActionButton
                  text={
                    item.id === CONSTANTS.ADV_EASTER
                      ? t('goWithFamily')
                      : t('goWithGroup')
                  }
                  testID="ctaGoWithGroup"
                  icon="group"
                  onPress={() => {
                    if (
                      groupTutorialCount > 1 ||
                      item.id === CONSTANTS.ADV_EASTER // If Easter Adventure.
                    ) {
                      navigation.navigate('AdventureName', {
                        item,
                        withGroup: true,
                      });
                    } else {
                      setWithGroup(true);
                      modalizeRef.current?.open();
                      updateCountDown();
                    }
                  }}
                />
                {soloStarted ? null : (
                  <ActionButton
                    text={t('goByMyself')}
                    testID="ctaGoByMyself"
                    icon="person"
                    onPress={startByMyself}
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
      )}
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalTopOffset={0}
          withHandle={false}
          openAnimationConfig={{
            timing: { duration: 300 },
          }}
          withOverlay={false}
          rootStyle={{
            elevation: 5, // need it here to solve issue with button shadow.
          }}
          modalStyle={{
            backgroundColor: 'rgba(0,0,0,.85)',
            minHeight: '100%',
          }}
          FooterComponent={null}
          HeaderComponent={
            <SafeAreaView style={styles.modalTitleAction} edges={['top']}>
              <Touchable
                onPress={(): void => modalizeRef.current?.close()}
                style={styles.buttonTitleCancel}
              >
                <Text style={styles.buttonLabelTitleCancel}>{t('cancel')}</Text>
              </Touchable>
            </SafeAreaView>
          }
        >
          {withGroup ? (
            <ModalHowGroupsWork
              primaryAction={(): void => {
                modalizeRef.current?.close();
                navigation.navigate('AdventureName', {
                  item,
                  withGroup: true,
                });
              }}
              onClose={(): void => {
                modalizeRef.current?.close();
              }}
            />
          ) : (
            <ModalHowDuoWorks
              primaryAction={(): void => {
                modalizeRef.current?.close();
                navigation.navigate('AdventureName', {
                  item,
                  withGroup: false,
                });
              }}
            />
          )}
        </Modalize>
      </Portal>
    </Flex>
  );
}

export default AdventureAvailable;
