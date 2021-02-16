import AdvLanguageSwitch from 'domain/Adventures/AdvLanguageSwitch';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, FlatList, RefreshControl } from 'react-native';
import Touchable from 'components/Touchable';
import AvailableAdventureItem from 'components/AvailableAdventureItem';
import theme from 'utils/theme';
import { RootState } from 'reducers';
import { useTranslation } from 'react-i18next';
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';

import { getAvailableAdventures } from '../../../actions/requests';

import styles from './styles';

const AdventuresFind = (): React.ReactElement => {
  const { t } = useTranslation('adventureCode');
  const navigation = useNavigation();
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
      <View style={styles.AdventureActions}>
        <Touchable
          style={styles.haveCode}
          onPress={(): void => navigation.navigate('AdventureCode')}
          testID="ctaHaveCode"
        >
          <Text style={styles.haveCodeLabel}>{t('adventureCodeHaveCode')}</Text>
        </Touchable>
        <AdvLanguageSwitch />
      </View>
      <FlatList
        renderItem={({ item }): React.ReactElement => {
          return item?.id ? <AvailableAdventureItem {...item} /> : <></>;
        }}
        data={availableAdventures}
        style={{ width: '100%', paddingBottom: 120 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default AdventuresFind;
