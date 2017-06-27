import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import { iconsMap } from '../../utils/iconMap';

import SubHeader from '../SubHeader';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';

const VIDEOS = [
  {title: 'The odds of you explained...', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'The best video ever', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'DJ Kahled does another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {title: 'Bryan doing the hokie pokie', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
];

function setButtons() {
  return {
    leftButtons: [{
      title: 'Home', // for a textual button, provide the button title (label)
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-home-outline'], // for icon button, provide the local image asset name
    }],
  };
}

class Videos extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  static navigatorStyle = {
    navBarNoBorder: true,
  };

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  render() {
    return (
      <View style={styles.container}>
        <SubHeader />
        <StatusBar />
        <VideoList
          items={VIDEOS}
          onSelect={(c) => this.props.navigatePush('voke.VideoDetails', { video: c })}
          onRefresh={() => {}}
        />
      </View>
    );
  }
}

Videos.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Videos);
