import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { swapi, swapi2 } from '../../actions/auth';
import { navMenuOptions } from '../../utils/menu';

import theme from '../../theme';
import FloatingButton from '../../components/FloatingButton';
import { iconsMap } from '../../utils/iconMap';
import ConversationList from '../../components/ConversationList';
import StatusBar from '../../components/StatusBar';

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
      { id: '6', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '7', sender: '2', type: 'video', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '8', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '9', sender: '3', type: 'video', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '10', sender: '2', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '11', sender: '3', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
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
  id3: { id: 'id3', name: 'Ben', messages: [] },
  id4: { id: 'id4', name: 'Ben', messages: [] },
  id5: { id: 'id5', name: 'Ben', messages: [] },
  id6: { id: 'id6', name: 'Ben', messages: [] },
  id7: { id: 'id7', name: 'Ben', messages: [] },
  id8: { id: 'id8', name: 'Ben', messages: [] },
  id9: { id: 'id9', name: 'Ben', messages: [] },
  id10: { id: 'id10', name: 'Ben', messages: [] },
  id11: { id: 'id11', name: 'Ben', messages: [] },
  id12: { id: 'id12', name: 'Ben', messages: [] },
  id13: { id: 'id13', name: 'Ben', messages: [] },
  id14: { id: 'id14', name: 'Ben', messages: [] },
  id15: { id: 'id15', name: 'Ben', messages: [] },
  id16: { id: 'id16', name: 'Ben', messages: [] },
  id17: { id: 'id17', name: 'Ben', messages: [] },
  id18: { id: 'id18', name: 'Ben', messages: [] },
  id19: { id: 'id19', name: 'Ben', messages: [] },
  id20: { id: 'id20', name: 'Ben', messages: [] },
  id21: { id: 'id21', name: 'Ben', messages: [] },
  id22: { id: 'id22', name: 'Ben', messages: [] },
  id23: { id: 'id23', name: 'Ben', messages: [] },
  id24: { id: 'id24', name: 'Ben', messages: [] },
  id25: { id: 'id25', name: 'Ben', messages: [] },
  id26: { id: 'id26', name: 'Ben', messages: [] },
  id27: { id: 'id27', name: 'Ben', messages: [] },
  id28: { id: 'id28', name: 'Ben', messages: [] },
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
      // leftButtons: [{
      //   title: 'Voke',
      //   id: 'logo',
      //   icon: require('../../../images/vokeLogo.png'),
      // }],
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
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
    screenBackgroundColor: theme.primaryColor,
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({
      title: 'Home',
      titleImage: require('../../../images/vokeLogo.png'),
    });
  }

  componentDidMount() {
    // this.props.dispatch(swapi());
    // this.props.dispatch(swapi2());
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
          passProps: {}, // simple serializable object that will pass as props to the modal (optional)
          navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
        // this.props.navigatePush('voke.Menu', {}, { animationType: 'slide-up' });
      }
      if (event.id == 'video') {
        this.props.navigatePush('voke.Videos');
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
          onSelect={(c) => this.props.navigatePush('voke.Message', c)}
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
