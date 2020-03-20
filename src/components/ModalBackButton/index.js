import React from 'react';
import Icon from '../Icon';
import Flex from '../Flex';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function ModalBackButton() {
  const navigation = useNavigation();

  return (
    <Flex self="stretch" align="end">
      <Icon name="close" style={[st.m3, st.mt5, { width: 20, height: 20 }]} onPress={() => navigation.goBack()} />
    </Flex>
  );
}

export default ModalBackButton;
