import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getMessages, createMessage } from '../../actions/messages';
import PropTypes from 'prop-types';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';

import { Flex, Icon, Button } from '../../components/common';
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
    this.getMessages = this.getMessages.bind(this);
    this.createMessage = this.createMessage.bind(this);
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

  componentDidMount() {
    this.getMessages();
  }

  handleLoadMore() {
    this.setState({ isLoadingMore: true });
    console.warn('Making API call to load more');
    setTimeout(() => {
      this.setState({ isLoadingMore: false });
    }, 1000);
  }

  getMessages() {
    this.props.dispatch(getMessages(this.props.conversation.id));
  }

  createMessage() {
    let data = {
      message: {
        content: this.state.text,
      },
    };
    this.props.dispatch(createMessage(this.props.conversation.id, data)).then(()=> {
      this.setState({ text: '' });
    });
  }

  updateSize(height) {
    this.setState({ height });
  }

  render() {
    // const { messages = [] } = this.props.navigation.state.params;
    const { messages, me } = this.props;
    const currentConversation = this.props.conversation.id;
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
          user={me}
          messengers={this.props.conversation.messengers}
          onSelectVideo={(m) => this.setState({ selectedVideo: m })}
        />
        <Flex direction="row" style={[styles.inputWrap, newWrap]} align="center" justify="center">
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
          <Button
            type="transparent"
            style={styles.sendButton}
            icon="send"
            iconStyle={styles.sendIcon}
            onPress={()=> this.createMessage()}
          />
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}


Message.propTypes = {
  ...NavPropTypes,
  conversation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ messages, auth }) => ({
  messages: messages.messages,
  me: auth.user,
});

export default connect(mapStateToProps, nav)(Message);
