import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/nav';
import { toastAction } from '../../actions/auth';
import { createVideoInteraction } from '../../actions/videos';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import StatusBar from '../../components/StatusBar';
import webviewStates from '../../components/WebviewVideo/common';
import { VokeIcon, Flex, Touchable, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VideoDetailsContent from '../VideoDetailsContent';
import OrgJourneyDetail from '../OrgJourneyDetail';
import JourneyDetail from '../JourneyDetail';
import JourneyStepDetail from '../JourneyStepDetail';
import st from '../../st';

class VideoContentWrap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVideo: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showVideo: true }, () => {
        // For iOS margin
        this.webview &&
          this.webview.getWrappedInstance &&
          this.webview.getWrappedInstance() &&
          this.webview.getWrappedInstance().removeMargin &&
          this.webview.getWrappedInstance().removeMargin();
      });
    }, 1000);
  }

  handleVideoChange = videoState => {
    const { t, dispatch, type, item } = this.props;
    if (videoState === webviewStates.ERROR) {
      dispatch(toastAction(t('error.playingVideo')));
    }
    if (videoState === webviewStates.STARTED) {
      console.log('video started');
      let id;
      if (type === 'videoDetail') {
        id = item.id;
      } else {
        id = item.item.id;
      }
      dispatch(createVideoInteraction(id));
    }
  };

  pause = () => {
    if (
      this.webview &&
      this.webview.getWrappedInstance &&
      this.webview.getWrappedInstance() &&
      this.webview.getWrappedInstance().pause
    ) {
      this.webview.getWrappedInstance().pause();
    }
  };

  renderContent() {
    const { type, item, ...rest } = this.props;
    if (type === 'videoDetail') {
      return (
        <VideoDetailsContent video={item} onPause={this.pause} {...rest} />
      );
    }
    if (type === 'orgJourney') {
      return <OrgJourneyDetail item={item} onPause={this.pause} {...rest} />;
    }
    if (type === 'journeyDetail') {
      return <JourneyDetail item={item} onPause={this.pause} {...rest} />;
    }
    if (type === 'journeyStepDetail') {
      return <JourneyStepDetail item={item} onPause={this.pause} {...rest} />;
    }
    return (
      <Flex direction="column" style={{ paddingBottom: 110 }}>
        <Text>CONTENT!!!</Text>
      </Flex>
    );
  }

  render() {
    const { dispatch, item, type } = this.props;
    let videoObj = {};
    let videoProps = {};
    if (type === 'videoDetail') {
      const videoMedia = item.media || {};
      videoObj = {
        start: item.media_start,
        end: item.media_end,
        type: videoMedia.type,
        url: videoMedia.url,
      };
    } else {
      videoProps.forceNoAutoPlay = true;
      videoObj = {
        start: item.item.media_start,
        end: item.item.media_end,
        type: item.item.content.type,
        url: item.item.content.url,
        thumbnail: item.item.content.thumbnails.medium,
      };
    }

    return (
      <SafeArea top="deepBlack" style={[st.f1, st.bgWhite]}>
        <StatusBar />
        <ScrollView bounces={false}>
          <Flex style={styles.video}>
            {this.state.showVideo ? (
              <WebviewVideo
                ref={c => (this.webview = c)}
                video={videoObj}
                onChangeState={this.handleVideoChange}
                isLandscape={false}
                {...videoProps}
              />
            ) : null}
            <BackButton onBack={() => dispatch(navigateBack())} />
          </Flex>
          {this.renderContent()}
        </ScrollView>
      </SafeArea>
    );
  }
}

function BackButton({ onBack }) {
  return (
    <View style={styles.backHeader}>
      <Touchable
        borderless={true}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={onBack}
      >
        <View>
          <VokeIcon name="back_button" style={styles.backImage} />
        </View>
      </Touchable>
    </View>
  );
}

VideoContentWrap.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf([
    'videoDetail',
    'orgJourney',
    'myJourney',
    'journeyDetail',
    'journeyStepDetail',
  ]),
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('videos')(connect(mapStateToProps)(VideoContentWrap));
