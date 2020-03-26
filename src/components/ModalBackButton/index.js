import React from 'react';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function ModalBackButton() {
  const navigation = useNavigation();

  return (
    <Flex self="stretch" align="start">
      <VokeIcon
        name="back_button"
        style={[st.ml5, st.mt5, { color: 'rgba(255,255,255,0.6)' }]}
        size={26}
        onPress={() => navigation.goBack()}
      />
    </Flex>
  );
}

export default ModalBackButton;
