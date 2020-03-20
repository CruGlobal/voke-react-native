import React from 'react';
import Flex from '../Flex';
import Icon from '../Icon';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function HeaderRight() {
  const navigation = useNavigation();
  return (
    <Flex direction="row" style={[st.pr4]} align="center">
      <Icon
        name="filter"
        style={[{ width: 20, height: 20 }]}
        containerStyle={[st.pl4, st.pr5]}
        onPress={() => navigation.navigate('FilterModal')}
      />
      <Icon
        name="search"
        style={[{ width: 20, height: 20 }]}
        containerStyle={[st.pl4]}
        onPress={() => navigation.navigate('SearchModal')}
      />
    </Flex>
  );
}

export default HeaderRight;
