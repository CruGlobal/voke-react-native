import React, { Component } from 'react';
import { BackHandler, View, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import { TAB_SELECTED } from '../../constants';
import { getVideos, getFeaturedVideos, getPopularVideos, getTags, getSelectedThemeVideos } from '../../actions/videos';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import theme from '../../theme';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import PillButton from '../../components/PillButton';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';
import { Flex } from '../../components/common';

function setButtons(showBack) {
  if (!showBack && Platform.OS === 'android') {
    let menu = navMenuOptions().map((m) => ({
      title: m.name,
      id: m.id,
      showAsAction: 'never',
    })).reverse();
    menu.unshift({
      title: 'Search', // for a textual button, provide the button title (label)
      id: 'search',
      showAsAction: 'always',
      icon: vokeIcons['search'], // for icon button, provide the local image asset name
    });
    return {
      rightButtons: menu,
    };
  }
  const leftButton1 = {
    title: showBack ? 'Back' : 'Menu',
    id: showBack ? 'back' : 'menu',
    icon: showBack ? vokeIcons['back'] : vokeIcons['menu'],
  };
  return {
    leftButtons: [leftButton1],
    rightButtons: [{
      title: 'Search', // for a textual button, provide the button title (label)
      id: 'search',
      icon: vokeIcons['search'], // for icon button, provide the local image asset name
    }],
  };
}

class Videos extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
    screenBackgroundColor: theme.primaryColor,
    statusBarHidden: false,
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
    this.handleDismissTheme = this.handleDismissTheme.bind(this);
    this.backHandler = this.backHandler.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      } else if (event.id == 'search') {
        this.handleFilter('themes');
      } else if (Platform.OS === 'android') {
        // Get the selected event from the menu
        const selected = navMenuOptions(this.props).find((m) => m.id === event.id);
        if (selected && selected.onPress) {
          selected.onPress();
        }
      } else if (event.id === 'menu') {
        Navigation.showModal({
          screen: 'voke.Menu', // unique ID registered with Navigation.registerScreen
          title: 'Settings', // title of the screen as appears in the nav bar (optional)
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
    }

    // Keep track of selected tab in redux
    if (event.id === 'bottomTabSelected') {
      this.props.dispatch({ type: TAB_SELECTED, tab: 1 });
    }
  }

  componentWillMount() {
    if (!this.props.onSelectVideo) {
      this.props.navigator.setButtons(setButtons());
    } else {
      this.props.navigator.setButtons(setButtons(true));
    }
    this.props.navigator.setTitle({ title: 'Videos' });
  }

  componentDidMount() {
    // Do this after mounting because Android sometimes doesn't work on initial load
    if (!this.props.onSelectVideo) {
      this.props.navigator.setButtons(setButtons());
    } else {
      this.props.navigator.setButtons(setButtons(true));
    }

    // If there are no videos when the component mounts, get them, otherwise just set it
    if (this.props.all.length === 0) {
      this.props.dispatch(getVideos()).then(() => {
        this.updateVideoList('all');
      });
    } else {
      this.setState({ videos: this.props.all });
    }

    Analytics.screen('Videos');

    // If your on the home tab, handle the back button
    if (!this.props.onSelectVideo) {
      BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    }
  }

  componentWillUnmount() {
    if (!this.props.onSelectVideo) {
      BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }
  }

  // Handle going from the Videos Tab to the Chat tab when Android back is pressed
  backHandler() {
    if (this.props.isTabSelected) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
      return true;
    }
    return false;
  }

  handleThemeSelect(tag) {
    this.props.dispatch(getSelectedThemeVideos(tag)).then(() => {
      this.setState({ videos: this.props.selectedThemeVideos});
      // Scroll to the top after selecting a theme
      this.videoList.scrollToBeginning();
    });
  }

  handleDismissTheme() {
    let shouldntScroll = true;
    this.handleFilter(this.state.previousFilter, shouldntScroll);
  }

  showThemes() {
    if (Platform.OS === 'android') {
      Navigation.showModal({
        screen: 'voke.ThemeSelect',
        animationType: 'fade',
        passProps: {
          themes: this.props.tags,
          onSelect: this.handleThemeSelect,
          onDismiss: this.handleDismissTheme,
        },
        navigatorStyle: {
          screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        // Stop back button from closing modal https://github.com/wix/react-native-navigation/issues/250#issuecomment-254186394
        overrideBackPress: true,
      });
    } else {
      Navigation.showLightBox({
        screen: 'voke.ThemeSelect',
        passProps: {
          themes: this.props.tags,
          onSelect: this.handleThemeSelect,
          onDismiss: this.handleDismissTheme,
        },
        style: {
          backgroundBlur: 'dark', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        },
      });
    }
  }

  handleFilter(filter, shouldntScroll) {
    if (filter === 'themes') {
      this.setState({ previousFilter: this.state.selectedFilter, selectedFilter: filter });
    } else {
      this.setState({ selectedFilter: filter });
      if (!shouldntScroll) {
        this.videoList.scrollToBeginning();
      }
    }

    if (filter === 'featured') {
      this.props.dispatch(getFeaturedVideos()).then(() => {
        this.updateVideoList(filter);
      });
    } else if (filter === 'popular') {
      this.props.dispatch(getPopularVideos()).then(() => {
        this.updateVideoList(filter);
      });
    } else if (filter === 'all') {
      this.props.dispatch(getVideos()).then(() => {
        this.updateVideoList(filter);
      });
    } else if (filter === 'themes') {
      this.props.dispatch(getTags()).then(() => {
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
    const { onSelectVideo } = this.props;
    const { selectedFilter } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Flex style={{height: 50}} align="center" justify="center">
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Flex direction="row" style={{padding: 10}}>
              <PillButton
                text="All"
                filled={selectedFilter === 'all'}
                onPress={() => this.handleFilter('all')}
                animation="slideInUp"
              />
              <PillButton
                text="Featured"
                filled={selectedFilter === 'featured'}
                onPress={() => this.handleFilter('featured')}
                animation="slideInUp"
              />
              <PillButton
                text="Popular"
                filled={selectedFilter === 'popular'}
                onPress={() => this.handleFilter('popular')}
                animation="slideInUp"
              />
              <PillButton
                text="Themes"
                filled={selectedFilter === 'themes'}
                onPress={() => this.handleFilter('themes')}
                animation="slideInUp"
              />
            </Flex>
          </ScrollView>
        </Flex>
        <VideoList
          ref={(c) => this.videoList = c}
          items={this.state.videos}
          onSelect={(c) => {
            Navigation.showModal({
              screen: 'voke.VideoDetails',
              animationType: 'slide-up',
              passProps: {
                video: c,
                onSelectVideo,
              },
              // Stop back button from closing modal https://github.com/wix/react-native-navigation/issues/250#issuecomment-254186394
              overrideBackPress: true,
            });
            // this.props.navigatePush('voke.VideoDetails', {
            //   video: c,
            //   onSelectVideo,
            // });
          }}
          onRefresh={() => {}}
        />
        {
          !onSelectVideo ? (
            <Flex direction="row">
              <Flex value={1} style={styles.unSelectedTab}></Flex>
              <Flex value={1} style={styles.selectedTab}></Flex>
            </Flex>
          ) : null
        }
        <ApiLoading />
      </View>
    );
  }
}

Videos.propTypes = {
  ...NavPropTypes,
  onSelectVideo: PropTypes.func,
};

const mapStateToProps = ({ auth, videos }) => ({
  all: videos.all,
  popular: videos.popular,
  featured: videos.featured,
  tags: videos.tags,
  selectedThemeVideos: videos.selectedThemeVideos,
  isTabSelected: auth.homeTabSelected === 1,
});

export default connect(mapStateToProps, nav)(Videos);
