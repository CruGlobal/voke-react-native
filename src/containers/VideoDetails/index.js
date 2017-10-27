import React, { Component } from 'react';
import { Alert, View, ScrollView, Platform, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import Orientation from 'react-native-orientation';
import debounce from 'lodash/debounce';

import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { toastAction } from '../../actions/auth';

import theme from '../../theme';
import styles from './styles';
import ApiLoading from '../ApiLoading';
import WebviewVideo from '../../components/WebviewVideo';
import StatusBar from '../../components/StatusBar';
import webviewStates from '../../components/WebviewVideo/common';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { VokeIcon, Flex, Touchable, Text } from '../../components/common';

const isOlderAndroid = Platform.OS === 'android' && Platform.Version < 23;


class VideoDetails extends Component {

  static navigatorStyle = {
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarHidden: true,
    tabBarHidden: true,
    statusBarHidden: true,
    orientation: 'auto',
  };

  constructor(props) {
    super(props);

    this.state = {
      hideWebview: false,
      isLandscape: false,
      timesAppeared: 0,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.orientationDidChange = debounce(this.orientationDidChange.bind(this), 50);
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.

    const initial = Orientation.getInitialOrientation();
    // LOG(initial);
    // Only change this if the app is in landscape mode
    if (initial === 'LANDSCAPE') {
      this.setState({ isLandscape: true });
    }
  }

  componentDidMount() {
    Analytics.screen('Video Details');
    this.toggleOrientation();
    // This doesn't work on Android...because of the navigation stuff
    Orientation.addOrientationListener(this.orientationDidChange);

    // Android is having issues with the orientation stuff, use this workaround
    if (Platform.OS === 'android') {
      Dimensions.addEventListener('change', ({ window: { width, height } }) => {
        const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        this.orientationDidChange(orientation);
      });
    }
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  orientationDidChange(orientation) {
    // LOG('orientation', orientation);
    if (this.props.video.media.type === 'vimeo') {
      return;
    }
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      // LOG('landscape');
      this.setState({ isLandscape: true });
    } else {
      // LOG('portrait');
      // do something with portrait layout
      this.setState({ isLandscape: false });
    }
  }

  toggleOrientation() {
    if (this.props.video.media.type === 'vimeo') {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }
  }

  onNavigatorEvent(event) {
    // Hide the webview until the screen is mounted
    if (event.id === 'didAppear') {
      if (this.state.timesAppeared > 0 && this.webview && this.webview.pause) {
        this.webview.pause();
        this.webview.removeMargin();
      }

      this.setState({ hideWebview: false, timesAppeared: this.state.timesAppeared + 1 });
      this.toggleOrientation();
    }
  }

  handleVideoChange(videoState) {
    if (videoState === webviewStates.ERROR) {
      this.props.dispatch(toastAction('There was an error playing the video.'));
    }
  }

  renderContent() {
    const video = this.props.video;

    return (
      <Flex direction="column" style={{ paddingBottom: 110 }}>
        <Text style={styles.videoTitle}>{video.name}</Text>
        <Text style={styles.detail}>{video.shares} Shares</Text>
        <Text style={styles.detail}>{video.description}</Text>
        <Text style={styles.label}>Themes</Text>
        <Flex direction="row">
          {
            video.tags.map((t, index)=> (
              <Text key={t.id} style={styles.detail}>
                {t.name}
                {index != video.tags.length - 1 ? ', ' : null}
              </Text>
            ))
          }
        </Flex>
        <Text style={styles.label}>Voke kickstarters</Text>
        {
          video.questions.map((q)=> (
            <Flex key={q.id} direction="column">
              <Text style={styles.detail}>
                {q.content}
              </Text>
              <Flex style={styles.kickstarterSeparator}></Flex>
            </Flex>
          ))
        }
      </Flex>
    );
  }

  render() {
    const video = this.props.video || {};
    const videoMedia = video.media || {};
    const videoType = videoMedia.type;

    // Set the loading state duration for different video types
    let loadDuration = 2000;
    if (videoType === 'arclight') {
      loadDuration = 3000; // Longer loading state for arclight videos
    } else if (videoType === 'vimeo' && isOlderAndroid) {
      loadDuration = 3500; // Longer for older android devices and vimeo
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={this.state.isLandscape ? styles.landscapeVideo : styles.video}>
          {
            this.state.hideWebview ? null : (
              <WebviewVideo
                ref={(c) => this.webview = c}
                type={videoType}
                url={videoMedia.url}
                start={video.media_start || 0}
                onChangeState={this.handleVideoChange}
                isLandscape={this.state.isLandscape}
              />
            )
          }
          <View style={styles.backHeader}>
            <Touchable borderless={true} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={() => Navigation.dismissModal()}>
              <View>
                <VokeIcon name="video-back" style={styles.backImage} />
              </View>
            </Touchable>
          </View>
        </Flex>
        <ScrollView style={styles.content}>
          {
            this.state.isLandscape ? null : this.renderContent()
          }
        </ScrollView>
        <FloatingButtonSingle
          onSelect={() => {
            Orientation.lockToPortrait();
            if (this.props.onSelectVideo) {
              Alert.alert(
                'Add video to chat?',
                `Are you sure you want to add "${video.name.substr(0, 25).trim()}" video to your chat?`,
                [
                  { text: 'Cancel' },
                  { text: 'Add', onPress: () => {
                    this.props.onSelectVideo(video.id);
                    // No need to navigate back, just dismiss the VideoDetails modal
                    // this.props.navigateBack();
                    Navigation.dismissModal();
                  }},
                ]
              );
            } else {
              if (this.webview && this.webview.pause) {
                this.webview.pause();
              }
              this.props.navigatePush('voke.SelectFriend', {
                video: video.id,
                isLandscape: this.state.isLandscape,
              });
            }
          }}
        />
        <ApiLoading text="Loading Video" showMS={loadDuration} />
      </View>
    );
  }
}

VideoDetails.propTypes = {
  ...NavPropTypes,
  video: PropTypes.object,
  onSelectVideo: PropTypes.func,
};

export default connect(null, nav)(VideoDetails);
