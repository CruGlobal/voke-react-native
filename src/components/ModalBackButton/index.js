import React from 'react';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function ModalBackButton({ isClose = false, size, onPress }) {
  const navigation = useNavigation();

  return (
    <Flex self="stretch" align="start">
      <VokeIcon
        name={isClose ? 'close' : 'back_button'}
        style={[st.ml5, st.mt5, { color: 'rgba(255,255,255,0.6)' }]}
        size={size || 26}
        onPress={() => (onPress ? onPress() : navigation.goBack())}
      />
    </Flex>
  );
}

export default ModalBackButton;
