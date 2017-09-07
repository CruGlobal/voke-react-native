import React, { Component } from 'react';
import { View, Platform, Image } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { startupAction } from '../../actions/auth';
import { getConversations } from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import FILM_ICON from '../../../images/video_icon.png';
import MENU_ICON from '../../../images/menu_icon.png';

import theme from '../../theme';
// import FloatingButton from '../../components/FloatingButton';
// import { iconsMap } from '../../utils/iconMap';
import ConversationList from '../../components/ConversationList';
import { Flex, Text } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import NULL_STATE from '../../../images/video-button.png';
import VOKE from '../../../images/voke_null_state.png';

function setButtons() {
  if (Platform.OS === 'android') {
    const menu = navMenuOptions().map((m) => ({
      title: m.name,
      id: m.id,
      showAsAction: 'never',
    })).reverse();
    return {
      rightButtons: menu,
      // leftButtons: [{
      //   title: 'Voke',
      //   id: 'logo',
      //   icon: require('../../../images/nav_voke_logo.png'),
      // }],
    };
  }

  return {
    leftButtons: [{
      title: 'Menu', // for a textual button, provide the button title (label)
      id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: MENU_ICON, // for icon button, provide the local image asset name
    }],
    // rightButtons: [{
    //   title: 'Videos', // for a textual button, provide the button title (label)
    //   id: 'video',
    //   icon: FILM_ICON, // for icon button, provide the local image asset name
    // }],
  };
}

class Home extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.secondaryColor,
    screenBackgroundColor: theme.primaryColor,
  };

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({
      title: 'Chats',
      // titleImage: require('../../../images/nav_voke_logo.png'),
    });
    this.props.navigator.setTabBadge({
      tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
      badge: this.props.unReadBadgeCount > 0 ? this.props.unReadBadgeCount : null, // badge value, null to remove badge
    });
  }

  componentDidMount() {
    this.props.dispatch(startupAction(this.props.navigator));
    this.props.dispatch(getConversations());
  }

  componentWillReceiveProps(nextProps) {
    const nextCount = nextProps.unReadBadgeCount;
    const currentCount = this.props.unReadBadgeCount;
    if (nextCount != currentCount) {
      this.props.navigator.setTabBadge({
        // tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
        badge: nextCount === 0 ? null : nextCount, // badge value, null to remove badge
      });
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (Platform.OS === 'android') {
        // Get the selected event from the menu
        const selected = navMenuOptions(this.props).find((m) => m.id === event.id);
        if (selected && selected.onPress) {
          selected.onPress();
        }
      }
      if (event.id === 'menu') {
        Navigation.showModal({
          screen: 'voke.Menu', // unique ID registered with Navigation.registerScreen
          title: 'Settings', // title of the screen as appears in the nav bar (optional)
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
        // this.props.navigatePush('voke.Menu', {}, { animationType: 'slide-up' });
      }
      // if (event.id == 'video') {
      //   this.props.navigatePush('voke.Videos');
      // }
    }
  }

  handleLoadMore() {
    // TODO: Make API call here to load more
    // if (hasMoreConversations) {
    //   loadMore();
    // }
    // LOG('load more conversations...');
  }

  render() {
    const hasItems = this.props.conversations.length;
    // const hasItems = false;

    return (
      <View style={styles.container}>
        <StatusBar />
        {
          hasItems ? (
            <ConversationList
              items={this.props.conversations}
              me={this.props.me}
              onRefresh={() => {}}
              onDelete={() => {}}
              onBlock={() => {}}
              onLoadMore={this.handleLoadMore}
              onSelect={(c) => this.props.navigatePush('voke.Message', {conversation: c})}
            />
          ) : (
            <Flex value={1} align="center" justify="center">
              <Image style={{marginBottom: 20}} source={NULL_STATE} />
              <Text>Find a video and share it with a friend</Text>
            </Flex>
          )
        }
        {
          (hasItems <= 3 && hasItems > 0) ?  (
            <Image style={styles.vokeBot} source={VOKE} />
          ) : null
        }
        <Flex direction="row">
          <Flex value={1} style={styles.selectedTab}></Flex>
          <Flex value={1} style={styles.unSelectedTab}></Flex>
        </Flex>
      </View>
    );
    // <FloatingButton onSelect={(to) => this.props.navigatePush(to)} />
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ messages, auth }) => {
  return {
    conversations: messages.conversations,
    me: auth.user,
    unReadBadgeCount: messages.unReadBadgeCount,
  };
};

export default connect(mapStateToProps, nav)(Home);
