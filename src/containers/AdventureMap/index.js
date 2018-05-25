import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';

import { Flex, Text } from '../../components/common';
import { getMe } from '../../actions/auth';
import theme from '../../theme';
import AdventureMarker from '../AdventureMarker';
import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

const IMAGE_HEIGHT = 2148;
const IMAGE_WIDTH = 750;

class AdventureMap extends Component {

  componentDidMount() {
    if (this.props.challenges.length < 1 || !this.props.backgroundImage) {
      this.props.dispatch(getMe());
    }
  }

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

  renderChallenges() {
    const { challenges } = this.props;
    return (
      challenges.map((i)=> (
        <AdventureMarker
          key={i.id}
          width={theme.fullWidth}
          height={IMAGE_HEIGHT}
          onPress={() => LOG('center')}
          x={i.point_x}
          y={i.point_y}
        />
      ))
    );
  }

  render() {
    const { challenges } = this.props;
    return (
      <Flex style={styles.wrap}>
        {
          this.props.backgroundImage ? (
            <Image
              source={{ uri: `${this.props.backgroundImage}` }}
              style={{
                // Once the image loads and we get the width and height, adjust it to center
                marginLeft: -((IMAGE_WIDTH - theme.fullWidth) / 2),
                height: IMAGE_HEIGHT,
                width: IMAGE_WIDTH,
              }}
              resizeMode="cover"
            />
          ) : null
        }
        <Flex style={styles.overlay}>
          {
            challenges && challenges.length > 0 ? this.renderChallenges() : null
          }
        </Flex>
        {
          !this.props.backgroundImage ? (
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
  backgroundImage: adventures.backgroundImageUrl,
  challenges: adventures.challenges,
});

export default connect(mapStateToProps)(AdventureMap);
