import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';

import { Flex, Text } from '../../components/common';
import theme from '../../theme';
import IMAGE from '../../../images/onboarding-image-1.png';
import AdventureMarker from '../AdventureMarker';
import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

class AdventureMap extends Component {

  state = {
    width: null,
    height: null,
  };

  scrollTo = (y) => {
    const headerHeight = theme.isAndroid ? 56 : theme.isIphoneX ? 90 : 65;
    const tabHeight = 45;
    // Get the visible screen area
    const screenHeight = theme.fullHeight - (headerHeight + tabHeight);
    // This is the furthest down you can scroll
    const maxBottomScroll = this.state.height - screenHeight;

    const padding = 150; // Padding below scroll point
    let actualY = (this.state.height / 2 + y) - screenHeight + padding;


    if (actualY < 0) actualY = 0;
    else if (actualY > maxBottomScroll) actualY = maxBottomScroll;
    LOG('actualY', actualY);
    this.props.scrollTo(actualY);
  }

  handleLayout = ({ nativeEvent }) => {
    if (!this.state.width || this.state.width !== nativeEvent.layout.width) {
      this.setState({
        width: nativeEvent.layout.width,
        height: nativeEvent.layout.height,
      });
      // setTimeout(() => this.scrollTo(350), 3000);
      // setTimeout(() => this.scrollTo(250), 6000);
      // setTimeout(() => this.scrollTo(-100), 7500);
      // setTimeout(() => this.scrollTo(450), 9000);
    }
  }

  renderChallenges() {
    const { challenges } = this.props;
    return (
      challenges.map((i)=> (
        <AdventureMarker
          width={this.state.width}
          height={this.state.height}
          onPress={() => LOG('center')}
          x={i.point_x}
          y={i.point_y}
        />
      ))
    );
  }

  render() {
    const { width, height } = this.state;
    const { challenges } = this.props;
    return (
      <Flex style={styles.wrap}>
        <Image
          source={{ uri: `${this.props.backgroundImage}` }}
          style={{
            // Once the image loads and we get the width and height, adjust it to center
            marginLeft: !width ? undefined : -((width - theme.fullWidth) / 2),
            height: theme.fullHeight * 1.5,
          }}
          resizeMode="cover"
          onLayout={this.handleLayout}
        />
        <Flex style={styles.overlay}>
          {
            challenges && challenges.length > 0 ? this.renderChallenges() : null
          }
        </Flex>
        {
          width === null ? (
            <Flex align="center" style={styles.loadingOverlay}>
              <Image resizeMode="contain" source={ANIMATION} />
              <Text style={styles.loadingText}>
                Loading your Adventures
              </Text>
            </Flex>
          ) : null
        }
      </Flex>
    );
  }
}

AdventureMap.propTypes = {

};

const mapStateToProps = ({ auth, adventures }) => ({
  user: auth.user,
  backgroundImage: adventures.backgroundImage,
  challenges: adventures.challenges,
});

export default connect(mapStateToProps)(AdventureMap);
