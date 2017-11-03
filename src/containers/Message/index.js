import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { startupAction } from '../../actions/auth';
import { getMessages, createMessage, createTypeStateAction, destroyTypeStateAction, createMessageInteraction, markReadAction, getConversation } from '../../actions/messages';
import Analytics from '../../utils/analytics';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { vokeIcons } from '../../utils/iconMap';

import { SET_ACTIVE_CONVERSATION } from '../../constants';
import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';
import ApiLoading from '../ApiLoading';

import { Flex, VokeIcon, Button, Touchable } from '../../components/common';
import MessagesList from '../../components/MessagesList';
import { UNREAD_CONV_DOT } from '../../constants';

function setButtons(showDot) {
  if (showDot) {
    return {
      leftButtons: [{
        id: 'back', // Android handles back already
        icon: vokeIcons['home-dot'], // For iOS only
      }],
    };
  }
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: vokeIcons['home'], // For iOS only
    }],
  };
}

// <ShareButton message="Share this with you" title="Hey!" url="https://www.facebook.com" />

const navStyle = {
  navBarButtonColor: theme.lightText,
  navBarTextColor: theme.headerTextColor,
  navBarBackgroundColor: theme.headerBackgroundColor,
  tabBarHidden: true,
};
class Message extends Component {
  static navigatorStyle = navStyle;
  constructor(props) {
    super(props);

    this.state = {
      conversation: null,
      text: '',
      selectedVideo: null,
      height: 50,
      latestItem: null,
      shouldShowButtons: true,
      createTransparentFocus: false,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.handleAddKickstarter = this.handleAddKickstarter.bind(this);
    this.handleAddVideo = this.handleAddVideo.bind(this);
    this.setLatestItem = this.setLatestItem.bind(this);
    this.getTypeState = this.getTypeState.bind(this);
    this.createTypeState = this.createTypeState.bind(this);
    this.destroyTypeState = this.destroyTypeState.bind(this);
    this.handleChangeButtons = this.handleChangeButtons.bind(this);
    this.handleButtonExpand = this.handleButtonExpand.bind(this);
    this.createMessageReadInteraction = this.createMessageReadInteraction.bind(this);
    this.getConversationName = this.getConversationName.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'back' || event.id === 'backPress') {
      if (this.props.showUnreadDot) {
        this.props.dispatch({ type: UNREAD_CONV_DOT, show: false });
      }
      if (this.props.goBackHome) {
        this.props.navigateResetHome();
      } else {
        this.props.navigateBack();
      }
    }

    if (event.id === 'willDisappear' || event.id === 'didDisappear') {
      clearTimeout(this.timeoutSetYellow);
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({ title: this.getConversationName()});
  }

  componentDidMount() {
    this.getMessages();
    Analytics.screen('Chat');
    this.props.dispatch({ type: SET_ACTIVE_CONVERSATION, id: this.props.conversation.id });

    if (this.props.fetchConversation) {
      this.props.dispatch(getConversation(this.props.conversation.id)).then((results) => {
        LOG('get conversation inside messages', results);
        this.setState({ conversation: results.conversation }, () => {
          this.props.navigator.setTitle({ title: this.getConversationName() });
        });
      });
    }
    setTimeout(() => {
      this.props.dispatch(startupAction(this.props.navigator));
    }, 50);

  }

  componentWillReceiveProps(nextProps) {
    // Check to see if the current length is less than the next length and mark it as read
    const nLength = nextProps.messages.length;
    const cLength = this.props.messages.length;
    this.setLatestItem(nextProps.messages);
    if (nLength > 0 && cLength > 0 && cLength < nLength) {
      this.createMessageReadInteraction();
    }

    if ((nextProps.showUnreadDot && !this.props.showUnreadDot) || (Platform.OS === 'ios' && nextProps.unReadBadgeCount > 0)) {
      clearTimeout(this.timeoutSetYellow);
      this.timeoutSetYellow = setTimeout(() => {
        LOG('inTimeout');
        this.props.navigator.setStyle({
          ...navStyle,
          navBarButtonColor: COLORS.YELLOW,
        });
        this.props.navigator.setButtons(setButtons(true));
      }, 1500);
    }
    // Reset the yellow badge indicator when the unread count goes away
    if (Platform.OS === 'ios' && nextProps.unReadBadgeCount === 0 && this.props.unReadBadgeCount > 0) {
      clearTimeout(this.timeoutSetYellow);
      this.timeoutSetYellow = setTimeout(() => {
        this.props.navigator.setStyle(navStyle);
        LOG('setButtons');
        this.props.navigator.setButtons(setButtons());
      }, 500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutSetYellow);
  }

  getConversationName() {
    // Get ths conversation from the state if it exists, or from props
    const conversation = this.state.conversation || this.props.conversation;

    const myId = this.props.me.id;
    let messengers = conversation.messengers || [];
    let otherPerson = messengers.find((m) => !m.bot && (myId != m.id));
    return otherPerson ? otherPerson.first_name : 'Voke';
  }

  setLatestItem(conversationMessages) {
    const messages = conversationMessages ? conversationMessages : this.props.messages ? this.props.messages : [];
    const item = messages.find((m) => m.item);
    if (item && item.item && item.messenger_id === this.props.me.id) {
      this.setState({ latestItem: item.item.id });
    }
  }

  handleLoadMore() {
    if (this.props.pagination.hasMore) {
      // LOG('loading more messages');
      this.getMessages(this.props.pagination.page + 1);
    }
  }

  getMessages(page) {
    this.props.dispatch(getMessages(this.props.conversation.id, page)).then(() => {
      this.createMessageReadInteraction();
    });
  }

  handleAddKickstarter() {
    this.props.navigatePush('voke.KickstartersTab', {
      onSelectKickstarter: (item) => {
        this.props.navigateBack({ animated: true });
        this.setState({ text: item });
      },
      latestItem: this.state.latestItem,
    });
  }

  handleAddVideo() {
    this.props.navigatePush('voke.VideosTab', {
      onSelectVideo: (video) => {
        this.createMessage(video);
        this.props.navigateBack({ animated: false });
      },
    });
  }

  createMessage(video) {
    let data = {};
    if (video) {
      data = {
        message: {
          item_id: video,
        },
      };
    } else {
      data = {
        message: {
          content: this.state.text,
        },
      };
    }
    Keyboard.dismiss();
    this.props.dispatch(createMessage(this.props.conversation.id, data)).then(() => {
      Keyboard.dismiss();
      this.setState({ text: '' });
    });
  }

  createTypeState() {
    this.props.dispatch(createTypeStateAction(this.props.conversation.id));
    // LOG('create typestate');
  }

  destroyTypeState() {
    this.props.dispatch(destroyTypeStateAction(this.props.conversation.id));
    // LOG('destroy typestate');
  }

  createMessageReadInteraction() {
    const interaction = {
      action: 'read',
      conversationId: this.props.conversation.id,
      messageId: this.props.messages[0].id,
    };
    this.props.dispatch(createMessageInteraction(interaction)).then(() => {
      this.props.dispatch(markReadAction(this.props.conversation.id));
      this.setLatestItem();
    });
  }

  updateSize(height) {
    this.setState({ height });
  }

  getTypeState() {
    // Return a boolean from the typeState value
    return !!this.props.typeState;
  }

  handleChangeButtons(bool) {
    this.setState({ shouldShowButtons: bool });
    // LOG('state',this.state.shouldShowButtons);
  }

  handleButtonExpand() {
    this.setState({ shouldShowButtons: true, createTransparentFocus: true });
    // LOG('state',this.state.shouldShowButtons);
  }

  render() {
    const { messages, me, typeState, pagination } = this.props;
    // Get ths conversation from the state if it exists, or from props
    const conversation = this.state.conversation || this.props.conversation;

    let newHeight = {
      height: this.state.height < 40 ? 40 : this.state.height > 80 ? 80 : this.state.height,
    };

    let newWrap = {
      height: this.state.height < 40 ? 50 : this.state.height > 80 ? 90 : this.state.height + 10,
    };

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
          onLoadMore={this.handleLoadMore}
          hasMore={pagination.hasMore}
          items={messages}
          typeState={typeState}
          user={me}
          messengers={conversation.messengers}
          onEndReached={()=> this.setState({ showFlex: false })}
          onSelectVideo={(m) => this.setState({ selectedVideo: m })}
        />
        {
          Platform.OS === 'android' ? null : (
            <Flex value={100} style={{zIndex: 10, backgroundColor: 'transparent'}}></Flex>
          )
        }
        <Flex direction="row" style={[styles.inputWrap, newWrap]} align="center" justify="center">
          {
            this.state.shouldShowButtons === true ? (
              <Flex animation="slideInLeft" duration={400} direction="row" style={{padding: 0, margin: 0, alignItems: 'center'}}>
                <Button
                  type="transparent"
                  style={styles.moreContentButton}
                  onPress={this.handleAddVideo}
                >
                  <VokeIcon name="add-video" />
                </Button>
                <Button
                  type="transparent"
                  style={styles.moreContentButton}
                  onPress={this.handleAddKickstarter}
                >
                  <VokeIcon name="add-kickstarter" />
                </Button>
              </Flex>
            ) : (
              <Flex animation="slideInRight" duration={150} direction="row" style={{padding: 0, margin: 0, alignItems: 'center'}}>
                <Button
                  type="transparent"
                  style={styles.moreContentButton}
                  onPress={this.handleButtonExpand}
                >
                  <VokeIcon name="plus" />
                </Button>
              </Flex>
            )
          }
          <Flex direction="row" style={[styles.chatBox, newHeight]} align="center">
            <TextInput
              onFocus={() => {
                this.list.scrollEnd(true);
                this.createTypeState();
                this.handleChangeButtons(false);
              }
              }
              onBlur={() => {
                this.list.scrollEnd(true);
                this.destroyTypeState();
                this.handleChangeButtons(true);
              }
              }
              autoCapitalize="sentences"
              multiline={true}
              value={this.state.text}
              placeholder="New Message"
              onChangeText={(text) => this.setState({ text })}
              placeholderTextColor={theme.primaryColor}
              underlineColorAndroid={COLORS.TRANSPARENT}
              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
              style={[styles.chatInput, newHeight]}
              autoCorrect={true}
              returnKeyType="done"
            />
            {
              this.state.text ? (
                <Flex animation="slideInRight" duration={250} align="center" direction="row" style={{padding: 0, margin: 0}}>
                  <Button
                    type="transparent"
                    style={styles.sendButton}
                    icon="send"
                    iconStyle={styles.sendIcon}
                    onPress={() => this.createMessage()}
                  />
                </Flex>
              ) : null
            }
            {
              this.state.createTransparentFocus ? (
                <Touchable activeOpacity={0} onPress={() => this.setState({shouldShowButtons: false, createTransparentFocus: false})}>
                  <View style={[newHeight, styles.transparentOverlay]} />
                </Touchable>
              ) : null
            }
          </Flex>
        </Flex>
        <ApiLoading text="Loading Messages" />
      </KeyboardAvoidingView>
    );
  }
}


Message.propTypes = {
  ...NavPropTypes,
  messages: PropTypes.array.isRequired, // Redux
  pagination: PropTypes.object.isRequired, // Redux
  me: PropTypes.object.isRequired, // Redux
  typeState: PropTypes.bool.isRequired, // Redux
  conversation: PropTypes.object.isRequired,
  onSelectVideo: PropTypes.func,
  goBackHome: PropTypes.bool,
  fetchConversation: PropTypes.bool,
};

const mapStateToProps = ({ messages, auth }, ownProps) => ({
  messages: messages.messages[ownProps.conversation.id] || [],
  pagination: messages.pagination.messages[ownProps.conversation.id] || {},
  me: auth.user,
  typeState: !!messages.typeState[ownProps.conversation.id],
  unReadBadgeCount: messages.unReadBadgeCount,
  // If we should show the conversation dot
  showUnreadDot: messages.unreadConversationDot,
});

export default connect(mapStateToProps, nav)(Message);
