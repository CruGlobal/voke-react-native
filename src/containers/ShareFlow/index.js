import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Keyboard, Alert, Share } from 'react-native';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import styles from './styles';
// import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';
import { createConversation, getConversation, deleteConversation } from '../../actions/messages';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button, Touchable, Text, Icon } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import CloseButton from '../../components/CloseButton';
import LOGO from '../../../images/initial_voke.png';
import theme from '../../theme';

class ShareFlow extends Component {

  state = {
    isLoading: false,
    showOverlay: false,
    name: '',
    conversationUrl: '',
    conversation: null,
  };

  componentDidMount() {
    Analytics.screen('Share - Name');
  }

  quit = () => {
    this.props.navigateBack();
  }

  createConversationId() {
    const { name } = this.state;
    return new Promise((resolve, reject) => {
      const createData = {
        conversation: {
          messengers_attributes: [
            {
              first_name: name,
            },
          ],
          item_id: `${this.props.videoId}`,
        },
      };

      // Show an alert when either API call fails
      const fail = () => {
        Alert.alert('', 'Sorry, there was an error creating the conversation. Please try again.');
        this.setState({ isLoading: false });
        reject();
      };
  
      this.setState({ isLoading: true });
      this.props.dispatch(createConversation(createData)).then((results) => {
        // Grab the friendfrom the results
        const friend = results.messengers[0];
        // LOG('create voke conversation results', results);
        this.props.dispatch(getConversation(results.id)).then((c) => {
          this.setState({
            conversationUrl: friend.url,
            conversation: c,
            isLoading: false,
          }, resolve);
        }).catch(fail);
      }).catch(fail);
    });
  }

  share = () => {
    const { name } = this.state;
    if (!name) {
      Alert.alert('', 'Please enter a name to continue');
      return;
    }

    // Always create a new conversation id
    this.createConversationId().then(this.shareDialog);
  }

  shareDialog = () => {
    this.setState({ showOverlay: true });
    // Android uses message, not url
    Share.share({
      message: theme.isAndroid ? this.state.conversationUrl : '',
      title: '',
      url: this.state.conversationUrl,
    }, {
      dialogTitle: 'Share',
    }).then(({ action, activityType }) => {
      if (action === Share.sharedAction) {
        LOG('shared!', activityType);
        // Navigate to the new conversation after sharing
        this.props.navigateResetMessage({
          conversation: this.state.conversation,
        });
      } else {
        LOG('not shared!');
        this.setState({ showOverlay: false });
        // Delete the conversation
        this.props.dispatch(deleteConversation(this.state.conversation.id)).then(() => {
          this.setState({
            conversationUrl: '',
            conversation: null,
          });
        });
      }
    }).catch((err) => {
      this.setState({ showOverlay: false });
      LOG('Share Error', err);
    });
  }

  openAddrBook = () => {
    this.props.navigatePush('voke.SelectFriend', {
      video: this.props.videoId,
    });
  }

  renderOverlay() {
    if (!this.state.showOverlay) return null;
    return (
      <Flex style={styles.overlay}>
        <Image resizeMode="contain" source={LOGO} style={styles.overlayImage} />
      </Flex>
    );
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center">
        <CloseButton onClose={this.quit} />
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <Flex direction="column" align="center" justify="end" style={styles.logoWrapper}>
            <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
          </Flex>
          <Flex justify="center" style={styles.actions}>
            <SignUpInput
              value={this.state.name}
              onChangeText={(t) => this.setState({ name: t })}
              placeholder="Friend's Name"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Button
              text="Share"
              disabled={this.state.isLoading}
              type="filled"
              style={styles.shareButton}
              onPress={this.share}
            />
            <Flex direction="row" align="center">
              <Flex value={1} style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <Flex value={1} style={styles.line} />
            </Flex>
            <Button
              text="Open My Address Book"
              type="filled"
              style={styles.addrButton}
              onPress={this.openAddrBook}
            />
          </Flex>
        </TouchableOpacity>
        {this.renderOverlay()}
      </Flex>
    );
  }
}

ShareFlow.propTypes = {
  ...NavPropTypes,
  videoId: PropTypes.string.isRequired,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(ShareFlow);
