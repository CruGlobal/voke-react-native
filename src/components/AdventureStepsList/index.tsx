import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import theme from 'utils/theme';
import { TDataState } from 'utils/types';

import { RootState } from '../../reducers';
import { getAdventureSteps } from '../../actions/requests';
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
  const stepsListIds =
    useSelector(
      ({ data }: RootState) =>
        data.adventureSteps[adventureId as keyof TDataState['adventureSteps']]
          ?.allIds,
    ) || [];
  const nextStep = useRef(0);

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
      <AdventureStepCard
        key={item}
        stepId={item}
        adventureId={adventureId}
        nextStepRef={nextStep}
      />
    ),
    [adventureId],
  );

  return (
    <>
      {loading && (
        <SkeletonContent
          containerStyle={styles.listOfSteps}
          isLoading={loading}
          boneColor={theme.colors.secondaryAlt}
          highlightColor={'rgb(71, 189, 217)'}
          animationType={'pulse'}
          animationDirection={'diagonalTopRight'}
          duration={2000}
          layout={sceletonLayout}
        />
      )}
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
