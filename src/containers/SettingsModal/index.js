import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import st from '../../st';
import ModalBackButton from '../../components/ModalBackButton';
import ImageCard from '../../components/ImageCard';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import { useSafeArea } from 'react-native-safe-area-context';

function SettingsModal(props) {
  const insets = useSafeArea();

  return (
    <Flex value={1} style={[st.bgWhite]}>
      <ModalBackButton />
      <Flex self="stretch" justify="end" value={1}>
        <Flex style={[st.bgDarkPurple, { height: insets.bottom }]}></Flex>
      </Flex>
    </Flex>
  );
}

export default SettingsModal;
