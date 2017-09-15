import React, { Component } from 'react';
import { Alert, View, StatusBar, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { toastAction } from '../../actions/auth';

import theme from '../../theme';
import styles from './styles';
import ApiLoading from '../ApiLoading';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { VokeIcon, Flex, Touchable, Text } from '../../components/common';

class VideoDetails extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarHidden: true,
    tabBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      hideWebview: true,
    };
    
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.selectContact = this.selectContact.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }
  
  componentDidMount() {
    Analytics.screen('Video Details');
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
    // LOG(videoState);
    if (videoState === webviewStates.ERROR) {
      if (this.props.video.content_type === 'arclight') return;
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
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={styles.video}>
          {
            this.state.hideWebview ? null : (
              <WebviewVideo
                type={video.media.type}
                url={video.media.url}
                start={video.media_start || 0}
                onChangeState={this.handleVideoChange}
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
            if (this.props.onSelectVideo) {
              Alert.alert(
                'Add video to chat?',
                `Are you sure you want to add ${'video name'} video to your chat?`,
                [
                  { text: 'Cancel' },
                  { text: 'Add', onPress: () => {
                    this.props.onSelectVideo(video.id);
                    this.props.navigateBack();
                  }},
                ]
              );
            } else {
              this.props.navigatePush('voke.SelectFriend', {
                video: video.id,
              });
            }
          }}
        />
        <ApiLoading showMS={2000} />
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
