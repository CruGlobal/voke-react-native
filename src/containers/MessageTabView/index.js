// TODO: Remove this component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SegmentedControlIOS } from 'react-native';
import { connect } from 'react-redux';

import theme, { COLORS } from '../../theme';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';

import styles from './styles';
import { Flex } from '../../components/common';
import KickstartersTab from '../KickstartersTab';
import VideosTab from '../VideosTab';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android handles back already
      icon: iconsMap['ios-arrow-back'], // This is just for iOS
    }],
  };
}

class MessageTabView extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
    navBarNoBorder: true,
    // Android styles
    navBarHideOnScroll: true,
    topBarCollapseOnScroll: false,
    topTabTextColor: theme.lightText,
    selectedTopTabTextColor: theme.lightText,
    selectedTopTabIndicatorColor: COLORS.YELLOW,
    selectedTopTabIndicatorHeight: 5,
  };
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.renderTab = this.renderTab.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    // LOG('event', event);
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  renderTab() {
    if (this.props.type === 'kickstarter') {
      return (
        <KickstartersTab
          {...this.props}
          onSelectKickstarter={(k) => {
            LOG('selected kickstarter!', k);
            this.props.onSelectKickstarter(k);
            this.props.navigateBack();
          }}
          latestItem={this.props.latestItem}
        />
      );
    } else {
      return (
        <VideosTab
          {...this.props}
          onSelectVideo={(v) => {
            LOG('selected video!', v);
            this.props.onSelectVideo(v);
          }}
        />
      );
    }
  }

  render() {
    return (
      <Flex value={1} direction="column">
        <Flex value={1}>
          {this.renderTab()}
        </Flex>
      </Flex>
    );
  }
}


MessageTabView.propTypes = {
  ...NavPropTypes,
  onSelectKickstarter: PropTypes.func.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  latestItem: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default connect(null, nav)(MessageTabView);
