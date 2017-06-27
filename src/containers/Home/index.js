import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { navMenuOptions } from '../../utils/menu';

import VOKE_LOGO from '../../../images/vokeLogo.png';

import FloatingButton from '../../components/FloatingButton';
import { iconsMap } from '../../utils/iconMap';
import ConversationList from '../../components/ConversationList';
import StatusBar from '../../components/StatusBar';
import { Navigation } from 'react-native-navigation';

const CONVERSATIONS = {
  id1: {
    id: 'id1',
    name: 'Asher',
    messages: [
      { id: '1', sender: '1', text: 'test 1 one sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '2', sender: '2', text: 'test 2 two sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '3', sender: '1', text: 'test 3 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '4', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '5', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '4', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '5', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '4', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '5', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
    ],
  },
  id2: {
    id: 'id2',
    name: 'Ben',
    messages: [
      { id: '1', text: 'test message 2 - 1' },
      { id: '2', text: 'test message 2 - 2' },
      { id: '3', text: 'test message 2 - 3' },
      { id: '4', text: 'test message 2 - 4' },
      { id: '5', text: 'test message 2 - 5' },
      { id: '6', text: 'test message 2 - 6' },
      { id: '7', text: 'test message 2 - 7' },
      { id: '8', text: 'test message 2 - 8' },
      { id: '9', text: 'test message 2 - 9' },
      { id: '10', text: 'test message 2 - 10' },
      { id: '11', text: 'test message 2 - 11' },
      { id: '12', text: 'test message 2 - 12' },
      { id: '13', text: 'test message 2 - 13' },
      { id: '14', text: 'test message 2 - 14' },
      { id: '15', text: 'test message 2 - 15' },
      { id: '16', text: 'test message 2 - 16' },
      { id: '17', text: 'test message 2 - 17' },
      { id: '18', text: 'test message 2 - 18' },
      { id: '19', text: 'test message 2 - 19' },
    ],
  },
};

function setButtons() {
  if (Platform.OS === 'android') {
    const menu = navMenuOptions().map((m) => ({
      title: m.name,
      id: m.id,
      showAsAction: 'never',
    })).reverse();
    return {
      rightButtons: menu,
    };
  }

  return {
    leftButtons: [{
      title: 'Menu', // for a textual button, provide the button title (label)
      id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-menu-outline'], // for icon button, provide the local image asset name
    }],
    rightButtons: [{
      title: 'Videos', // for a textual button, provide the button title (label)
      id: 'video',
      icon: iconsMap['ios-film-outline'], // for icon button, provide the local image asset name
    }],
  };
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons(this.props.dispatch, this.props.navigatePush));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (Platform.OS === 'android') {
        // Get the selected event from the menu
        const selected = navMenuOptions(this.props.dispatch, this.props.navigatePush).find((m) => m.id === event.id);
        if (selected && selected.onPress) {
          selected.onPress();
        }
      }
      if (event.id === 'menu') {
        Navigation.showModal({
          screen: 'voke.Menu', // unique ID registered with Navigation.registerScreen
          title: 'Settings', // title of the screen as appears in the nav bar (optional)
          passProps: {}, // simple serializable object that will pass as props to the modal (optional)
          navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
        // this.props.navigatePush('voke.Menu', {}, { animationType: 'slide-up' });
      }
      if (event.id == 'video') {
        this.props.navigatePush('voke.Videos', {}, {titleImage: VOKE_LOGO});
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <ConversationList
          items={CONVERSATIONS}
          onRefresh={() => {}}
          onSelect={(c) => this.props.navigatePush('voke.Message', c, {titleImage: VOKE_LOGO})}
        />
        <FloatingButton onSelect={(to) => this.props.navigatePush(to)} />
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Home);
