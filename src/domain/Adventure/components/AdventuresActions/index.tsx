import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import lodash from 'lodash';
import Flex from 'components/Flex';
import Text from 'components/Text';
import st from 'utils/st';
import theme from 'utils/theme';
import Touchable from 'components/Touchable';

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
    <Flex direction="row" align="flex-start" justify="flex-start">
      <Touchable
        style={[st.p4, st.mt6]}
        onPress={() => navigation.navigate('AdventureCode')}
        testID="ctaHaveCode"
      >
        <Flex direction="column" align="center" justify="center">
          <Text
            style={[st.white, st.fs18, { textDecorationLine: 'underline' }]}
          >
            {t('adventureCodeHaveCode')}
          </Text>
        </Flex>
      </Touchable>
    </Flex>
  );
}

export default AdventuresActions;