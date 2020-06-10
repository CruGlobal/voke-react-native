import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';
import { ScrollView, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount, lockToPortrait } from '../../utils';
import NotificationItem from '../../components/NotificationItem';
import { getNotifications, markReadNotification } from '../../actions/requests';

function Notifications(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const me = useSelector(({ auth }) => auth.user);
  const notifications = useSelector(({ data }) => data.notifications);
  const notificationLatestId = useSelector(({ data }) => data.notificationLatestId);
  const notificationUnreadBadge = useSelector(({ data }) => data.notificationUnreadBadge);
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
    lockToPortrait();
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
    const latestNotification = notifications[0];
    setCurrentNotifications(notifications);
    if ( notificationLatestId !== latestNotification?.id || notificationUnreadBadge > 0 ) {
      dispatch(markReadNotification(latestNotification?.id));
    }
  }, [notifications]);

  function handleSelectVideo(message) {
    setVideoToShow(message);
  }

  return (
    <Flex
      direction="column"
      justify={ videoToShow ? "start" : "end"}
      align="center"
      style={[
        {
          width:'100%',
        },
        st.h100
      ]}
    >
      { videoToShow && (
        <Video
          // hideBack={true}
          // hideInsets={true}
          onCancel={() => setVideoToShow(null)}
          onOrientationChange={(orientation: string): void => {
            // setIsPortrait( orientation === 'portrait' ? true : false);
          }}
          item={videoToShow.item.media}
          lockOrientation={true}
          autoPlay = {true}
        />
      ) }
      { isPortrait && (
        <>
          <ScrollView
            style={[
              {
                width:'100%',
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
              style={{
                width:'100%'
              }}
              removeClippedSubviews={true}
              onRefresh={() => loadMore(true)}
              refreshing={isLoading}
              onEndReached={() => loadMore()}
            />
            {/* Extra spacing for bottom navigation tabs */}
            <View style={{height:120}}></View>
          </ScrollView>
        </>
      )}
    </Flex>
  );
}

export default Notifications;
