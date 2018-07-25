import React, { Component } from 'react';
import { Image, Modal } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import Analytics from '../../utils/analytics';
import { Flex, Text, Touchable } from '../../components/common';
import { getMe } from '../../actions/auth';
import { getAdventure } from '../../actions/adventures';
import theme from '../../theme';
import AdventureMarker from '../../components/AdventureMarker';
import AdventureIcons from '../../components/AdventureIcons';
import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';
import ChallengeModal from '../ChallengeModal';
import { LOGIN } from '../../constants';

const IMAGE_HEIGHT = 1480;
const IMAGE_WIDTH = 517;
const IMAGE_MARGIN = (IMAGE_WIDTH - theme.fullWidth) / 2;

class AdventureMap extends Component {
  state = {
    modalVisible: false,
    activeChallenge: null,
    linesArray: [],
  };

  componentDidMount() {
    const { challenges } = this.props;
    this.load();
    if (challenges.length > 0) {
      setTimeout(() => this.challengesLoaded(challenges), 100);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.challenges.length > this.props.challenges.length) {
      this.challengesLoaded(nextProps.challenges);
    }
    // Update the lines when there is a newly completed challenge
    if (nextProps.challenges.length && this.props.challenges.length) {
      const len1 = nextProps.challenges.filter((c) => c['completed?']).length;
      const len2 = this.props.challenges.filter((c) => c['completed?']).length;
      if (len1 !== len2) {
        this.updateLines(nextProps.challenges);
      }
    }
  }

  load() {
    this.props.dispatch(getMe());
  }

  challengesLoaded(challenges) {
    const challenge = challenges.find(c => c.isActive);
    const completed = challenges.find(c => c['completed?']);
    if (!completed) {
      this.props.scrollTo('end');
    } else if (challenge) {
      this.scrollTo(challenge.point_y);
    }

    this.updateLines(challenges);
  }

  updateLines(challenges) {
    let linesArray = [];

    const X_ADJ = IMAGE_WIDTH / 2 - IMAGE_MARGIN;
    const Y_ADJ = IMAGE_HEIGHT / 2;
    // Only show lines for the required challenges
    challenges.filter(c => c['required?']).forEach((c, index) => {
      // Skip over the first element in the array
      if (index === 0) return;

      // Set the color based on the state of the challenge
      let color = theme.darkText;
      if (c['completed?']) color = theme.primaryColor;
      else if (c.isActive) color = theme.white;

      // Get {x,y} from the previous challenge
      const { point_x, point_y } = challenges[index - 1];
      // Set the A/B points based off of the adjusted {x,y} coords
      let points = {
        A: { x: Math.floor(point_x + X_ADJ), y: Math.floor(point_y + Y_ADJ) },
        B: {
          x: Math.floor(c.point_x + X_ADJ),
          y: Math.floor(c.point_y + Y_ADJ),
        },
        bez: {},
        color,
      };

      // Random value between 40-70
      const bezAdj = Math.floor(Math.random() * 30) + 40;

      // If the challenge is moving to the left, move the starting point of the line to the left
      if (points.A.x > points.B.x) {
        points.A.x = points.A.x - 20;
        // Adjust the bezier starting point
        points.bez.x1 = points.A.x - bezAdj;
      } else {
        // If the challenge is moving to the right, move the starting point of the line to the right
        points.A.x = points.A.x + 20;
        points.bez.x1 = points.A.x + bezAdj;
      }
      // Set the y coordinates to be off of the center of the image.
      points.A.y = points.A.y - 20;
      if (points.A.y < points.B.y) {
        points.B.y = points.B.y - 40;
      } else {
        points.B.y = points.B.y + 40;
      }

      points.bez = {
        ...points.bez,
        y1: points.A.y,
        x2: points.B.x,
        y2: points.B.y,
        x3: points.B.x,
        y3: points.B.y,
      };

      linesArray.push(points);
    });

    this.setState({ linesArray });
  }

  handleChallengeModal = c => {
    if (c) {
      this.setState({ activeChallenge: c, modalVisible: true });
    }
  };

  handleChangeAdventure = adventure => {
    this.props.dispatch(getAdventure(adventure.adventure_id));
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
    Analytics.screen(Analytics.s.AdventuresTab);
  };

