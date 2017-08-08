import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';

import { Flex, Icon } from '../../components/common';
import MessagesList from '../../components/MessagesList';
import LoadMore from '../../components/LoadMore';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: iconsMap['ios-home-outline'], // This is just for iOS
    }],
    rightButtons: [{
      id: 'add',
      icon: Platform.OS === 'android' ? iconsMap['md-add'] : iconsMap['ios-add'],
    }],
  };
}

// <ShareButton message="Share this with you" title="Hey!" url="https://www.facebook.com" />

class Message extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      selectedVideo: null,
      height: 50,
      isLoadingMore: false,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      } else if (event.id == 'add') {
        this.props.navigatePush('voke.MessageTabView', {
          onSelectKickstarter: () => {
            console.warn('selected kickstarter in message!');
          },
          onSelectVideo: () => {
            console.warn('selected video in message!');
          },
        });
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    // this.props.navigator.setTitle({ title: this.props.name || 'Message' });
  }

  handleLoadMore() {
    this.setState({ isLoadingMore: true });
    console.warn('Making API call to load more');
    setTimeout(() => {
      this.setState({ isLoadingMore: false });
    }, 1000);
  }

  updateSize(height) {
    this.setState({ height });
  }

  render() {
    // const { messages = [] } = this.props.navigation.state.params;
    const { messages = [] } = this.props;

    let newHeight = {
      height: this.state.height < 40 ? 40 : this.state.height > 80 ? 80 : this.state.height,
    };

    let newWrap = {
      height: this.state.height < 40 ? 50 : this.state.height > 80 ? 90 : this.state.height + 10,
    };

    // TODO: Figure out how to determine this
    const hasMore = !this.state.selectedVideo && false;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'android' ? undefined : 64}
      >
        {
          this.state.selectedVideo ? (
            <MessageVideoPlayer
              message={this.state.selectedVideo}
              onClose={() => this.setState({ selectedVideo: null })}
            />
          ) : null
        }
        <MessagesList
          ref={(c) => this.list = c}
          isLoadingMore={this.state.isLoadingMore}
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          items={messages}
          onSelectVideo={(m) => this.setState({ selectedVideo: m })}
        />
        <Flex direction="row" style={[styles.inputWrap, newWrap]} align="center">
          <TextInput
            onFocus={() => this.list.scrollEnd(true)}
            onBlur={() => this.list.scrollEnd(true)}
            multiline={true}
            value={this.state.text}
            placeholder="New Message"
            onChangeText={(text) => this.setState({ text })}
            placeholderTextColor={theme.primaryColor}
            underlineColorAndroid={COLORS.TRANSPARENT}
            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            style={[styles.chatBox, newHeight]}
            autoCorrect={true}
          />
          <Icon name="send" size={22} style={styles.sendIcon} />
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}


Message.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Message);
