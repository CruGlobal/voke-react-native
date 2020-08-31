import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import { RootState } from '../../reducers';
import Image from '../Image';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import st from '../../st';
import theme from '../../theme';
import { TAdventureSingle, TStep, TDataState } from '../../types';
import { getCurrentUserId } from '../../utils/get';
import {
  getMyAdventure,
  getAdventureStepMessages,
  getAdventureSteps,
  interactionVideoPlay,
} from '../../actions/requests';
import AdventureStepCard from '../AdventureStepCard';

import styles from './styles';

const sceletonLayout = [
  {
    key: 'block1',
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.secondaryAlt,
  },
  {
    key: 'block2',
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  {
    key: 'block3',
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  {
    key: 'block4',
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  {
    key: 'block5',
    opacity: 0.5,
    width: '100%',
    height: 110,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
];

type AdventureStepCardProps = {
  adventureId: string;
};

function AdventureStepsList(props: AdventureStepCardProps): React.ReactElement {
  const { adventureId } = props;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  /*  const adventure = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId] || {},
  ); */
  // const stepsStruct = { byId: {}, allIds: [] };
  const stepsListIds =
    useSelector(
      ({ data }: { data: TDataState }) =>
        data.adventureSteps[adventureId]?.allIds,
    ) || {};

  useEffect(() => {
    if (adventureId && !stepsListIds.length) {
      dispatch(getAdventureSteps(adventureId));
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  }, [adventureId, stepsListIds.length, dispatch]);

  useEffect(() => {
    if (stepsListIds.length) {
      setLoading(false);
    }
  }, [stepsListIds.length]);

  const renderStep = useCallback(
    ({ item }): React.ReactElement => (
      <AdventureStepCard key={item} stepId={item} adventureId={adventureId} />
    ),
    [],
  );

  // Prefetch data for the next active step and the steps with new messages.
  /* useEffect(() => {
    if (!loading) {
      for (const [key, stepId] of Object.entries(stepsListIds)) {
        if (
          step?.unread_messages > 0 ||
          (step?.status === 'active' && existingMessages.length > 0)
        ) {
          dispatch(
            getAdventureStepMessages(adventureId, stepId),
          );
        }
      }
    }
  }, [loading, stepsListIds]); */

  return (
    <>
      {loading && (<SkeletonContent
        containerStyle={styles.listOfSteps}
        isLoading={loading}
        boneColor={theme.colors.secondaryAlt}
        highlightColor={'rgb(71, 189, 217)'}
        animationType={'pulse'}
        animationDirection={'diagonalTopRight'}
        duration={2000}
        layout={sceletonLayout}
      />)}
      {!loading && (
        <FlatList
          data={stepsListIds}
          renderItem={renderStep}
          style={styles.listOfSteps}
          // removeClippedSubviews={true} // vc-1022
        />
      )}
    </>
  );
}

AdventureStepsList.defaultProps = {
  adventureId: '',
};

export default AdventureStepsList;
