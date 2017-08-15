import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getVideos } from '../../actions/videos';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
// import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import HOME_ICON from '../../../images/home_icon.png';

import PillButton from '../../components/PillButton';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';
import { Flex } from '../../components/common';

const VIDEOS = [
  {id: '1', title: 'The odds of you explained...', description: 'The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible.'},
  {id: '2', title: 'The best video ever', description: 'The fact tha'},
  {id: '3', title: 'another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {id: '4', title: 'DJ Kahled does another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
  {id: '5', title: 'Bryan doing the hokie pokie', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
];

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: HOME_ICON, // For iOS only
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
    this.state = {
      selectedFilter: 'all',
    };

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
    if (!this.props.onVideoShare) {
      this.props.navigator.setButtons(setButtons());
    }
  }

  componentDidMount() {
    this.props.dispatch(getVideos());
  }

  render() {
    const { selectedFilter } = this.state;
    return (
      <View style={styles.container}>
        <Flex style={{height: 50}} align="center" justify="center">
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Flex direction="row" style={{padding: 10}}>
              <PillButton
                text="All"
                filled={selectedFilter === 'all'}
                onPress={()=> this.setState({selectedFilter: 'all'})}
              />
              <PillButton
                text="Featured"
                filled={selectedFilter === 'featured'}
                onPress={()=> this.setState({selectedFilter: 'featured'})}
              />
              <PillButton
                text="Popular"
                filled={selectedFilter === 'popular'}
                onPress={()=> this.setState({selectedFilter: 'popular'})}
              />
              <PillButton
                text="Themes"
                filled={selectedFilter === 'themes'}
                onPress={()=> this.setState({selectedFilter: 'themes'})}
              />
            </Flex>
          </ScrollView>
        </Flex>
        <StatusBar />
        <VideoList
          items={VIDEOS}
          onSelect={(c) => {
            this.props.navigatePush('voke.VideoDetails', {
              video: c,
              // Only pass in this prop when it exists
              onVideoShare: this.props.onVideoShare ? (v) => {
                this.props.onVideoShare(v);
                this.props.navigateBack();
              } : undefined,
            });
          }}
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
