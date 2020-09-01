import React, { useEffect, useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  ScrollView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import { setCurrentScreen } from '../../actions/info';
import { getMyAdventure, interactionVideoPlay } from '../../actions/requests';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Video from '../../components/Video';
import st from '../../st';
import { TDataState } from '../../types';
import theme from '../../theme';
import AdventureStepsList from '../../components/AdventureStepsList';

import styles from './styles';

type AdventureActiveProps = {
  navigation: any;
  route: {
    name: string;
    params: {
      adventureId: string;
    };
  };
};

function AdventureActive({
  navigation,
  route,
}: AdventureActiveProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const window = useWindowDimensions();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const hasNotch = DeviceInfo.hasNotch();
  const { adventureId } = route.params;
  const adventureContent = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId]?.item?.content || {},
    shallowEqual,
  );
  const adventureName = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId]?.name || '',
    shallowEqual,
  );

  const adventureItemId = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId]?.item?.id || '',
    shallowEqual,
  );

  const getPendingAdventure = async () => {
    await dispatch(getMyAdventure(adventureId)).then(
      data => {
        // Received Adventure from the server.
        // getSteps();
      },
      error => {
        // Can't Find Adventure.
        // eslint-disable-next-line no-consolegetSteps
        console.log('🛑 Can not Find Adventure.', adventureId);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedInApp' }],
        });
      },
    );
  };

  useEffect(() => {
    if (!adventureName) {
      getPendingAdventure();
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  }, [adventureName]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Actions to run when the screen focused:
      // Save current screen and it's parammeters in store.
      dispatch(
        setCurrentScreen({
          screen: route?.name,
          data: {
            adventureId,
          },
        }),
      );

      return (): void => {
        // Actions to run when the screen unfocused:
      };
    }, []),
  );

  const sceletonLayout = useMemo(
    () => [
      {
        key: 'videoBlock',
        width: '100%',
        height: window.width / 1.7,
        borderRadius: 0,
      },
    ],
    [window.width],
  );

  return (
    <Flex
      value={1}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      {hasNotch ? (
        <View
          style={{
            height: Platform.OS === 'ios' ? insets.top : 0,
            backgroundColor: insets.top > 0 ? '#000' : 'transparent',
          }}
        >
          <StatusBar
            animated={false}
            barStyle="light-content"
            translucent={false}
            // translucent={ isPortrait && insets.top > 0 ? false : true } // Android. The app will draw under the status bar.
            backgroundColor="#000" // Android. The background color of the status bar.
          />
        </View>
      ) : null}

      <ScrollView
        scrollEnabled={true}
        bounces
        style={{
          backgroundColor: theme.colors.primary,
          paddingBottom: insets.bottom,
        }}
      >
        {/* <Flex value={1} direction="row" align="center" justify="center" style={{padding:5}}>
          <Text style={[st.fs18,{ color:'white'}]}>
            {isGroup? adventure.journey_invite.name : adventure.name}
          </Text>
        </Flex> */}
        <SkeletonContent
          containerStyle={styles.listOfSteps}
          isLoading={!adventureItemId}
          boneColor={theme.colors.deepBlack}
          highlightColor={theme.colors.black}
          // animationType={'pulse'}
          animationDirection={'diagonalTopRight'}
          duration={2000}
          layout={sceletonLayout}
        />
        {/* This View stays outside of the screen on top
              and covers blue area with solid black on pull. */}
         {!!adventureItemId && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'black',
                left: 0,
                right: 0,
                top: -300,
                height: 300,
              }}
            />)}
        {!!adventureItemId && (
          <Video
            item={adventureContent}
            lockOrientation={true}
            onPlay={(): void => {
              dispatch(
                interactionVideoPlay({
                  videoId: adventureItemId,
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
                {adventureName}
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
                  {t('watchTrailer')}
                </Text>
              </Flex>
            </Flex>
          </Video>
        )}
        <AdventureStepsList adventureId={adventureId} />
        <Flex value={1} style={{ paddingBottom: insets.bottom }} />
      </ScrollView>
    </Flex>
  );
}

export default AdventureActive;
