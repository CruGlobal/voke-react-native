import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, KeyboardAvoidingView, Keyboard, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { checkAndRunSockets, determinePushOverlay } from '../../actions/socket';
import { getMessages, createMessage, createTypeStateAction, destroyTypeStateAction, createMessageInteraction, markReadAction } from '../../actions/messages';
import Analytics from '../../utils/analytics';
import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/nav';
import { vokeIcons } from '../../utils/iconMap';
import VokeOverlays from '../VokeOverlays';
import { SET_ACTIVE_CONVERSATION } from '../../constants';
import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import { Flex, VokeIcon, Button, Touchable } from '../../components/common';
import MessagesList from '../../components/MessagesList';
import NotificationToast from '../NotificationToast';
import CONSTANTS from '../../constants';

class Message extends Component {
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
      showDot: props.unReadBadgeCount > 0,
      title: 'Voke',
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
    this.setConversationName = this.setConversationName.bind(this);
    this.handleHeaderBack = this.handleHeaderBack.bind(this);
  }

  componentDidMount() {
    this.setConversationName();

    Analytics.screen('Chat');
    this.props.dispatch({ type: SET_ACTIVE_CONVERSATION, id: this.props.conversation.id });
    this.props.dispatch(determinePushOverlay());

    setTimeout(() => {
      this.props.dispatch(checkAndRunSockets());
      this.getMessages();
      this.createMessageReadInteraction(this.props.messages[0]);
      this.setLatestItem();
    }, 50);

    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillReceiveProps(nextProps) {
    // Check to see if the current length is less than the next length and mark it as read
    const nLength = nextProps.messages.length;
    const cLength = this.props.messages.length;

    // if the messages are already at 25 then the lengths are not different and read interaction doesnt run
    // therefore, check if Ids are the same or not
    this.setLatestItem(nextProps.messages);
    if ((nLength > 0 && cLength > 0 && cLength < nLength) || (!this.props.messages[0] && nextProps.messages[0]) || (this.props.messages[0] && nextProps.messages[0] && this.props.messages[0].id !== nextProps.messages[0].id)) {
      this.createMessageReadInteraction(nextProps.messages[0]);
    }

    if (!theme.isAndroid) {
      if (nextProps.unReadBadgeCount > 0) {
        this.setState({ showDot: true });
      } else if (nextProps.unReadBadgeCount === 0 && this.props.unReadBadgeCount > 0) {
        this.setState({ showDot: false });
      }
    }

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    this.props.dispatch({ type: SET_ACTIVE_CONVERSATION, id: null });
  }

  backHandler() {
    if (this.handleHeaderBack) {
      this.handleHeaderBack();
      return true;
    }
    return false;
  }

  setConversationName() {
    // Get ths conversation from the state if it exists, or from props
    const conversation = this.state.conversation || this.props.conversation;

    const myId = this.props.me.id;
    let messengers = conversation.messengers || [];
    let otherPerson = messengers.find((m) => !m.bot && (myId != m.id));
    const title = otherPerson ? otherPerson.first_name : 'Voke';

    this.setState({ title });
  }

  setLatestItem(conversationMessages) {
    const messages = conversationMessages ? this.props.messages : [];
    const item = messages.find((m) => m.item);
    if (item && item.item && item.messenger_id === this.props.me.id) {
      this.setState({ latestItem: item.item.id });
    }
  }

  handleLoadMore() {
    if (this.props.pagination.hasMore) {
      // Loading more messages
      this.getMessages(this.props.pagination.page + 1);
    }
  }

  getMessages(page) {
    if (!page && !this.props.forceUpdate && !this.props.getConversationsIsRunning) {
      const { conversation, messages } = this.props;
      const latestMessage = messages[0];
      // Only prevent the messages API call when the number of messages is >= the total messages page size
      if (messages.length >= CONSTANTS.PAGE_SIZE) {
        if (latestMessage && conversation.latestMessage && conversation.latestMessage.message_id === latestMessage.id) {
          LOG('positions are the same, dont call getMessages');
          return;
        }
      }
    }
    this.props.dispatch(getMessages(this.props.conversation.id, page)).then(() => {
      this.createMessageReadInteraction(this.props.messages[0]);
    });
  }

  pauseVideo() {
    if (this.state.selectedVideo && this.videoPlayer) {
      // Get the redux instance and call the pause method
      this.videoPlayer.getWrappedInstance().pause();
    }
  }

  handleAddKickstarter() {
    // Pause the video before navigating away
    this.pauseVideo();
    this.props.navigatePush('voke.KickstartersTab', {
      onSelectKickstarter: (item) => {
        this.props.navigateBack();
        this.setState({ text: item });
      },
      latestItem: this.state.latestItem,
    });
  }

  handleAddVideo() {
    // Pause the video before navigating away
    this.pauseVideo();
    this.props.navigatePush('voke.VideosTab', {
      onSelectVideo: (video) => {
        this.createMessage(video);
      },
      conversation: this.props.conversation,
    });
  }

  createMessageEmpty = () => {
    this.createMessage();
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

  createMessageReadInteraction(msg) {
    if (!msg) {
      return;
    }
    const { conversation, dispatch } = this.props;

    // If the message has already been marked as read, don't make an API call
    if (msg && conversation.myLatestReadId === msg.id) {
      return;
    }

    const interaction = {
      action: 'read',
      conversationId: conversation.id,
      messageId: msg.id,
    };

    // Call this optimistically before the API call is complete
    dispatch(markReadAction(conversation.id, msg.id));
    dispatch(createMessageInteraction(interaction)).then(() => {
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

  handleHeaderBack() {
    this.props.navigateBack();
  }

  clearSelectedVideo = () => {
    this.setState({ selectedVideo: null });
  }

  handleOnEndReached = () => {
    this.setState({ showFlex: false });
  }

  handleSelectVideo = (m) => {
    this.setState({ selectedVideo: m });
  }

  handleShareVideo = (video) => {
    if (!this.props.me.first_name) {
      this.props.navigatePush('voke.TryItNowName', {
        onComplete: () => this.props.navigatePush('voke.ShareFlow', {
          videoId: video.id,
        }),
      });
    } else {
      this.props.navigatePush('voke.ShareFlow', {
        videoId: video.id,
      });
    }
  }

  handleInputFocus = () => {
    this.list.scrollEnd(true);
    this.createTypeState();
    this.handleChangeButtons(false);
  }

  handleInputBlur = () => {
    this.list.scrollEnd(true);
    this.destroyTypeState();
    this.handleChangeButtons(true);
  }

  handleInputChange = (text) => {
    this.setState({ text });
  }

  handleInputSizeChange = (e) => {
    this.updateSize(e.nativeEvent.contentSize.height);
  }

  render() {
    const { messages, me, typeState, pagination } = this.props;
    const { height } = this.state;
    // Get ths conversation from the state if it exists, or from props
    const conversation = this.state.conversation || this.props.conversation;

    let inputHeight = {
      height: height < 40 ? 40 : height > 80 ? 80 : height,
    };

    const extraPadding = theme.isIphoneX ? 40 : 0;

    let newWrap = {
      height: height < 40 ? 50 + extraPadding : height > 80 ? 90 + extraPadding : height + 10 + extraPadding,
    };

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={theme.isAndroid ? undefined : 'padding'}
          keyboardVerticalOffset={theme.isAndroid ? undefined : 0}
        >
          <Header
            left={
              theme.isAndroid ? (
                <HeaderIcon
                  type="back"
                  onPress={this.handleHeaderBack}
                />
              ) : (
                <HeaderIcon
                  image={this.state.showDot ? vokeIcons['home-dot'] : vokeIcons['home']}
                  onPress={this.handleHeaderBack}
                />
              )
            }
            title={this.state.title}
          />
          <NotificationToast />
          {
            this.state.selectedVideo ? (
              <MessageVideoPlayer
                ref={(c) => this.videoPlayer = c}
                message={this.state.selectedVideo}
                onClose={this.clearSelectedVideo}
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
            onEndReached={this.handleOnEndReached}
            onSelectVideo={this.handleSelectVideo}
            onShareVideo={this.handleShareVideo}
          />
          {
            theme.isAndroid ? null : (
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
            <Flex direction="row" style={[styles.chatBox, inputHeight]} align="center">
              <TextInput
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                autoCapitalize="sentences"
                multiline={true}
                value={this.state.text}
                placeholder="New Message"
                onChangeText={this.handleInputChange}
                placeholderTextColor={theme.primaryColor}
                underlineColorAndroid={COLORS.TRANSPARENT}
                onContentSizeChange={this.handleInputSizeChange}
                style={[styles.chatInput, inputHeight]}
                autoCorrect={true}
              />
              {
                this.state.text ? (
                  <Flex animation="slideInRight" duration={250} align="center" direction="row" style={{padding: 0, margin: 0}}>
                    <Button
                      type="transparent"
                      style={styles.sendButton}
                      icon="send"
                      iconStyle={styles.sendIcon}
                      onPress={this.createMessageEmpty}
                    />
                  </Flex>
                ) : null
              }
              {
                this.state.createTransparentFocus ? (
                  <Touchable activeOpacity={0} onPress={() => this.setState({shouldShowButtons: false, createTransparentFocus: false})}>
                    <View style={[inputHeight, styles.transparentOverlay]} />
                  </Touchable>
                ) : null
              }
            </Flex>
          </Flex>
          <ApiLoading text="Loading Messages" />
        </KeyboardAvoidingView>
        <VokeOverlays type="pushPermissions" />
      </View>
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
  forceUpdate: PropTypes.bool,
  onSelectVideo: PropTypes.func,
};

const mapStateToProps = ({ messages, auth }, { navigation }) => {
  const conversation = navigation.state.params ? navigation.state.params.conversation : {};
  return {
    ...(navigation.state.params || {}),
    conversation,
    messages: messages.messages[conversation.id] || [],
    getConversationsIsRunning: messages.getConversationsIsRunning,
    pagination: messages.pagination.messages[conversation.id] || {},
    me: auth.user,
    typeState: !!messages.typeState[conversation.id],
    unReadBadgeCount: messages.unReadBadgeCount,
  };
};

export default connect(mapStateToProps, nav)(Message);
