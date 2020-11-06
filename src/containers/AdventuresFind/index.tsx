import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, FlatList } from 'react-native';

import { RootState } from '../../reducers';
import { getAvailableAdventures } from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import AdventuresActions from '../AdventuresActions';
import theme from '../../theme';

const AdventuresFind = (): React.ReactElement => {
  const availableAdventures = useSelector(
    ({ data }: RootState) => data.availableAdventures,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (availableAdventures.length === 0) {
      dispatch(getAvailableAdventures());
    }
  }, [availableAdventures.length, dispatch]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      {/* Block: Have Adventure Code? */}
      <AdventuresActions />
      <FlatList
        renderItem={({ item }): React.ReactElement => {
          return item?.id ? <AvailableAdventureItem {...item} /> : <></>;
        }}
        data={availableAdventures}
        style={{ width: '100%' }}
      />
      {/* Extra spacing for bottom navigation tabs */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

export default AdventuresFind;
