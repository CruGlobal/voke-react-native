import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { Icon, Flex, Touchable, Text } from '../../components/common';

class VideoDetails extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    
    this.selectContact = this.selectContact.bind(this);
  }

  selectContact(contact) {
    console.warn('contact selected', contact);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={styles.video}>
          <WebviewVideo
            type="youtube"
            url="https://www.youtube.com/watch?v=cUYSGojUuAU"
            start={5}
            onChangeState={(videoState) => console.warn(videoState)}
          />
          <View style={styles.backHeader}>
            <Touchable onPress={() => this.props.navigateBack()}>
              <Icon name="arrow-back" size={28} style={styles.backIcon} />
            </Touchable>
          </View>
        </Flex>
        <Flex value={1} style={{ backgroundColor: 'green' }}>
          <Text>HEY!</Text>
        </Flex>
        <FloatingButtonSingle onSelect={() => this.props.navigatePush('voke.SelectFriend', {
          onSelect: this.selectContact,
        })} />
      </View>
    );
  }
}

VideoDetails.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(VideoDetails);
