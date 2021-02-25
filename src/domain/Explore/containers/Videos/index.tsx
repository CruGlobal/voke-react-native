import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowDimensions, ScrollView, FlatList, View } from 'react-native';
import Flex from 'components/Flex';
import analytics from '@react-native-firebase/analytics';
import Text from 'components/Text';
import VokeIcon from 'components/VokeIcon';
import VideoItem from 'components/VideoItem';
import OldButton from 'components/OldButton';
import { getVideos } from 'actions/requests';
import theme from 'utils/theme';
import st from 'utils/st';
import { useMount, lockToPortrait } from 'utils';

function VideoList() {
  const { t } = useTranslation();

  const allVideos = useSelector(({ data }) => data.allVideos.allIds) || [];
  const featuredVideos =
    useSelector(({ data }) => data.featuredVideos.allIds) || [];
  const popularVideos =
    useSelector(({ data }) => data.popularVideos.allIds) || [];
  const favoriteVideos =
    useSelector(({ data }) => data.favoriteVideos.allIds) || [];
  const searchVideos =
    useSelector(({ data }) => data.searchVideos.allIds) || [];

  const videoPagination = useSelector(({ data }) => data.videoPagination) || [];

  const [videos, setVideos] = useState(allVideos || []);

  const [updatedPagination, setUpdatedPagination] = useState(videoPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [filterId, setFilterId] = useState('allVideos');
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  const THUMBNAIL_HEIGHT = ((window.width - 20) * 1) / 2;
  const ITEM_HEIGHT = THUMBNAIL_HEIGHT + 100 + 20;

  useEffect(() => {
    setUpdatedPagination(videoPagination);
  }, [videoPagination]);

  useMount(() => {
    loadVideos(true);
  });

  async function loadVideos(overrideIsLoading) {
    const query = {};

    if (filterId === 'featuredVideos') {
      query.featured = true;
    }
    if (filterId === 'popularVideos') {
      query.popularity = true;
    }
    if (filterId === 'favoriteVideos') {
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
    switch (filterId) {
      case 'featuredVideos':
        setVideos(featuredVideos);
        break;
      case 'popularVideos':
        setVideos(popularVideos);
        break;
      case 'favoriteVideos':
        setVideos(favoriteVideos);
        break;
      case 'searchVideos':
        setVideos(searchVideos);
        break;
      default:
        setVideos(allVideos);
        break;
    }
  }, [allVideos, featuredVideos, popularVideos, favoriteVideos]);

  async function loadMore(resetToPageOne = false) {
    let page;
    const query = {};

    if (
      (!updatedPagination[filterId] || !updatedPagination[filterId].hasMore) &&
      !resetToPageOne
    ) {
      return;
    }
    page = updatedPagination[filterId].page + 1;
    query.page = page;
    if (resetToPageOne) {
      query.page = 1;
    }
    if (filterId === 'featuredVideos') {
      query.featured = true;
    }
    if (filterId === 'popularVideos') {
      query.popularity = true;
    }
    if (filterId === 'favoriteVideos') {
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
    if (filterId === 'allVideos') {
      if (allVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(allVideos);
      }
    }
    if (filterId === 'featuredVideos') {
      if (featuredVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(featuredVideos);
      }
    }
    if (filterId === 'popularVideos') {
      if (popularVideos.length === 0) {
        loadVideos();
      } else {
        setVideos(popularVideos);
      }
    }
  }, [filterId]);

  const registerAnalyticsEvent = (newSelection: string) => {
    // Google Analytics: Record screen change.
    // https://rnfirebase.io/analytics/screen-tracking#react-navigation
    analytics().logScreenView({
      screen_name: newSelection,
      screen_class: 'VideoList',
    });
  };

  return (
    <View style={[st.f1, st.bgBlue]}>
      <FlatList
        initialNumToRender={4}
        data={videos}
        renderItem={(props) => (
          <VideoItem key={props.item} id={props.item} category={filterId} />
        )}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={[st.f1]}
        contentContainerStyle={[st.mv5, { paddingBottom: 120 }]}
        onRefresh={() => loadMore(true)}
        refreshing={isLoading}
        onEndReached={() => loadMore()}
        ListHeaderComponent={() => (
          <>
            <FlatList
              horizontal
              style={[st.pv5, st.ph5]}
              contentContainerStyle={{
                width: '100%',
                justifyContent: 'center',
              }}
              data={[
                {
                  id: 'allVideos',
                  title: t('all'),
                },
                {
                  id: 'featuredVideos',
                  title: t('featured'),
                },
                {
                  id: 'popularVideos',
                  title: t('popular'),
                },
              ]}
              renderItem={({ item, index, separators }) => (
                <OldButton
                  key={item.id}
                  onPress={() => {
                    registerAnalyticsEvent(item.title);
                    setFilterId(item.id);
                  }}
                  style={[
                    st.pv7,
                    st.ph4,
                    st.aic,
                    st.jcc,
                    st.mr5,
                    st.bw1,
                    st.br1,
                    filterId === item.id
                      ? [st.bgDarkBlue, st.borderDarkBlue]
                      : [st.bgTransparent, st.borderWhite],
                  ]}
                >
                  {item.id === 'favorite' || item.id === 'search' ? (
                    <VokeIcon
                      name={item.id === 'favorite' ? 'heart' : 'search'}
                      size={22}
                      style={{ color: theme.colors.white }}
                    />
                  ) : (
                    <Text style={[st.white, st.fs18]}>{item.title}</Text>
                  )}
                </OldButton>
              )}
            />
            {videos.length === 0 ? (
              <Flex align="center" justify="center">
                <Text style={[st.fs16, st.white, st.pt5, st.tac]}>
                  {t('noVideos')}
                </Text>
              </Flex>
            ) : null}
          </>
        )}
        // removeClippedSubviews // vc-1022
      />
    </View>
  );
}

function Videos() {
  useMount(() => {
    lockToPortrait();
  });

  return (
    <>
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        <VideoList />
      </Flex>
    </>
  );
}

export default Videos;
