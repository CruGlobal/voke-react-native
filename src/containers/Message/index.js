import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { getMessages, createMessage, createTypeStateAction, destroyTypeStateAction, createMessageInteraction } from '../../actions/messages';
import PropTypes from 'prop-types';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import MessageVideoPlayer from '../MessageVideoPlayer';
import HOME_ICON from '../../../images/home_icon.png';

import { Flex, Text, Button, Touchable } from '../../components/common';
import MessagesList from '../../components/MessagesList';
import LoadMore from '../../components/LoadMore';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: HOME_ICON, // For iOS only
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
      isLoadingMore: false,
      latestItem: null,
      shouldShowButtons: true,
      createTransparentFocus: false,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.handleAddContent = this.handleAddContent.bind(this);
    this.getLatestItem = this.getLatestItem.bind(this);
    this.setLatestItem = this.setLatestItem.bind(this);
    this.getTypeState = this.getTypeState.bind(this);
    this.createTypeState = this.createTypeState.bind(this);
    this.destroyTypeState = this.destroyTypeState.bind(this);
    this.handleChangeButtons = this.handleChangeButtons.bind(this);
    this.handleButtonExpand = this.handleButtonExpand.bind(this);
    this.createMessageReadInteraction = this.createMessageReadInteraction.bind(this);
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
        this.props.navigateBack();
      }
      // } else if (event.id == 'add') {
      //   this.props.navigatePush('voke.MessageTabView', {
      //     onSelectKickstarter: () => {
      //       console.warn('selected kickstarter in message!');
      //     },
      //     onSelectVideo: () => {
      //       console.warn('selected video in message!');
      //     },
      // });
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({ title: this.props.conversation.messengers[0].first_name || 'Message' });
  }

  componentDidMount() {
    this.getMessages();
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
    // console.warn(JSON.stringify(item));
    if (item && item.item) {
      this.setState({ latestItem: item.item.id });
    }
  }

  handleLoadMore() {
    this.setState({ isLoadingMore: true });
    console.warn('Making API call to load more');
    setTimeout(() => {
      this.setState({ isLoadingMore: false });
    }, 1000);
  }

  getMessages() {
    this.props.dispatch(getMessages(this.props.conversation.id)).then(()=>{
      this.setLatestItem();
      this.createMessageReadInteraction();
    });
  }

  handleAddContent() {
    this.props.navigatePush('voke.MessageTabView', {
      onSelectKickstarter: (item) => {
        console.warn('selected kickstarter in message!');
        this.setState({text: item});
        console.warn(this.state.text);
      },
      onSelectVideo: (video) => {
        console.warn('selected video in message!');
        this.createMessage(video);
        this.props.navigateBack({ animated: false });
      },
      latestItem: this.state.latestItem,
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
    this.props.dispatch(createMessage(this.props.conversation.id, data)).then(()=> {
      this.setState({ text: '' });
    });
    Keyboard.dismiss();
  }

  createTypeState() {
    this.props.dispatch(createTypeStateAction(this.props.conversation.id));
    // console.warn('create typestate');
  }

  destroyTypeState() {
    this.props.dispatch(destroyTypeStateAction(this.props.conversation.id));
    // console.warn('destroy typestate');
  }

  createMessageReadInteraction() {
    let interaction = {
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
    if (this.props.typeState) {
      return true;
    }
    return false;
  }

  handleChangeButtons(bool) {
    this.setState({ shouldShowButtons: bool });
    // console.warn('state',this.state.shouldShowButtons);
  }

  handleButtonExpand() {
    this.setState({ shouldShowButtons: true });
    this.setState({ createTransparentFocus: true });
    // console.warn('state',this.state.shouldShowButtons);
  }

  render() {
    const { messages, me } = this.props;
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
          typeState={this.getTypeState()}
          user={me}
          messengers={this.props.conversation.messengers}
          onSelectVideo={(m) => this.setState({ selectedVideo: m })}
        />
        <Flex direction="row" style={[styles.inputWrap, newWrap]} align="center" justify="center">
          {
            this.state.shouldShowButtons === true ? (
              <Flex direction="row" style={{padding: 0, margin: 0, alignItems: 'center'}}>
                <Button
                  type="transparent"
                  style={styles.sendButton}
                  icon="queue"
                  iconStyle={styles.sendIcon}
                  onPress={this.handleAddContent}
                />
                <Button
                  type="transparent"
                  style={styles.sendButton}
                  icon="queue"
                  iconStyle={styles.sendIcon}
                  onPress={this.handleAddContent}
                />
              </Flex>
            ) : (
              <Button
                type="transparent"
                style={styles.sendButton}
                icon="add"
                iconStyle={styles.sendIcon}
                onPress={this.handleButtonExpand}
              />
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
                <Button
                  type="transparent"
                  style={styles.sendButton}
                  icon="send"
                  iconStyle={styles.sendIcon}
                  onPress={()=> this.createMessage()}
                />
              ) : null
            }
            {
              this.state.createTransparentFocus ? (
                <Touchable activeOpacity={0} style={[newHeight, styles.transparentOverlay]} onPress={()=> this.setState({shouldShowButtons: false, createTransparentFocus: false})}>
                </Touchable>
              ) : null
            }
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}


Message.propTypes = {
  ...NavPropTypes,
  conversation: PropTypes.object.isRequired,
  onSelectVideo: PropTypes.func,
};

const mapStateToProps = ({ messages, auth }, ownProps) => ({
  messages: messages.messages[ownProps.conversation.id] || [],
  me: auth.user,
  typeState: messages.typeState[ownProps.conversation.id],
});

export default connect(mapStateToProps, nav)(Message);
