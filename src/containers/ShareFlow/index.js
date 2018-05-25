import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Keyboard, Alert, Share, View, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import styles from './styles';
// import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';
import { createConversation, getConversation, deleteConversation } from '../../actions/messages';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import ApiLoading from '../ApiLoading';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_SHARE from '../../../images/voke_share.png';
import VOKE_LINK from '../../../images/vokebot_whole.png';
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
          item_id: `${this.props.video.id}`,
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
            conversation: c.conversation,
            isLoading: false,
          }, () => resolve());
        }).catch(fail);
      }).catch(fail);
    });
  }

  share = () => {
    Keyboard.dismiss();
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
      message: this.state.conversationUrl,
      tintColor: '#fff',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.AirDrop',
        'com.apple.UIKit.activity.PostToFacebook',
        'com.apple.UIKit.activity.PostToTwitter',
      ],
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
    Keyboard.dismiss();
    this.props.navigatePush('voke.SelectFriend', {
      video: this.props.video.id,
    });
  }

  renderOverlay() {
    if (!this.state.showOverlay) return null;
    return (
      <Flex style={styles.overlay}>
        <Image resizeMode="contain" source={VOKE_LINK} style={styles.overlayImage} />
        <Flex style={styles.chatBubble}>
          <Text style={styles.chatText}>
            {this.state.name}'s link is ready! Where do you want to share it?
          </Text>
        </Flex>
      </Flex>
    );
  }

  render() {
    return (
      <View style={styles.container} >
        <KeyboardAvoidingView behavior="position">
          <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()} style={{ paddingTop: 50 }}>
            <Flex style={styles.shareWith}>
              <Image resizeMode="contain" source={VOKE_LINK} style={styles.shareImage} />
              <Flex style={styles.shareBubble}>
                <Text style={styles.chatText}>
                  Who do you want to share {this.props.video.name} with? {this.props.isFirstTime ? '- (they don\'t need to have Voke)' : null}
                </Text>
              </Flex>
            </Flex>
            <Flex justify="center" align="center" style={styles.actions}>
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
                disabled={this.state.isLoading || !this.state.name}
                type={this.state.name ? 'filled' : 'disabled'}
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
        </KeyboardAvoidingView>
        {
          this.state.isLoading ? (
            <ApiLoading
              force={true}
              text="Creating a link for you to share with your friend"
            />
          ) : null
        }
        <Flex style={{ position: 'absolute', top: 0, left: 0 }} align="start">
          <SignUpHeaderBack onPress={this.quit} />
        </Flex>
      </View>
    );
  }
}

ShareFlow.propTypes = {
  ...NavPropTypes,
  video: PropTypes.object.isRequired,
};
const mapStateToProps = ({ messages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isFirstTime: messages.conversations.length < 2,
});

export default connect(mapStateToProps, nav)(ShareFlow);
