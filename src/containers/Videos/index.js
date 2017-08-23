import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { getVideos, getFeaturedVideos, getPopularVideos, getTags, getSelectedThemeVideos } from '../../actions/videos';
import PropTypes from 'prop-types';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
// import { iconsMap } from '../../utils/iconMap';
import theme, { COLORS } from '../../theme';
import HOME_ICON from '../../../images/home_icon.png';

import PillButton from '../../components/PillButton';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';
import { Flex } from '../../components/common';

// const VIDEOS = [
//   {id: '1', title: 'The odds of you explained...', description: 'The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible. The fact that we are on this planet right now is almost statistically impossible.'},
//   {id: '2', title: 'The best video ever', description: 'The fact tha'},
//   {id: '3', title: 'another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
//   {id: '4', title: 'DJ Kahled does another one', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
//   {id: '5', title: 'Bryan doing the hokie pokie', description: 'The fact that we are on this planet right now is almost statistically impossible.'},
// ];

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
      previousFilter: '',
      videos: [],
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleFilter = this.handleFilter.bind(this);
    this.updateVideoList = this.updateVideoList.bind(this);
    this.showThemes = this.showThemes.bind(this);
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleDismissedLightBox = this.handleDismissedLightBox.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  handleThemeSelect(tag) {
    this.props.dispatch(getSelectedThemeVideos(tag)).then(()=>{
      this.setState({ videos: this.props.selectedThemeVideos});
    });
  }

  handleDismissedLightBox() {
    let shouldntScroll = true
    this.handleFilter(this.state.previousFilter, shouldntScroll);
  }

  showThemes() {
    Navigation.showLightBox({
      screen: 'voke.ThemeSelect', // unique ID registered with Navigation.registerScreen
      passProps: {
        themes: this.props.tags,
        onSelect: this.handleThemeSelect,
        onDismissLightBox: this.handleDismissedLightBox,
      },
      style: {
        backgroundBlur: 'dark', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
      },
    });
  }

  componentWillMount() {
    if (!this.props.onSelectVideo) {
      this.props.navigator.setButtons(setButtons());
    }
  }

  componentDidMount() {
    this.props.dispatch(getVideos()).then(()=> {
      this.updateVideoList('all');
    });
  }

  handleFilter(filter, shouldntScroll) {
    if (filter === 'themes') {
      this.setState({ previousFilter: this.state.selectedFilter });
      this.setState({selectedFilter: filter});
    } else {
      this.setState({selectedFilter: filter});
      if (shouldntScroll) {
        return;
      } else {
        this.videoList.scrollToBeginning();
      }
    }

    if (filter === 'featured') {
      this.props.dispatch(getFeaturedVideos()).then(()=>{
        this.updateVideoList(filter);
      });
    } else if (filter === 'popular') {
      this.props.dispatch(getPopularVideos()).then(()=>{
        this.updateVideoList(filter);
      });
    } else if (filter === 'all') {
      this.props.dispatch(getVideos()).then(()=>{
        this.updateVideoList(filter);
      });
    } else if (filter === 'themes') {
      this.props.dispatch(getTags()). then(()=> {
        this.showThemes();
      });
    }
  }

  updateVideoList(type) {
    if (type === 'featured') {
      this.setState({ videos: this.props.featured});
    } else if (type === 'all') {
      this.setState({ videos: this.props.all});
    } else if (type === 'popular') {
      this.setState({ videos: this.props.popular});
    }
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
                onPress={()=> this.handleFilter('all')}
              />
              <PillButton
                text="Featured"
                filled={selectedFilter === 'featured'}
                onPress={()=> this.handleFilter('featured')}
              />
              <PillButton
                text="Popular"
                filled={selectedFilter === 'popular'}
                onPress={()=> this.handleFilter('popular')}
              />
              <PillButton
                text="Themes"
                filled={selectedFilter === 'themes'}
                onPress={()=> this.handleFilter('themes')}
              />
            </Flex>
          </ScrollView>
        </Flex>
        <StatusBar />
        <VideoList
          ref={(c) => this.videoList = c}
          items={this.state.videos}
          onSelect={(c) => {
            this.props.navigatePush('voke.VideoDetails', {
              video: c,
              onSelectVideo: this.props.onSelectVideo ? this.props.onSelectVideo : null,
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
  onSelectVideo: PropTypes.func,
};

const mapStateToProps = ({ videos }) => ({
  all: videos.all,
  popular: videos.popular,
  featured: videos.featured,
  tags: videos.tags,
  selectedThemeVideos: videos.selectedThemeVideos,
});

export default connect(mapStateToProps, nav)(Videos);
