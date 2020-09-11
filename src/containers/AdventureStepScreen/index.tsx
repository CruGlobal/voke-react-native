/* eslint-disable camelcase */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useMemo,
} from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import theme from '../../theme';
import { RootState } from '../../reducers';
import { getMyAdventures, getAdventureSteps } from '../../actions/requests';
import { setCurrentScreen } from '../../actions/info';

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
const AdventureStepScreen = ({
  navigation,
  route,
}: ModalProps): ReactElement => {
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const { stepId, adventureId } = route.params;
  const adventure =
    useSelector(
      ({ data }: RootState) => data?.myAdventures?.byId[adventureId],
    ) || {};
  const conversationId = adventure?.conversation?.id;
  const currentStep =
    useSelector(
      ({ data }: RootState) => data.adventureSteps[adventureId]?.byId[stepId],
    ) || {};

  // To be used in redirectIfNeeded closure.
  const adventureIdRef = useRef(adventure?.id);
  const currentStepIdRef = useRef(currentStep?.id);

  useEffect(() => {
    adventureIdRef.current = adventure?.id;
    currentStepIdRef.current = currentStep?.id;
    if (adventure?.id && currentStep?.id) {
      setIsLoading(false);
      const { routes } = navigation.dangerouslyGetState();

      // Save current screen and it's parammeters in store.
      dispatch(
        setCurrentScreen({
          screen: route?.name,
          data: {
            conversationId: adventure?.conversation?.id,
            adventureStepId: currentStep?.id,
            adventureId: adventure?.id,
          },
        }),
      );

      /*
        When openning current screen from push notifications,
        React Natigation will be missing info about previous Steps screen
        and clicking on the back button will return the user to the home screen.
        To solve this problem we check here (as soon aadventureId is known)
        if the previous screen is 'AdventureActive' (steps).
        If not we insert this screen into the history by doing silent reset
        with updated route.
      */
      if (routes[routes.length - 1]?.name !== 'AdventureActive') {

        const newRoutes = [
          ...routes.slice(0, -1),
          {
            name: 'AdventureActive',
            params: {
              adventureId: adventureId,
            },
          },
          routes[routes.length - 1],
        ];

        return navigation.reset({
          routes: newRoutes,
          index: newRoutes.length - 1,
        });
      }
    }
  }, [currentStep?.id, adventure?.id]);

  useEffect(() => {
    if (!adventure?.id) {
      // No adventure found in the local storage.
      // Request it from the server.
      dispatch(getMyAdventures('Adventure Step Screen'));
    } else if (!currentStep?.id) {
      // Have adventure, but no step info.
      // Request it from the server.
      dispatch(getAdventureSteps(adventureId));
    }
  }, [adventure?.id]);

  /*
    After openning push notification we request information about the current
    step from the server. In case we didn't get this info in time, send
    user to the adventure steps screen or to the main screen.
  */
  const redirectIfNeeded = (): void => {
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
  };

  // Wait for 5 seconds. If no content loaded, redirect to the main screen.
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectIfNeeded();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
