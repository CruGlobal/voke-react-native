import React, { Component } from 'react';
import { Alert, View, StatusBar, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { toastAction } from '../../actions/auth';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { Icon, Flex, Touchable, Text } from '../../components/common';

const Br = () => <View style={{height: 10}} />;
const Label = ({ children, style }) => <Text style={[styles.label, style]}>{children}</Text>;
const Detail = ({ children }) => <Text style={styles.detail}>{children}</Text>;

class VideoDetails extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.selectContact = this.selectContact.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }

  selectContact(contact) {
    console.warn('contact selected', contact);
  }

  handleVideoChange(videoState) {
    // console.warn(videoState);
    if (videoState === webviewStates.ERROR) {
      this.props.dispatch(toastAction('There was an error playing the video.'));
    }
  }

  renderContent() {
    return (
      <Flex direction="column" style={{ paddingBottom: 110 }}>
        <Label style={{ fontSize: 24 }}>The odds of you explained...</Label>
        <Detail>This is a really cool video that shows things</Detail>
        <Br />
        <Label>Themes</Label>
        <Detail>This is a really cool video that shows things</Detail>
        <Br />
        <Label>Voke kickstarters</Label>
        <Detail>This is a really cool video that shows things fhdsajk hdfskajdfhsajfdhsjfdhsahdfs hjk hjk hjk hjkfdsa hjkfdsahjkdsahfjkdsahdfjksah fjkdsa fdsahdfksadfsa fdsahjkfdsa fdsahjkfdsa kfjdsa j hjkhkjhjk</Detail>
        <Detail>--</Detail>
        <Detail>This is a really cool video that shows things</Detail>
        <Br />
        <Label>Voke kickstarters</Label>
        <Detail>This is a really cool video that shows things fhdsajk hdfskajdfhsajfdhsjfdhsahdfs hjk hjk hjk hjkfdsa hjkfdsahjkdsahfjkdsahdfjksah fjkdsa fdsahdfksadfsa fdsahjkfdsa fdsahjkfdsa kfjdsa j hjkhkjhjk</Detail>
        <Detail>--</Detail>
        <Detail>This is a really cool video that shows things</Detail>
        <Br />
        <Label>Voke kickstarters</Label>
        <Detail>This is a really cool video that shows things fhdsajk hdfskajdfhsajfdhsjfdhsahdfs hjk hjk hjk hjkfdsa hjkfdsahjkdsahfjkdsahdfjksah fjkdsa fdsahdfksadfsa fdsahjkfdsa fdsahjkfdsa kfjdsa j hjkhkjhjk</Detail>
        <Detail>--</Detail>
        <Detail>This is a really cool video that shows things</Detail>
        <Br />
        <Label>Voke kickstarters</Label>
        <Detail>This is a really cool video that shows things fhdsajk hdfskajdfhsajfdhsjfdhsahdfs hjk hjk hjk hjkfdsa hjkfdsahjkdsahfjkdsahdfjksah fjkdsa fdsahdfksadfsa fdsahjkfdsa fdsahjkfdsa kfjdsa j hjkhkjhjk</Detail>
        <Detail>--</Detail>
        <Detail>This is a really cool video that shows things</Detail>
      </Flex>
    );
  }

  render() {
    const url = 'https://www.youtube.com/watch?v=cUYSGojUuAU';
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={styles.video}>
          <WebviewVideo
            type="youtube"
            url={url}
            start={5}
            onChangeState={this.handleVideoChange}
          />
          <View style={styles.backHeader}>
            <Touchable borderless={true} onPress={() => this.props.navigateBack()}>
              <View>
                <Icon name="chevron-left" size={22} style={styles.backIcon} />
              </View>
            </Touchable>
          </View>
        </Flex>
        <ScrollView style={styles.content}>
          {this.renderContent()}
        </ScrollView>
        <FloatingButtonSingle
          onSelect={() => {
            if (this.props.onVideoShare) {
              Alert.alert(
                'Add video to chat?',
                `Are you sure you want to add ${'video name'} video to your chat?`,
                [
                  { text: 'Cancel' },
                  { text: 'Add', onPress: () => {
                    this.props.onVideoShare(url);
                    this.props.navigateBack();
                  }},
                ]
              );
            } else {
              this.props.navigatePush('voke.SelectFriend', { url });
            }
          }}
        />
      </View>
    );
  }
}

VideoDetails.propTypes = {
  ...NavPropTypes,
  onVideoShare: PropTypes.func,
};

export default connect(null, nav)(VideoDetails);