  scrollTo = y => {
    const headerHeight = theme.isAndroid ? 56 : theme.isIphoneX ? 90 : 65;
    const tabHeight = 45;
    // Get the visible screen area
    const screenHeight = theme.fullHeight - (headerHeight + tabHeight);
    // This is the furthest down you can scroll
    const maxBottomScroll = IMAGE_HEIGHT - screenHeight;

    const padding = 150; // Padding below scroll point
    let actualY = IMAGE_HEIGHT / 2 + y - screenHeight + padding;

    if (actualY < 0) actualY = 0;
    else if (actualY > maxBottomScroll) actualY = maxBottomScroll;
    this.props.scrollTo(actualY);
  };

  renderChallenges() {
    const { challenges } = this.props;
    return challenges.map(i => (
      <AdventureMarker
        key={i.id}
        width={theme.fullWidth}
        height={IMAGE_HEIGHT}
        onPress={() => this.handleChallengeModal(i)}
        challenge={i}
      />
    ));
  }

  renderLines() {
    const { linesArray } = this.state;
    return (
      <Flex
        style={{
          position: 'absolute',
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
        }}
      >
        <Svg height={IMAGE_HEIGHT} width={IMAGE_WIDTH}>
          {linesArray.map((l, index) => (
            <Path
              key={`path_${index}`}
              d={`M${l.A.x} ${l.A.y} C ${l.bez.x1} ${l.bez.y1} ${l.bez.x2} ${
                l.bez.y2
                } ${l.bez.x3} ${l.bez.y3}`}
              fill="none"
              strokeOpacity={0.8}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={[10]}
              stroke={l.color}
            />
          ))}
        </Svg>
      </Flex>
    );
  }

  renderTitle(ad) {
    return (
      <Touchable
        isAndroidOpacity={true}
        activeOpacity={0.8}
        onPress={() => {
          const challenge = this.props.challenges.find(c => c.isActive);
          this.handleChallengeModal(challenge);
        }}
        style={styles.titleContainer}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
        >
          {ad.icon && ad.icon.medium ? (
            <Image
              source={{ uri: `${ad.icon.medium}` }}
              style={{ height: 48, width: 48 }}
            />
          ) : null}
          <Text style={styles.title}>
            {ad.name ? ad.name.toUpperCase() : ''}
          </Text>
          <Text style={styles.description}>{ad.description}</Text>
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { t, challenges, adventures, adventureId, activeAdventure, backgroundImage } = this.props;
    return (
      <Flex style={styles.wrap}>
        {backgroundImage ? (
          <Image
            source={{ uri: `${backgroundImage}` }}
            style={{
              // Once the image loads and we get the width and height, adjust it to center
              marginLeft: -IMAGE_MARGIN,
              height: IMAGE_HEIGHT,
              width: IMAGE_WIDTH,
            }}
            resizeMode="cover"
          />
        ) : null}
        {this.renderLines()}
        {!backgroundImage ? (
          <Flex align="center" style={styles.loadingOverlay}>
            <Image resizeMode="contain" source={ANIMATION} />
            <Text style={styles.loadingText}>{t('loading.adventures')}</Text>
          </Flex>
        ) : null}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          {this.state.activeChallenge ? (
            <ChallengeModal
              adventureId={adventureId}
              onDismiss={this.closeModal}
              challenge={this.state.activeChallenge}
            />
          ) : null}
        </Modal>
        <AdventureIcons
          onChangeAdventure={this.handleChangeAdventure}
          adventures={adventures}
        />
        <Flex style={styles.overlay}>
          {challenges && challenges.length > 0 ? this.renderChallenges() : null}
        </Flex>
        {activeAdventure ? this.renderTitle(activeAdventure) : null}
      </Flex>
    );
  }
}

AdventureMap.propTypes = {};

const mapStateToProps = ({ auth, adventures }) => ({
  user: auth.user,
  backgroundImage: adventures.backgroundImageUrl,
  challenges: adventures.challenges,
  adventures: adventures.adventures,
  activeAdventure: adventures.activeAdventure,
  adventureId: adventures.adventureId,
});

export default translate()(connect(mapStateToProps)(AdventureMap));
