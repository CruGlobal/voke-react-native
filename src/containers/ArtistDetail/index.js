import React from 'react';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import ImageCard from '../../components/ImageCard';
import Image from '../../components/Image';
import st from '../../st';
import { ARTIST_CARD_LARGE } from '../../constants';
import TrackCard from '../../components/TrackCard';

import DEMO from '../../assets/cover.jpg';
import Icon from '../../components/Icon';

const artistCardStyle = {
  width: ARTIST_CARD_LARGE,
  height: ARTIST_CARD_LARGE,
  borderRadius: ARTIST_CARD_LARGE,
  marginBottom: 15,
};
const tracks = [1, 2, 3, 4, 5, 6, 7, 8];

function ArtistDetail({ isAlbum = false }) {
  return (
    <ScrollView style={[st.bgPurple]}>
      <Flex direction="column" align="center" style={[st.ph4, st.pv4]}>
        <Flex style={[{ width: st.fullWidth, height: st.fullWidth * 0.4 }]}>
          <Text
            style={[
              st.purple,
              st.mt0,
              st.bgTransparent,
              st.fontTitle,
              {
                fontSize: 150,
                textShadowColor: st.colors.orange,
                textShadowOffset: { width: 0.1, height: 0.1 },
                textShadowRadius: 1,
              },
            ]}
          >
            {'Capital City Music'.toUpperCase()}
          </Text>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        align="center"
        style={[{ marginTop: st.fullWidth * 0.2 }]}
      >
        <Flex direction="row">
          <Text
            style={[st.white, st.fs1, st.ph2, st.pv4, st.fontTitle, st.tac]}
          >
            {'Capital City Music'.toUpperCase()}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="column" style={[st.pt4]}>
        {tracks.map(t => (
          <TrackCard onPress={() => {}} key={t} />
        ))}
      </Flex>
      <Flex direction="column" align="center" style={[st.abstlr, { top: 30 }]}>
        <Flex direction="row" justify="center" align="center">
          <Flex
            align="center"
            justify="center"
            style={[{ width: st.fullWidth * 0.15, paddingTop: 100 }]}
          >
            <Icon
              name="share"
              style={[{ width: 25, height: 20 }]}
              containerStyle={[st.pd3]}
              onPress={() => {}}
            />
          </Flex>
          <ImageCard source={DEMO} style={artistCardStyle} />
          <Flex
            align="center"
            justify="center"
            style={[{ width: st.fullWidth * 0.15, paddingTop: 100 }]}
          >
            <Icon
              name="favorite_inactive"
              style={[{ width: 25, height: 25 }]}
              containerStyle={[st.pd3]}
              onPress={() => {}}
            />
          </Flex>
        </Flex>
      </Flex>
    </ScrollView>
  );
}

export default ArtistDetail;
