import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/nav';
import { getKickstarters } from '../../actions/videos';
import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';

import styles from './styles';
import ApiLoading from '../ApiLoading';
import { Flex, Text, Touchable, VokeIcon } from '../../components/common';

function setButtons() {
  const leftButton1 = {
    title: 'Back',
    id: 'back',
    icon: vokeIcons['back'],
  };
  return {
    leftButtons: [leftButton1],
  };
}


class KickstartersTab extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      kickstarters: [],
    };

    this.getKickstarters = this.getKickstarters.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderRow = this.renderRow.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentDidMount() {
    this.getKickstarters();
    Analytics.screen('In-Chat KickStarters');
  }

  componentWillMount() {
    this.props.navigator.setTitle({
      title: 'Kickstarters',
    });
    this.props.navigator.setButtons(setButtons());
  }

  getKickstarters() {
    if (this.props.latestItem) {
      this.props.dispatch(getKickstarters(this.props.latestItem)).then((results) => {
        this.setState({ kickstarters: results.questions });
      }).catch((err) => {
        LOG('kickstarter err', err);
        this.setState({ kickstarters: [] });
      });
    } else {
      this.setState({ kickstarters: [] });
    }
  }

  renderRow(item) {
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelectKickstarter(item.content)} key={item.id}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          animation="slideInUp"
        >
          <Flex direction="column" align="start" justify="start" style={styles.kickstarterWrap}>
            <Text style={styles.kickstarterText}>
              {item.content}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  renderHeader() {
    const { kickstarters } = this.state;
    if (kickstarters.length === 0) {
      return null;
    }

    return (
      <Flex align="center" value={1} style={styles.chatImageWrap}>
        <VokeIcon name="kickstarter" style={styles.chatImage} />
        <Text style={styles.description}>Add one of these kickstarters to your chat.</Text>
      </Flex>
    );
  }

  render() {
    const { kickstarters } = this.state;
    const hasKickstarters = kickstarters.length > 0;
    let content = null;
    if (!hasKickstarters) {
      content = (
        <Text style={styles.nothingText}>Kickstarter questions will be visible after you select and share a video with a friend.</Text>
      );
    } else {
      content = this.state.kickstarters.map(this.renderRow);
    }


    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={!hasKickstarters ? { flex: 1 } : undefined}
      >
        {this.renderHeader()}
        <Flex value={1} align="center" justify="center" style={styles.content}>
          {content}
        </Flex>
        <ApiLoading />
      </ScrollView>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelectKickstarter: PropTypes.func.isRequired,
  latestItem: PropTypes.string,
};

export default connect(null, nav)(KickstartersTab);
