import React, { useState, useRef, forwardRef, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, ScrollView, FlatList, View } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import StatusBar from '../../components/StatusBar';
import VokeIcon from '../../components/VokeIcon';
import { useMount } from '../../utils';

import st from '../../st';
import theme from '../../theme';

import { getVideos } from '../../actions/requests';
import VideoItem from '../../components/VideoItem';
import Button from '../../components/Button';
import { toastAction } from '../../actions/info';

function VideoList() {
  const navigation = useNavigation();

  const allVideos = useSelector(({ data }) => data.allVideos);
  const featuredVideos = useSelector(({ data }) => data.featuredVideos);
  const popularVideos = useSelector(({ data }) => data.popularVideos);
  const favoriteVideos = useSelector(({ data }) => data.favoriteVideos);
  const searchVideos = useSelector(({ data }) => data.searchVideos);
  const videoPagination = useSelector(({ data }) => data.videoPagination);

  const [updatedPagination, setUpdatedPagination] = useState(videoPagination);
  const THUMBNAIL_HEIGHT = ((st.fullWidth - 20) * 1) / 2;
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState(allVideos || []);
  const ITEM_HEIGHT = THUMBNAIL_HEIGHT + 100 + 20;
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();
  function handleRefresh() {
    loadVideos();
  }

  useEffect(() => {
    setUpdatedPagination(videoPagination);
  }, [videoPagination]);

  useMount(() => {
    loadVideos(true);
  });

  async function loadVideos(overrideIsLoading) {
    const query = {};
    if (filter === 'Featured') {
      query.featured = true;
    }
    if (filter === 'Popular') {
      query.popularity = true;
    }
    if (filter === 'Favorite') {
      query.favorite = '#<Messenger::Favorite:0x007ffd7c4afb60>';
    }

    try {
      if (!overrideIsLoading) setIsLoading(true);
      await dispatch(getVideos(query));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (filter === 'All') {
      setVideos(allVideos);
    }
    if (filter === 'Featured') {
      setVideos(featuredVideos);
    }
    if (filter === 'Popular') {
      setVideos(popularVideos);
    }
    if (filter === 'Favorite') {
      setVideos(favoriteVideos);
    }
  }, [allVideos, featuredVideos, popularVideos, favoriteVideos]);

  async function loadMore(resetToPageOne = false) {
    let page;
    const query = {};

    if (
      (!updatedPagination[filter] || !updatedPagination[filter].hasMore) &&
      !resetToPageOne
    ) {
      return;
    }
    page = updatedPagination[filter].page + 1;
    query.page = page;
    if (resetToPageOne) {
      query.page = 1;
    }
    if (filter === 'Featured') {
      query.featured = true;
    }
    if (filter === 'Popular') {
      query.popularity = true;
    }
    if (filter === 'Favorite') {
      query.favorite = '#<Messenger::Favorite:0x007ffd7c4afb60>';
    }

    try {
      setIsLoading(true);
      await dispatch(getVideos(query));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (filter === 'Search') {
      navigation.navigate('VideosSearch', {
        onSelect: async tagId => {
          await dispatch(getVideos({ tag_id: tagId }));
          setVideos(searchVideos);
        },
      });
    }
    if (filter === 'All') {
      if (allVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(allVideos);
      }
    }
    if (filter === 'Featured') {
      if (featuredVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(featuredVideos);
      }
    }
    if (filter === 'Popular') {
      if (popularVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(popularVideos);
      }
    }
    if (filter === 'Favorite') {
      loadVideos();
    }
  }, [filter]);
  return (
    <View style={[st.f1, st.bgBlue]}>
      <FlatList
        initialNumToRender={4}
        data={videos}
        renderItem={props => <VideoItem key={props.item.id} {...props} />}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={[st.f1]}
        contentContainerStyle={[st.mv5]}
        onRefresh={() => loadMore(true)}
        refreshing={isLoading}
        onEndReached={() => loadMore()}
        ListHeaderComponent={() => (
          <>
            <FlatList
              horizontal
              style={[st.pv5, st.ph5]}
              data={['All', 'Featured', 'Popular', 'Favorite', 'Search']}
              renderItem={({ item }) => (
                <Button
                  key={item}
                  onPress={() => {
                    if (filter === item && item === 'Search') {
                      navigation.navigate('VideosSearch', {
                        onSelect: async tagId => {
                          await dispatch(getVideos({ tag_id: tagId }));
                          setVideos(searchVideos);
                        },
                      });
                    } else {
                      setFilter(item);
                    }
                  }}
                  style={[
                    st.pv7,
                    st.ph4,
                    st.aic,
                    st.jcc,
                    st.mr5,
                    st.bw1,
                    st.br1,
                    filter === item
                      ? [st.bgDarkBlue, st.borderDarkBlue]
                      : [st.bgTransparent, st.borderWhite],
                  ]}
                >
                  {item === 'Favorite' || item === 'Search' ? (
                    <VokeIcon
                      name={item === 'Favorite' ? 'heart' : 'search'}
                      size={22}
                    />
                  ) : (
                    <Text style={[st.white, st.fs18]}>{item}</Text>
                  )}
                </Button>
              )}
            />
            {videos.length === 0 ? (
              <Flex align="center" justify="center">
                <Text style={[st.fs16, st.white, st.pt5, st.tac]}>
                  No Videos
                </Text>
              </Flex>
            ) : null}
          </>
        )}
        removeClippedSubviews
      />
    </View>
  );
}

function ChannelList() {
  const dispatch = useDispatch();
  useMount(() => {});
  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <Text>NOTHING YET</Text>
    </ScrollView>
  );
}

function CustomTabBar(props) {
  return (
    <TabBar
      {...props}
      indicatorStyle={[st.bgWhite]}
      style={{ backgroundColor: theme.colors.secondary }}
      activeColor={st.colors.white}
      inactiveColor={st.colors.blue}
      renderLabel={({ route, focused, color }) => (
        <Text style={[{ color }, st.fs16, st.fontFamilyMain, st.pv5]}>
          {route.title}
        </Text>
      )}
    />
  );
}

function Videos(props) {
  console.log('📟 Containers > Videos');
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState(0);

  useMount(() => {
    Orientation.lockToPortrait();
  });

  const [routes] = React.useState([
    { key: 'videos', title: 'Videos' },
    { key: 'channels', title: 'Channels' },
  ]);

  const renderScene = SceneMap({
    videos: VideoList,
    channels: ChannelList,
  });
  return (
    <>
      <StatusBar />
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: st.fullWidth }}
          renderTabBar={props => <CustomTabBar {...props} />}
        /> */}
        <VideoList />
      </Flex>
    </>
  );
}

export default Videos;
