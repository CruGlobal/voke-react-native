import AdvLanguageSwitch from 'domain/Adventures/AdvLanguageSwitch';

import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'components/Flex';
import Text from 'components/Text';
import st from 'utils/st';
import Touchable from 'components/Touchable';
import { View } from 'react-native';

import styles from './styles';

function AdventuresActions() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation('adventureCode');
  const availableAdventures = useSelector(
    ({ data }) => data.availableAdventures,
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);
  return (
    <View style={styles.container}>
      <Touchable
        style={styles.haveCode}
        onPress={(): void => navigation.navigate('AdventureCode')}
        testID="ctaHaveCode"
      >
        <Text style={styles.haveCodeLabel}>{t('adventureCodeHaveCode')}</Text>
      </Touchable>
      <AdvLanguageSwitch />
    </View>
  );
}

export default AdventuresActions;
