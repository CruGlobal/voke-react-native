import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, FlatList, RefreshControl } from 'react-native';
import AvailableAdventureItem from 'components/AvailableAdventureItem';
import theme from 'utils/theme';
import { RootState } from 'reducers';

import { getAvailableAdventures } from '../../../actions/requests';
import AdventuresActions from '../../Adventure/components/AdventuresActions';

const AdventuresFind = (): React.ReactElement => {
  const [refreshing, setRefreshing] = useState(false);
  const availableAdventures = useSelector(
    ({ data }: RootState) => data.availableAdventures,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (availableAdventures.length === 0) {
      dispatch(getAvailableAdventures());
    }
  }, [availableAdventures.length, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAvailableAdventures());
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}
    >
      {/* Block: Have Adventure Code? */}
      <AdventuresActions />
      <FlatList
        renderItem={({ item }): React.ReactElement => {
          return item?.id ? <AvailableAdventureItem {...item} /> : <></>;
        }}
        data={availableAdventures}
        style={{ width: '100%' }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      {/* Extra spacing for bottom navigation tabs */}
      <View style={{ height: 120 }} />
    </View>
  );
};

export default AdventuresFind;
