import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { getAllOrganizations, getMyOrganizations, getFeaturedOrganizations } from '../../actions/channels';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/nav';

import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import ChannelsList from '../../components/ChannelsList';
import StatusBar from '../../components/StatusBar';
import { Flex, Text, RefreshControl } from '../../components/common';
import theme from '../../theme';

class Channels extends Component {

  state = { refreshing: false };

  componentDidMount() {
    Analytics.screen('Channels');

    LOG('channels', this.props.myChannels, this.props.featuredChannels, this.props.allChannels);
    if (this.props.allChannels.length > 0) {
      return;
    }
    this.props.dispatch(getAllOrganizations()).catch((err)=> {
      LOG(JSON.stringify(err));
      if (err.error === 'Messenger not configured') {
        setTimeout(() =>{
          this.props.dispatch(getAllOrganizations()).catch((err)=> {
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
    this.props.dispatch(getMyOrganizations());
    this.props.dispatch(getFeaturedOrganizations());
  }

  handleRefreshAll = () => {
    this.props.dispatch(getAllOrganizations());
    this.props.dispatch(getMyOrganizations());
    this.props.dispatch(getFeaturedOrganizations());
  }

  handleNextPage = (filter) => {
    const pagination = this.props.pagination;
    if (!pagination[filter] || !pagination[filter].hasMore) {
      return;
    }
    const page = pagination[filter].page + 1;
    const query = { page };


    if (filter === 'featured') {
      this.props.dispatch(getFeaturedOrganizations(query));
    } else if (filter === 'myChannels') {
      this.props.dispatch(getMyOrganizations());
    } else if (filter === 'all') {
      this.props.dispatch(getAllOrganizations());
    }
  }

  render() {
    const { allChannels, myChannels, featuredChannels } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? undefined : (
              <HeaderIcon
                image={vokeIcons['menu']}
                onPress={() => this.props.navigatePush('voke.Menu')} />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu
                actions={navMenuOptions(this.props)}
              />
            ) : null
          }
          title="Channels"
        />
        <ScrollView
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefreshAll}
          />}
        >
          <Text style={styles.title}>MY CHANNELS</Text>
          <ChannelsList
            ref={(c) => this.myChannelsList = c}
            items={myChannels}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('myChannels')}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>FEATURED</Text>
          <ChannelsList
            ref={(c) => this.featuredList = c}
            items={featuredChannels}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('featured')}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>BROWSE</Text>
          <ChannelsList
            ref={(c) => this.browseChannelsList = c}
            items={allChannels}
            onSelect={(c) => {
              this.props.navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('all')}
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
  user: auth.user,
  allChannels: channels.all,
  featuredChannels: channels.featured,
  myChannels: channels.myChannels,
  isTabSelected: auth.homeTabSelected === 2,
  pagination: channels.pagination,
});

export default connect(mapStateToProps, nav)(Channels);
