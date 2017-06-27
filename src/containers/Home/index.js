import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import FloatingButton from '../FloatingButton';
import ConversationList from '../../components/ConversationList';
import StatusBar from '../../components/StatusBar';

const CONVERSATIONS = {
  id1: {
    id: 'id1',
    name: 'Asher',
    messages: [
      { id: '1', text: 'test 1 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '2', text: 'test 2 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '3', text: 'test 3 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
      { id: '4', text: 'test 4 fdsajklfd sajfkld sajflkds ajfdlksaj fdlskajf dslkajf dslakfj das' },
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


class Home extends Component {
  static navigatorButtons = {
    leftButtons: [{
      title: 'Menu', // for a textual button, provide the button title (label)
      id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      // buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
      // buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      // buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    }],
    rightButtons: [{
      title: 'Videos', // for a textual button, provide the button title (label)
      id: 'video', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
    }],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    // this.props.navigator.push({
    //   screen: 'voke.Menu',
    //   title: 'Menu',
    // });
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'menu') {
        this.props.navigatePush('voke.Menu', {}, { animationType: 'fade' });
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
        <FloatingButton />
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Home);
