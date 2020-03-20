import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import st from '../../st';
import ModalBackButton from '../../components/ModalBackButton';
import ImageCard from '../../components/ImageCard';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import { useSafeArea } from 'react-native-safe-area-context';
import DEMO from '../../assets/cover.jpg';
import MusicPlayer from '../../components/MusicPlayer';

function MusicPlayerModal(props) {
  const insets = useSafeArea();

  return (
    <Flex value={1}>
      <ModalBackButton />
      <Flex direction="column" align="center">
        <ImageCard
          source={DEMO}
          style={[{ height: st.fullWidth * 0.75, width: st.fullWidth * 0.75 }]}
        />
        <Flex
          direction="row"
          justify="start"
          self="stretch"
          style={[st.pv4, st.ph3]}
        >
          <Icon name="tribl" size={25} style={[st.mr5]} />
          <Flex direction="column">
            <Text style={[st.tal, st.white, st.fontTitle, st.fs2]}>
              {'everything featuring Nathen Jess'.toUpperCase()}
            </Text>
            <Text>
              <Text style={[st.tal, st.normalText, st.fs5]}>By </Text>
              <Text style={[st.tal, st.white, st.fs5, st.underline]}>
                Open Skies Worship{' '}
              </Text>
              <Text style={[st.tal, st.normalText, st.fs5]}>On </Text>
              <Text style={[st.tal, st.white, st.fs5, st.underline]}>
                TRIBL NIGHTS: Ireland
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex self="stretch" justify="end" value={1}>
        <MusicPlayer />
        <Flex style={[st.bgDarkPurple, { height: insets.bottom }]}></Flex>
      </Flex>
    </Flex>
  );
}

export default MusicPlayerModal;
