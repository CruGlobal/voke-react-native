import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import { Text, Flex } from '../../components/common';
import ShareButton from '../../components/ShareButton';
import MessagesList from '../../components/MessagesList';

function setButtons() {
  return {
    leftButtons: [{
      title: 'Home', // for a textual button, provide the button title (label)
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-home-outline'], // for icon button, provide the local image asset name
    }],
    rightButtons: [{
      title: 'add',
      id: 'add',
      icon: iconsMap['ios-add'],
    }],
  };
}

// <ShareButton message="Share this with you" title="Hey!" url="https://www.facebook.com" />

class Message extends Component {
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
  }

  render() {
    // const { messages = [] } = this.props.navigation.state.params;
    const { messages = [] } = this.props;
    return (
      <View style={styles.container}>
        <MessagesList items={messages} />
      </View>
    );
  }
}


Message.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Message);
