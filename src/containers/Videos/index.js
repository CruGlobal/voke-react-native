import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';

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
      id: 'back', // Android implements this already
      icon: iconsMap['ios-home-outline'], // For iOS only
    }],
  };
}

class Videos extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
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
