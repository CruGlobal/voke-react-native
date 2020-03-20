import React from 'react';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import ImageCard from '../../components/ImageCard';
import Image from '../../components/Image';
import st from '../../st';
import {
  PLAYLIST_CARD_LARGE_WIDTH,
  PLAYLIST_CARD_LARGE_HEIGHT,
} from '../../constants';
import TrackCard from '../../components/TrackCard';

import DEMO from '../../assets/cover.jpg';
import Icon from '../../components/Icon';

const playlistCardStyle = {
  width: PLAYLIST_CARD_LARGE_WIDTH,
  height: PLAYLIST_CARD_LARGE_HEIGHT,
  marginBottom: 15,
};

const albumCardStyle = {
  ...playlistCardStyle,
  height: PLAYLIST_CARD_LARGE_WIDTH,
};
const tracks = [1, 2, 3, 4, 5, 6, 7, 8];

function PlaylistDetail({ isAlbum = false }) {
  return (
    <ScrollView style={[st.bgPurple]}>
      <Flex direction="column" align="center" style={[st.mb4, st.ph4, st.pv4]}>
        <ImageCard
          source={DEMO}
          style={isAlbum ? albumCardStyle : playlistCardStyle}
        >
          <Flex style={[st.absbr, st.bgPurple, st.br1, st.m5]}>
            <Icon
              name="play"
              style={[{ width: 40, height: 40 }]}
              onPress={() => {}}
            />
          </Flex>
        </ImageCard>
        <Flex direction="row">
          <Icon name="tribl" size={25} />
          <Text style={[st.white, st.fs2, st.pl5, st.fontTitle]}>
            {'Single- thank you'.toUpperCase()}
          </Text>
        </Flex>
        <Text style={[st.normalText, st.fs4, st.pt5]}>
          By {'Tribl'} • 18 songs
        </Text>
        <Flex direction="row" align="center" justify="center" style={[st.pt4]}>
          <Icon
            name="share"
            style={[{ width: 30, height: 25 }]}
            containerStyle={[st.pd3, st.pb6]}
            onPress={() => {}}
          />
          <Icon
            name="favorite_inactive"
            style={[{ width: 32, height: 25 }]}
            containerStyle={[st.pd3, st.pb6]}
            onPress={() => {}}
          />
        </Flex>
      </Flex>
      <Flex direction="column" style={[st.pt4]}>
        {tracks.map(t => (
          <TrackCard onPress={() => {}} key={t} />
        ))}
      </Flex>
    </ScrollView>
  );
}

export default PlaylistDetail;
