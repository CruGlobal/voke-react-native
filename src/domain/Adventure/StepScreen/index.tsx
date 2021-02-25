import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useMemo,
  useCallback,
} from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import theme from 'utils/theme';
import { RootState } from 'reducers';
import {
  AdventureStackParamList,
  TAdventureSingle,
  TDataState,
  TStep,
} from 'utils/types';

import { getMyAdventures, getAdventureSteps } from '../../../actions/requests';
import { setCurrentScreen } from '../../../actions/info';

import AdventureStepScreenRender from './AdventureStepScreenRender';
import styles from './styles';

type ModalProps = {
  route: {
    name: string;
    params: {
      stepId: string;
      adventureId: string;
    };
  };
};

type NavigationPropType = StackNavigationProp<
  AdventureStackParamList,
  'AdventureStepScreen'
>;

type RoutePropType = RouteProp<AdventureStackParamList, 'AdventureStepScreen'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

const AdventureStepScreen = ({ navigation, route }: Props): ReactElement => {
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const { stepId, adventureId } = route.params;
  const adventure: TAdventureSingle =
    useSelector(
      ({ data }: RootState) =>
        data?.myAdventures?.byId[
          adventureId as keyof TDataState['myAdventures']['byId']
        ],
    ) || {};
  const currentStep: TStep =
    useSelector(
      ({ data }: RootState) =>
        data.adventureSteps[adventureId]?.byId[
          stepId as keyof TDataState['adventureSteps'][typeof adventureId]['byId']
        ],
    ) || {};

  // To be used in redirectIfNeeded closure.
  const adventureIdRef = useRef(adventure?.id);
  const currentStepIdRef = useRef(currentStep?.id);
  const currentStepId = currentStep?.id;
  const adventureIdStore = adventure?.id;

  const replacePrevScreen = useCallback((): void => {
    const { routes } = navigation.dangerouslyGetState();
    /*
      When openning current screen from push notifications,
      React Natigation will be missing info about the previous Steps screen
      and clicking on the back button will return the user to the home screen.
      To solve this problem we check here (as soon aadventureId is known)
      if the previous screen value set to 'AdventureActive' (steps).
      If not we insert this screen into the history by doing silent reset
      with updated route.
    */
    if (routes[routes.length - 2]?.name !== 'AdventureActive') {
      const newRoutes = [
        ...routes.slice(0, -1),
        {
          name: 'AdventureActive',
          params: {
            adventureId: adventureIdStore,
          },
        },
        routes[routes.length - 1],
      ];

      return navigation.reset({
        routes: newRoutes,
        index: newRoutes.length - 1,
      });
    }
  }, [adventureIdStore, navigation]);

  useEffect(() => {
    adventureIdRef.current = adventureIdStore;
    currentStepIdRef.current = currentStepId;
    if (adventureIdStore && currentStepId) {
      setIsLoading(false);
      // Save current screen and it's parammeters in store.
      dispatch(
        setCurrentScreen({
          screen: route?.name,
          data: {
            conversationId: adventure?.conversation?.id,
            adventureStepId: currentStepId,
            adventureId: adventureIdStore,
          },
        }),
      );
      // Check the previous screen in history.
      replacePrevScreen();
    }
  }, [
    adventure,
    dispatch,
    route,
    currentStepId,
    adventureIdStore,
    replacePrevScreen,
  ]);

  useEffect(() => {
    if (!adventureIdStore) {
      // No adventure found in the local storage.
      // Request it from the server.
      dispatch(getMyAdventures('Adventure Step Screen'));
    } else if (!currentStepId) {
      // Have adventure, but no step info.
      // Request it from the server.
      dispatch(getAdventureSteps(adventureIdStore));
    }
  }, [adventureIdStore, currentStepId, dispatch]);

  /*
    After openning push notification we request information about the current
    step from the server. In case we didn't get this info in time, send
    user to the adventure steps screen or to the main screen.
  */
  const redirectIfNeeded = useCallback((): void => {
    if (!currentStepIdRef.current) {
      // Didn't load current step.
      // Check if we have adventure?
      if (adventureIdRef.current) {
        navigation.reset({
          index: 1,
          routes: [
            { name: 'Adventures' },
            {
              name: 'AdventureActive',
              params: { adventureId: adventureIdRef.current },
            },
          ],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedInApp' }],
        });
      }
    }
  }, [navigation]);

  // Wait for 5 seconds. If no content loaded, redirect to the main screen.
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectIfNeeded();
    }, 5000);
    return (): void => clearTimeout(timer);
  }, [redirectIfNeeded]);

  const sceletonLayoutVideo = useMemo(
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

  const sceletonLayoutQuestion = useMemo(
    () => [
      {
        key: 'question',
        opacity: 0.5,
        width: '100%',
        height: 240,
        borderRadius: theme.radius.m,
        marginBottom: theme.spacing.s,
        backgroundColor: theme.colors.secondaryAlt,
      },
    ],
    [],
  );

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <>
          <SkeletonContent
            containerStyle={{}}
            isLoading={isLoading}
            boneColor={theme.colors.deepBlack}
            highlightColor={theme.colors.black}
            // animationType={'pulse'}
            animationDirection={'diagonalTopRight'}
            duration={2000}
            layout={sceletonLayoutVideo}
          />
          <SkeletonContent
            containerStyle={styles.sceletonQuestion}
            isLoading={isLoading}
            boneColor={theme.colors.secondaryAlt}
            highlightColor={'rgb(71, 189, 217)'}
            animationType={'pulse'}
            animationDirection={'diagonalTopRight'}
            duration={2000}
            layout={sceletonLayoutQuestion}
          />
        </>
      ) : (
        <AdventureStepScreenRender
          adventure={adventure}
          currentStep={currentStep}
        />
      )}
    </View>
  );
};

export default AdventureStepScreen;
