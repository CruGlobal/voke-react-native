import React, { Component } from 'react';
import { View, ScrollView, Platform, Image, Alert, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import { TAB_SELECTED } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import { startupAction, cleanupAction, blockMessenger, reportUserAction } from '../../actions/auth';
import  Analytics from '../../utils/analytics';

import { getConversations, deleteConversation, getConversationsPage } from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import ConversationList from '../../components/ConversationList';
// import TabBarIndicator from '../../components/TabBarIndicator';
import Header, { HeaderIcon } from '../Header';
import { Flex, Text, RefreshControl } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import NULL_STATE from '../../../images/video-button.png';
import VOKE from '../../../images/voke_null_state.png';
import CONSTANTS, { IS_SMALL_ANDROID } from '../../constants';

const CONTACT_LENGTH_SHOW_VOKEBOT = IS_SMALL_ANDROID ? 2 : 3;

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
      icon: vokeIcons['menu'], // for icon button, provide the local image asset name
    }],
  };
}

class Home extends Component {
  // static navigatorStyle = {
  //   navBarButtonColor: theme.lightText,
  //   navBarTextColor: theme.headerTextColor,
  //   navBarBackgroundColor: theme.headerBackgroundColor,
  //   screenBackgroundColor: theme.primaryColor,
  //   statusBarHidden: false,
  // };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      isLoading: false,
    };

    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
  }

  componentWillMount() {
    // this.props.navigator.setButtons(setButtons());
    // this.props.navigator.setTabBadge({
    //   tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
    //   badge: this.props.unReadBadgeCount > 0 ? this.props.unReadBadgeCount : null, // badge value, null to remove badge
    // });
  }

  componentDidMount() {
    Analytics.screen('Home Chats');
    setTimeout(() => {
      this.props.dispatch(startupAction(this.props.navigator));
    }, 50);

    // this.props.dispatch(getConversations()).catch((err)=> {
    //   if (err.error === 'Messenger not configured') {
    //     // Do this because the api can be slow when a user creates an account and our app is faster than the api
    //     setTimeout(() => {
    //       this.props.dispatch(getConversations()).catch((err)=> {
    //         if (err.error === 'Messenger not configured') {
    //           this.props.navigateResetToNumber();
    //         }
    //       });
    //     }, 3000);
    //   }
    // });

    this.props.dispatch({ type: TAB_SELECTED, tab: 0 });

    if (this.props.onMount) {
      this.props.onMount(this.props.navigator);
    }

  }

  componentWillReceiveProps(nextProps) {
    const nextCount = nextProps.unReadBadgeCount;
    const currentCount = this.props.unReadBadgeCount;
    if (nextCount != currentCount) {
      this.props.navigator.setTabBadge({
        badge: nextCount === 0 ? null : nextCount, // badge value, null to remove badge
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(cleanupAction());
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
          animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
    }

    // Keep track of selected tab in redux
    if (event.id === 'bottomTabSelected') {
      this.props.dispatch({ type: TAB_SELECTED, tab: 0 });
    }
  }

  handleMenuPress() {
    this.props.navigatePush('voke.Menu');
  }

  handleLoadMore() {
    if (this.props.pagination.hasMore) {
      // LOG('has more conversations to load');
      this.props.dispatch(getConversationsPage(this.props.pagination.page + 1));
    }
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    this.props.dispatch(getConversations()).then(() => {
      this.setState({ refreshing: false });
    }).catch(() => {
      this.setState({ refreshing: false });
    });
  }

  handleDelete(data) {
    this.setState({ isLoading: true });
    this.props.dispatch(deleteConversation(data.id)).then(() => {
      this.setState({ isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  block(otherPerson, data) {
    this.setState({ isLoading: true });
    this.props.dispatch(blockMessenger(otherPerson.id)).then(() => {
      this.handleDelete(data);
      this.setState({ isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  handleSubmitReport(text, otherPerson, data) {
    this.props.dispatch(reportUserAction(text, otherPerson.id));
    this.block(otherPerson, data);
  }

  handleBlock(otherPerson, data) {
    Alert.alert(
      `Are you sure you want to block ${otherPerson.first_name ? otherPerson.first_name : 'this person'}?`,
      'Would you also like to block and report this person?',
      [
        {
          text: 'Block',
          onPress: () => this.block(otherPerson, data),
        },
        {
          text: 'Block and Report',
          onPress: () => {
            if (Platform.OS === 'android') {
              Navigation.showModal({
                screen: 'voke.AndroidReportModal',
                animationType: 'none',
                passProps: {
                  onSubmitReport: (text) => this.handleSubmitReport(text, otherPerson, data),
                  onCancelReport: () => LOG('report canceled'),
                },
                navigatorStyle: {
                  screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              });
            } else {
              AlertIOS.prompt(
                'Please describe why you are reporting this person',
                null,
                (text) => this.handleSubmitReport(text, otherPerson, data)
              );
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => LOG('Canceled Block'),
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    const cLength = this.props.conversations.length;

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            <HeaderIcon image={vokeIcons['menu']} onPress={this.handleMenuPress} />
          }
          right={
            CONSTANTS.IS_ANDROID ? (
              <Text>SHOW MENU</Text>
            ) : null
          }
          title="Chats"
        />
        {
          cLength ? (
            <ConversationList
              items={this.props.conversations}
              me={this.props.me}
              onRefresh={this.handleRefresh}
              onDelete={this.handleDelete}
              onBlock={this.handleBlock}
              onLoadMore={this.handleLoadMore}
              onSelect={(c) => this.props.navigatePush('voke.Message', {conversation: c})}
              refreshing={this.state.refreshing}
            />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center'} }
              refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
              />}
            >
              <Flex value={1} align="center" justify="center">
                <Image style={{ marginBottom: 20 }} source={NULL_STATE} />
                <Text>Find a video and share it with a friend</Text>
              </Flex>
            </ScrollView>
          )
        }
        {
          (cLength <= CONTACT_LENGTH_SHOW_VOKEBOT && cLength > 0) ?  (
            <Image style={styles.vokeBot} source={VOKE} />
          ) : null
        }
        {
          // <TabBarIndicator index={0} />
        }
        {
          cLength === 0 || this.state.isLoading ? <ApiLoading /> : null
        }
      </View>
    );
  }
}


// Check out actions/nav.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
  onMount: PropTypes.func,
  conversations: PropTypes.array.isRequired, // Redux
  me: PropTypes.object.isRequired, // Redux
  unReadBadgeCount: PropTypes.number.isRequired, // Redux
  pagination: PropTypes.object.isRequired, // Redux
};

const mapStateToProps = ({ messages, auth }) => {
  return {
    conversations: messages.conversations,
    me: auth.user,
    unReadBadgeCount: messages.unReadBadgeCount,
    pagination: messages.pagination.conversations,
    isTabSelected: auth.homeTabSelected === 0,
  };
};

export default connect(mapStateToProps, nav)(Home);
