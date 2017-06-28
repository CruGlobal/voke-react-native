import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';

import theme, { COLORS } from '../../theme';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import { Flex, Icon } from '../../components/common';
import MessagesList from '../../components/MessagesList';

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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    // this.props.navigator.setTitle({ title: this.props.name || 'Message' });
  }

  render() {
    // const { messages = [] } = this.props.navigation.state.params;
    const { messages = [] } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'android' ? undefined : 60}
      >
        <MessagesList ref={(c) => this.list = c} items={messages} />
        <Flex direction="row" style={styles.inputWrap} align="center">
          <TextInput
            onFocus={() => this.list.scrollEnd(true)}
            onBlur={() => this.list.scrollEnd(true)}
            multiline={true}
            placeholder="New Message"
            placeholderTextColor={theme.primaryColor}
            underlineColorAndroid={COLORS.TRANSPARENT}
            style={styles.chatBox}
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
