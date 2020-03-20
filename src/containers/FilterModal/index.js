import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import st from '../../st';
import ScrollWheel from '../../components/ScrollWheel';
import ModalBackButton from '../../components/ModalBackButton';

function InfoModal(props) {
  const insets = useSafeArea();

  return (
    <Flex style={[st.bgTransparent]}>
      colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)']}
      style={[{ paddingTop: insets.top, height: st.fullHeight }]}
      >
      <ModalBackButton />
      <Flex value={1} justify="center">
        <ScrollWheel />
      </Flex>
    </Flex>
  );
}

export default InfoModal;
