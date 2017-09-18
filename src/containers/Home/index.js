import React, { Component } from 'react';
import { View, Platform, Image, Alert, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { startupAction, cleanupAction, blockMessenger, reportUserAction } from '../../actions/auth';
import  Analytics from '../../utils/analytics';

import { getConversations, deleteConversation, getConversationsPage } from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import theme from '../../theme';
import ConversationList from '../../components/ConversationList';
import { Flex, Text } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import NULL_STATE from '../../../images/video-button.png';
import VOKE from '../../../images/voke_null_state.png';

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
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.secondaryColor,
    screenBackgroundColor: theme.primaryColor,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTabBadge({
      tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
      badge: this.props.unReadBadgeCount > 0 ? this.props.unReadBadgeCount : null, // badge value, null to remove badge
    });
  }

  componentDidMount() {
    this.props.dispatch(startupAction(this.props.navigator));
    Analytics.screen('Home Chats');
    this.props.dispatch(getConversations());    
  }

  componentWillReceiveProps(nextProps) {
    const nextCount = nextProps.unReadBadgeCount;
    const currentCount = this.props.unReadBadgeCount;
    if (nextCount != currentCount) {
      this.props.navigator.setTabBadge({
        // tabIndex: 0, // (optional) if missing, the badge will be added to this screen's tab
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
  }

  handleLoadMore() {
    if (this.props.pagination.hasMore) {
      // LOG('has more conversations to load');
      this.props.dispatch(getConversationsPage(this.props.pagination.page + 1));      
    }
  }

  handleRefresh() {
    return this.props.dispatch(getConversations());
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
      'Are you sure you want to block',
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
    // const cLength = 2;

    return (
      <View style={styles.container}>
        <StatusBar />
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
            />
          ) : (
            <Flex value={1} align="center" justify="center">
              <Image style={{ marginBottom: 20 }} source={NULL_STATE} />
              <Text>Find a video and share it with a friend</Text>
            </Flex>
          )
        }
        {
          (cLength <= 3 && cLength > 0) ?  (
            <Image style={styles.vokeBot} source={VOKE} />
          ) : null
        }
        <Flex direction="row">
          <Flex value={1} style={styles.selectedTab}></Flex>
          <Flex value={1} style={styles.unSelectedTab}></Flex>
        </Flex>
        {
          cLength === 0 || this.state.isLoading ? <ApiLoading /> : null
        }
      </View>
    );
    // <FloatingButton onSelect={(to) => this.props.navigatePush(to)} />
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
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
  };
};

export default connect(mapStateToProps, nav)(Home);
