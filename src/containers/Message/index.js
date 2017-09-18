import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { getMessages, createMessage, createTypeStateAction, destroyTypeStateAction, createMessageInteraction } from '../../actions/messages';
import Analytics from '../../utils/analytics';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { vokeIcons } from '../../utils/iconMap';

import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';
import ApiLoading from '../ApiLoading';

import { Flex, Text, VokeIcon, Button, Touchable } from '../../components/common';
import MessagesList from '../../components/MessagesList';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: vokeIcons['home'], // For iOS only
    }],
    // rightButtons: [{
    //   id: 'add',
    //   icon: Platform.OS === 'android' ? iconsMap['md-add'] : iconsMap['ios-add'],
    // }],
  };
}

// <ShareButton message="Share this with you" title="Hey!" url="https://www.facebook.com" />

class Message extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
    tabBarHidden: true,
  };
  constructor(props) {
    super(props);

    this.state = {
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
    this.getLatestItem = this.getLatestItem.bind(this);
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
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        // this.props.navigator.resetTo({
        //   screen: 'voke.Home',
        // });
        // if (fromVideo) {
        //   this.props.navigator.popToRoot({
        //     animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
        //     animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
        //   });
        // } else {
        // this.props.navigateBack();
        // }
        if (this.props.goBackHome) {
          this.props.navigateResetHome();
        } else {
          this.props.navigateBack();
        }
      }
    }
  }

  getConversationName() {
    const myId = this.props.me.id;
    let messengers = this.props.conversation.messengers || [];
    let otherPerson = messengers.find((m) => !m.bot && (myId != m.id));
    return otherPerson ? otherPerson.first_name : 'Voke';
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({ title: this.getConversationName()});
  }

  componentDidMount() {
    this.getMessages();
    Analytics.screen('Chat');
  }

  componentWillReceiveProps(nextProps) {
    const nLength = nextProps.messages.length;
    const cLength = this.props.messages.length;
    if (nLength > 0 && cLength > 0 && cLength < nLength) {
      this.createMessageReadInteraction();
    }
  }

  getLatestItem(e) {
    return e.item;
  }

  setLatestItem() {
    let messages = this.props.messages || [];
    let item = messages.find(this.getLatestItem);
    if (item && item.item) {
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
      this.setLatestItem();
      this.createMessageReadInteraction();
    });
  }

  handleAddKickstarter() {
    // LOG('kcikesrter', this.state.latestItem);
    this.props.navigatePush('voke.KickstartersTab', {
      onSelectKickstarter: (item) => {
        // LOG('selected kickstarter in message!');
        this.props.navigateBack({ animated: true });
        this.setState({ text: item });
        // LOG(this.state.text);
      },
      latestItem: this.state.latestItem,
    });
  }

  handleAddVideo() {
    this.props.navigatePush('voke.VideosTab', {
      onSelectVideo: (video) => {
        LOG('selected video in message!');
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
    this.props.dispatch(createMessage(this.props.conversation.id, data)).then(() => {
      this.setState({ text: '' });
    });
    Keyboard.dismiss();
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
    this.props.dispatch(createMessageInteraction(interaction));
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
    const { messages, me, typeState, pagination, conversation } = this.props;
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
          onSelectVideo={(m) => this.setState({ selectedVideo: m })}
        />
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
              multiline={true}
              value={this.state.text}
              placeholder="New Message"
              onChangeText={(text) => this.setState({ text })}
              placeholderTextColor={theme.primaryColor}
              underlineColorAndroid={COLORS.TRANSPARENT}
              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
              style={[styles.chatInput, newHeight]}
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
                    onPress={()=> this.createMessage()}
                  />
                </Flex>
              ) : null
            }
            {
              this.state.createTransparentFocus ? (
                <Touchable activeOpacity={0} onPress={()=> this.setState({shouldShowButtons: false, createTransparentFocus: false})}>
                  <View style={[newHeight, styles.transparentOverlay]} />
                </Touchable>
              ) : null
            }
          </Flex>
        </Flex>
        <ApiLoading />
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
};

const mapStateToProps = ({ messages, auth }, ownProps) => ({
  messages: messages.messages[ownProps.conversation.id] || [],
  pagination: messages.pagination.messages[ownProps.conversation.id] || {},
  me: auth.user,
  typeState: !!messages.typeState[ownProps.conversation.id],
});

export default connect(mapStateToProps, nav)(Message);
