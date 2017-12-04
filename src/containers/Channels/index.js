import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getVideos, getFeaturedVideos, getPopularVideos, getTags, getSelectedThemeVideos } from '../../actions/videos';
import { getAllOrganizations } from '../../actions/channels';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/nav';

import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';
import CONSTANTS from '../../constants';

import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import ChannelsList from '../../components/ChannelsList';
import StatusBar from '../../components/StatusBar';
import { Flex, Text } from '../../components/common';

class Channels extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allOrganizations: [],
      myChannels: [],
      featuredChannels: [],
      browseChannels: [],
    };

    this.handleNextPage = this.handleNextPage.bind(this);
    // this.handleFilter = this.handleFilter.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    // this.updateChannelList = this.updateChannelList.bind(this);
  }

  componentDidMount() {
    // if (this.props.all.length === 0) {
      this.props.dispatch(getAllOrganizations()).then(() => {
        this.setState({allOrganizations: this.props.all});
      }).catch((err)=> {
        LOG(JSON.stringify(err));
        if (err.error === 'Messenger not configured') {
          setTimeout(() =>{
            this.props.dispatch(getAllOrganizations()).then(() => {
            }).catch((err)=> {
              LOG(JSON.stringify(err));
              if (err.error === 'Messenger not configured') {
                if (this.props.user.first_name) {
                  this.props.navigateResetToNumber();
                } else {
                  this.props.navigateResetToProfile();
                }
              }
            });
          }, 3000);
        }
      });
    // } else {
    //   this.setState({ allOrganizations: this.props.all });
    // }
    Analytics.screen('Channels');
  }


  handleRefresh() {
    return this.handleFilter(this.state.selectedFilter);
  }

  handleNextPage() {
    const pagination = this.props.pagination;
    const filter = this.state.selectedFilter;
    // LOG('next page', filter, pagination[filter]);
    if (!pagination[filter] || !pagination[filter].hasMore) {
      return;
    }
    const page = pagination[filter].page + 1;
    const query = { page };


    // if (filter === 'featured') {
    //   this.props.dispatch(getFeaturedVideos(query)).then((r) => {
    //     this.updateChannelList(filter);
    //     return r;
    //   });
    // } else if (filter === 'myChannels') {
    //   this.props.dispatch(getPopularVideos(query)).then((r) => {
    //     this.updateChannelList(filter);
    //     return r;
    //   });
    // } else if (filter === 'browse') {
    //   this.props.dispatch(getVideos(query)).then((r) => {
    //     this.updateChannelList(filter);
    //     return r;
    //   });
    // }
  }

  // This method should return a Promise so that it can handle refreshing correctly
  // handleFilter(filter) {
  //   if (filter === 'featured') {
  //     return this.props.dispatch(getFeaturedVideos()).then((r) => {
  //       this.updateChannelList(filter);
  //       return r;
  //     });
  //   } else if (filter === 'popular') {
  //     return this.props.dispatch(getPopularVideos()).then((r) => {
  //       this.updateChannelList(filter);
  //       return r;
  //     });
  //   } else if (filter === 'all') {
  //     return this.props.dispatch(getVideos()).then((r) => {
  //       this.updateChannelList(filter);
  //       return r;
  //     });
  //   } else if (filter === 'themes') {
  //     return this.props.dispatch(getTags()).then((r) => {
  //       this.showThemes();
  //       return r;
  //     });
  //   }
  //   return Promise.resolve();
  // }

  // updateChannelList(type) {
  //   if (type === 'featured') {
  //     this.setState({ videos: this.props.featured});
  //   } else if (type === 'all') {
  //     this.setState({ videos: this.props.all});
  //   } else if (type === 'popular') {
  //     this.setState({ videos: this.props.popular});
  //   }
  // }

  render() {
    const { allOrganizations, myChannels, browseChannels, featuredChannels } = this.state;
    // LOG(allOrganizations);
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            <HeaderIcon
              image={vokeIcons['menu']}
              onPress={() => this.props.navigatePush('voke.Menu')} />
          }
          right={
            CONSTANTS.IS_ANDROID ? (
              <PopupMenu
                actions={navMenuOptions(this.props)}
              />
            ) : null
          }
          title="Channels"
        />
        <ScrollView >
          <Text style={styles.title}>MY CHANNELS</Text>
          <ChannelsList
            ref={(c) => this.myChannelsList = c}
            items={allOrganizations}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            // onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>FEATURED</Text>
          <ChannelsList
            ref={(c) => this.featuredChannelsList = c}
            items={allOrganizations}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            // onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>BROWSE</Text>
          <ChannelsList
            ref={(c) => this.browseChannelsList = c}
            items={allOrganizations}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            // onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
          />
          <Flex self="stretch" style={styles.separator} />
        </ScrollView>
        <ApiLoading />
      </View>
    );
  }
}

Channels.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth, channels }) => ({
  all: channels.all,
  user: auth.user,
  featured: channels.featured,
  browse: channels.browse,
  myChannels: channels.myChannels,
  isTabSelected: auth.homeTabSelected === 2,
  pagination: channels.pagination,
});

export default connect(mapStateToProps, nav)(Channels);
