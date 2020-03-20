import React from 'react';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import RoundButton from '../../components/RoundButton';
import ImageCard from '../../components/ImageCard';
import st from '../../st';
import { PLAYLIST_CARD_HEIGHT, PLAYLIST_CARD_WIDTH } from '../../constants';
import Icon from '../../components/Icon';
import Touchable from '../../components/Touchable';
import TrackCard from '../../components/TrackCard';
import { useNavigation } from '@react-navigation/native';
import DEMO from '../../assets/cover.jpg';
import StatusBar from '../../components/StatusBar';

const playlistCardStyle = {
  width: PLAYLIST_CARD_WIDTH,
  height: PLAYLIST_CARD_HEIGHT,
  marginBottom: 5,
};
const artistCardStyle = {
  width: PLAYLIST_CARD_WIDTH,
  height: PLAYLIST_CARD_WIDTH,
  marginBottom: 5,
  borderRadius: PLAYLIST_CARD_WIDTH,
};
const albumCardStyle = {
  width: PLAYLIST_CARD_WIDTH,
  height: PLAYLIST_CARD_WIDTH,
  marginBottom: 5,
};
const playlists = [1, 2, 3, 4];
const artists = [1, 2, 3, 4];
const albums = [1, 2, 3, 4];
const tracks = [1, 2, 3, 4, 5, 6, 7, 8];

function Home(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();

  return (
    <>
      <StatusBar />
      <ScrollView style={[st.ph4, st.pv3]}>
        <Flex direction="row" justify="between" align="center" style={[st.pb4]}>
          <Text style={[st.fontTitle, st.fs3, st.white]}>PLAYLISTS</Text>
          <RoundButton onPress={() => {}} text="view all" />
        </Flex>
        <Flex direction="row" wrap="wrap" justify="between">
          {playlists.map(i => (
            <Touchable
              onPress={() => navigation.navigate('PlaylistDetail')}
              key={i}
            >
              <Flex direction="column" style={[st.mb4]}>
                <ImageCard source={DEMO} style={playlistCardStyle} />
                <Flex direction="row" justify="start" style={[st.pb7]}>
                  <Icon name="tribl" size={12} />
                  <Text style={[st.white, st.fs4, st.bold, st.pl6]}>Peace</Text>
                </Flex>
                <Text style={[st.white, st.fs6]}>41 songs</Text>
              </Flex>
            </Touchable>
          ))}
        </Flex>
        <Flex
          direction="row"
          justify="between"
          align="center"
          style={[st.pb4, st.pt4]}
        >
          <Text style={[st.fontTitle, st.fs3, st.white]}>ARTISTS</Text>
          <RoundButton onPress={() => {}} text="view all" />
        </Flex>
        <Flex direction="row" wrap="wrap" justify="between">
          {artists.map(i => (
            <Touchable
              onPress={() => navigation.navigate('ArtistDetail')}
              key={i}
            >
              <Flex direction="column" style={[st.mb4]} key={i}>
                <ImageCard source={DEMO} style={artistCardStyle} />
                <Flex direction="row" justify="center" style={[st.pb7]}>
                  <Text style={[st.white, st.fs4, st.bold, st.pl6]}>
                    Maveric City Music
                  </Text>
                </Flex>
              </Flex>
            </Touchable>
          ))}
        </Flex>
        <Flex
          direction="row"
          justify="between"
          align="center"
          style={[st.pb4, st.pt4]}
        >
          <Text style={[st.fontTitle, st.fs3, st.white]}>ALBUMS</Text>
          <RoundButton onPress={() => {}} text="view all" />
        </Flex>
        <Flex direction="row" wrap="wrap" justify="between">
          {albums.map(i => (
            <Flex direction="column" style={[st.mb4]} key={i}>
              <ImageCard source={DEMO} style={albumCardStyle} />
              <Text style={[st.white, st.fs4, st.bold]}>Single- thank you</Text>
              <Text style={[st.normalText, st.fs5, st.pt7]}>
                Maverifc city music
              </Text>
            </Flex>
          ))}
        </Flex>
        <Flex
          direction="row"
          justify="between"
          align="center"
          style={[st.pb4, st.pt4]}
        >
          <Text style={[st.fontTitle, st.fs3, st.white]}>
            MUST-HEAR MOMENTS
          </Text>
        </Flex>
        <Flex direction="column" style={[{ marginBottom: insets.bottom }]}>
          {tracks.map(t => (
            <TrackCard onPress={() => {}} key={t} />
          ))}
        </Flex>
      </ScrollView>
    </>
  );
}

export default Home;
