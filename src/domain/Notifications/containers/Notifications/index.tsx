import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'components/Flex';
import Video from 'components/Video';
import NotificationItem from 'components/NotificationItem';
import {
  getNotifications,
  markReadNotification,
  interactionVideoPlay,
} from 'actions/requests';
import st from 'utils/st';
import { useMount, lockToPortrait } from 'utils';

function Notifications() {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const me = useSelector(({ auth }) => auth.user);
  const notificationPagination = useSelector(
    ({ data }) => data.notificationPagination,
  );
  // We have to use Ref here to be able to get current value within useCallback.
  const notifications = React.useRef([]);
  const notificationUnreads = React.useRef(0);
  notifications.current = useSelector(({ data }) => data.notifications);
  notificationUnreads.current = useSelector(
    ({ data }) => data.notificationUnreadBadge,
  );
  const [updatedPagination, setUpdatedPagination] = useState(
    notificationPagination,
  );
  const [currentNotifications, setCurrentNotifications] = useState(
    [notifications.current].reverse(),
  );

  const [videoToShow, setVideoToShow] = useState(null);

  const markNotificationsAsRead = () => {
    const notificationUnreadBadge = notificationUnreads.current;
    // When the screen is focused:
    if (notificationUnreadBadge > 0) {
      const latestNotification = notifications.current[0];

      if (latestNotification?.id) {
        dispatch(
          markReadNotification({
            conversationId: latestNotification?.conversation_id,
            notificationId: latestNotification?.id,
          }),
        );
      }
    }
  };

  useEffect(() => {
    setUpdatedPagination(notificationPagination);
  }, [notificationPagination]);

  useEffect(() => {
    setCurrentNotifications(notifications.current);
  }, [notifications.current.length]);

  // Events firing when user leaves the screen
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      markNotificationsAsRead(); // TODO: Verify how closure affects it?
      return (): void => {
        // When the screen is unfocused:
      };
    }, []),
  );

  useMount(() => {
    dispatch(getNotifications());
    lockToPortrait();
  });

  async function loadMore(resetToPageOne = false) {
    const query = {};

    if ((!updatedPagination || !updatedPagination.hasMore) && !resetToPageOne) {
      return;
    }
    const page = updatedPagination.page + 1;
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

  function handleSelectVideo(message) {
    setVideoToShow(message);
  }

  return (
    <Flex
      direction="column"
      justify={videoToShow ? 'start' : 'end'}
      align="center"
      style={[
        {
          width: '100%',
        },
        st.h100,
      ]}
    >
      {videoToShow && (
        <Video
          // hideBack={true}
          // hideInsets={true}
          onCancel={() => setVideoToShow(null)}
          onOrientationChange={(orientation: string): void => {
            // setIsPortrait( orientation === 'portrait' ? true : false);
          }}
          item={videoToShow.item.media}
          lockOrientation={true}
          autoPlay={true}
          onPlay={() => {
            dispatch(
              interactionVideoPlay({
                videoId: videoToShow.item.id,
                context: 'notifications',
              }),
            );
          }}
        />
      )}
      <>
        <View
          style={[
            {
              width: '100%',
              paddingBottom: insets.bottom,
            },
            st.bgBlue,
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
            contentContainerStyle={{ paddingBottom: 120 }}
            // removeClippedSubviews={true} // vc-1022
            onRefresh={() => loadMore(true)}
            refreshing={isLoading}
            onEndReached={() => loadMore()}
          />
        </View>
      </>
    </Flex>
  );
}

export default Notifications;
