import React, { Component } from 'react';
import { Alert, View, StatusBar, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { toastAction } from '../../actions/auth';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { Icon, Flex, Touchable, Text } from '../../components/common';
import BACK_ICON from '../../../images/back_button_transparent.png';

class VideoDetails extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.selectContact = this.selectContact.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }

  selectContact(contact) {
    console.warn('contact selected', contact);
  }

  handleVideoChange(videoState) {
    // console.warn(videoState);
    if (videoState === webviewStates.ERROR) {
      this.props.dispatch(toastAction('There was an error playing the video.'));
    }
  }


  renderContent() {
    const video = this.props.video;

    return (
      <Flex direction="column" style={{ paddingBottom: 110 }}>
        <Text style={styles.videoTitle}>{video.name}</Text>
        <Text style={styles.detail}>{video.description}</Text>
        <Text style={styles.label}>Themes</Text>
        <Flex direction="row">
          {
            video.tags.map((t, index)=> (
              <Text key={t.id} style={styles.detail}>
                {t.name}
                {
                  index != video.tags.length-1 ? (', ') : null
                }
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
          <WebviewVideo
            type={video.media.type}
            url={video.media.url}
            start={video.media_start || 0}
            onChangeState={this.handleVideoChange}
          />
          <View style={styles.backHeader}>
            <Touchable borderless={true} onPress={() => this.props.navigateBack()}>
              <View>
                <Image source={BACK_ICON} style={styles.backIcon} />
              </View>
            </Touchable>
          </View>
        </Flex>
        <ScrollView style={styles.content}>
          {this.renderContent()}
        </ScrollView>
        <FloatingButtonSingle
          onSelect={() => {
            Alert.alert(
              'Add video to chat?',
              `Are you sure you want to add ${'video name'} video to your chat?`,
              [
                { text: 'Cancel' },
                { text: 'Add', onPress: () => {
                  this.props.navigatePush('voke.SelectFriend', {
                    video: video.id,
                  });
                }},
              ]
            );
          }}
        />
      </View>
    );
  }
}

VideoDetails.propTypes = {
  ...NavPropTypes,
  video: PropTypes.object,
};

export default connect(null, nav)(VideoDetails);
