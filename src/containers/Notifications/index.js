import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';
import { ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount } from '../../utils';
import NotificationItem from '../../components/NotificationItem';
import { getNotifications } from '../../actions/requests';

function Notifications(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const me = useSelector(({ auth }) => auth.user);
  const notifications = useSelector(({ data }) => data.notifications);
  const notificationPagination = useSelector(
    ({ data }) => data.notificationPagination,
  );
  const [updatedPagination, setUpdatedPagination] = useState(
    notificationPagination,
  );
  const [currentNotifications, setCurrentNotifications] = useState(
    [notifications].reverse(),
  );

  const [videoToShow, setVideoToShow] = useState(null);

  useEffect(() => {
    setUpdatedPagination(notificationPagination);
  }, [notificationPagination]);

  useMount(() => {
    dispatch(getNotifications());
  });

  async function loadMore(resetToPageOne = false) {
    let page;
    let query = {};

    if ((!updatedPagination || !updatedPagination.hasMore) && !resetToPageOne) {
      return;
    }
    page = updatedPagination.page + 1;
    query.page = page;
    if (resetToPageOne) {
      query.page = 1;
    }

    try {
      setIsLoading(true);
      await dispatch(getNotifications(query));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentNotifications(notifications);
  }, [notifications]);

  function handleSelectVideo(message) {
    setVideoToShow(message);
  }

  return (
    <Flex
      direction="column"
      justify="end"
      align="center"
      style={[st.w100, st.h100]}
    >
      {videoToShow ? (
        <Video
          hideBack={true}
          hideInsets={true}
          onCancel={() => setVideoToShow(null)}
          onOrientationChange={orientation =>
            orientation === 'portrait'
              ? setIsPortrait(true)
              : setIsPortrait(false)
          }
          item={videoToShow.item.media}
        />
      ) : null}
      {isPortrait && videoToShow ? null : (
        <>
          <ScrollView
            style={[
              st.w(st.fullWidth),
              st.bgBlue,
              { paddingBottom: insets.bottom },
              st.f1,
            ]}
          >
            <FlatList
              renderItem={props => (
                <NotificationItem
                  key={props.item.id}
                  onSelectVideo={message => handleSelectVideo(message)}
                  {...props}
                />
              )}
              data={currentNotifications}
              style={[st.w(st.fullWidth)]}
              removeClippedSubviews={true}
              onRefresh={() => loadMore(true)}
              refreshing={isLoading}
              onEndReached={() => loadMore()}
            />
          </ScrollView>
        </>
      )}
    </Flex>
  );
}

export default Notifications;
