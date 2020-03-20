import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import st from '../../st';
import SearchBox from '../../components/SearchBox';
import ModalBackButton from '../../components/ModalBackButton';

function InfoModal(props) {
  const insets = useSafeArea();

  return (
    <Flex style={[st.bgTransparent]}>
      <ModalBackButton />
      <Flex value={1} justify="start">
        <SearchBox />
      </Flex>
    </Flex>
  );
}

export default InfoModal;
