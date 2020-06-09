import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, FlatList } from 'react-native';
import { useMount } from '../../utils';
import { RootState } from '../../reducers';
import { getAvailableAdventures } from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import AdventuresActions from '../AdventuresActions';
import st from '../../st';
import theme from '../../theme';

const AdventuresFind = (): React.ReactElement => {
  const availableAdventures = useSelector(
    ({ data }: RootState) => data.availableAdventures
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  const dispatch = useDispatch();

  useMount(() => {
    if (availableAdventures.length === 0) {
      dispatch(getAvailableAdventures());
    }
  });

  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);

  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <AdventuresActions style={[st.mr3]}/>
      <FlatList
        renderItem={(props): React.ReactElement => (
          <AvailableAdventureItem {...props} />
        )}
        data={adventures}
        style={[st.w(st.fullWidth)]}
      />
      {/* Extra spacing for bottom navigation tabs */}
      <View style={{height:120}}></View>
    </ScrollView>
  );
};

export default AdventuresFind;
