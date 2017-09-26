import React, { Component } from 'react';
import { Alert, View, ScrollView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

class VideoDetails extends Component {

  static navigatorStyle = {
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarHidden: true,
    tabBarHidden: true,
    statusBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      hideWebview: true,
      isFromVideos: true,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.selectContact = this.selectContact.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Video Details');
    if (this.props.fromVideos) {
      this.setState({isFromVideos: true});
    } else { this.setState({isFromVideos: false});}
  }

  onNavigatorEvent(event) {
    // Hide the webview until the screen is mounted
    if (event.id === 'didAppear') {
      this.setState({ hideWebview: false });
    }
  }

  selectContact(contact) {
    LOG('contact selected', contact);
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
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={styles.video}>
          {
            this.state.hideWebview ? null : (
              <WebviewVideo
                ref={(c) => this.webview = c}
                type={videoType}
                url={videoMedia.url}
                start={video.media_start || 0}
                onChangeState={this.handleVideoChange}
                fromVideos={this.state.isFromVideos || false}
              />
            )
          }
          <View style={styles.backHeader}>
            <Touchable borderless={true} onPress={() => this.props.navigateBack()}>
              <View>
                <VokeIcon name="video-back" style={styles.backImage} />
              </View>
            </Touchable>
          </View>
        </Flex>
        <ScrollView style={styles.content}>
          {this.renderContent()}
        </ScrollView>
        <FloatingButtonSingle
          onSelect={() => {
            // TODO: Force video to pause when navigating away
            // this.webview.pause();
            if (this.props.onSelectVideo) {
              Alert.alert(
                'Add video to chat?',
                `Are you sure you want to add "${video.name.substr(0, 25).trim()}" video to your chat?`,
                [
                  { text: 'Cancel' },
                  { text: 'Add', onPress: () => {
                    this.props.onSelectVideo(video.id);
                    this.props.navigateBack();
                  }},
                ]
              );
            } else {
              this.setState({isFromVideos: false});
              this.props.navigatePush('voke.SelectFriend', {
                video: video.id,
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
  fromVideos: PropTypes.bool,
};

export default connect(null, nav)(VideoDetails);
