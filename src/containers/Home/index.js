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
import FloatingButton from '../../components/FloatingButton';
// import { iconsMap } from '../../utils/iconMap';
import ConversationList from '../../components/ConversationList';
import { Flex, Text } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import NULL_STATE from '../../../images/video-button.png';
import VOKE from '../../../images/voke_null_state.png';

// const CONVERSATIONS = [
//   {
//     id: 'id1',
//     name: 'Asher',
//     messages: [
//       { id: '1', sender: '1', text: 'test 1 one sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '2', sender: '2', text: 'test 2 two sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '3', sender: '1', text: 'test 3 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '4', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '5', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '6', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '7', sender: '2', type: 'video', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '8', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '9', sender: '3', type: 'video', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '10', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//       { id: '11', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
//     ],
//   },
//   {
//     id: 'id2',
//     name: 'Ben',
//     messages: [
//       { id: '1', text: 'test message 2 - 1' },
//       { id: '2', text: 'test message 2 - 2' },
//       { id: '3', text: 'test message 2 - 3' },
//       { id: '4', text: 'test message 2 - 4' },
//       { id: '5', text: 'test message 2 - 5' },
//       { id: '6', text: 'test message 2 - 6' },
//       { id: '7', text: 'test message 2 - 7' },
//       { id: '8', text: 'test message 2 - 8' },
//       { id: '9', text: 'test message 2 - 9' },
//       { id: '10', text: 'test message 2 - 10' },
//       { id: '11', text: 'test message 2 - 11' },
//       { id: '12', text: 'test message 2 - 12' },
//       { id: '13', text: 'test message 2 - 13' },
//       { id: '14', text: 'test message 2 - 14' },
//       { id: '15', text: 'test message 2 - 15' },
//       { id: '16', text: 'test message 2 - 16' },
//       { id: '17', text: 'test message 2 - 17' },
//       { id: '18', text: 'test message 2 - 18' },
//       { id: '19', text: 'test message 2 - 19' },
//     ],
//   },
//   { id: 'id3', name: 'Ben', messages: [] },
// ];

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
    rightButtons: [{
      title: 'Videos', // for a textual button, provide the button title (label)
      id: 'video',
      icon: FILM_ICON, // for icon button, provide the local image asset name
    }],
  };
}

class Home extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
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
      title: 'Home',
      titleImage: require('../../../images/nav_voke_logo.png'),
    });
  }

  componentDidMount() {
    this.props.dispatch(startupAction(this.props.navigator));
    this.props.dispatch(getConversations());
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
      if (event.id == 'video') {
        this.props.navigatePush('voke.Videos');
      }
    }
  }

  handleLoadMore() {
    // TODO: Make API call here to load more
    // if (hasMoreConversations) {
    //   loadMore();
    // }
    // console.warn('load more conversations...');
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
        <FloatingButton onSelect={(to) => this.props.navigatePush(to)} />
      </View>
    );
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
  };
};

export default connect(mapStateToProps, nav)(Home);
