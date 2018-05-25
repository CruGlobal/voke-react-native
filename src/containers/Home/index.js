import React, { Component } from 'react';
import { View, ScrollView, Image, Alert, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import { startupAction, blockMessenger, reportUserAction, getMe } from '../../actions/auth';
import { checkAndRunSockets } from '../../actions/socket';
import  Analytics from '../../utils/analytics';

import { getConversations, deleteConversation, getConversationsPage } from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

import ApiLoading from '../ApiLoading';
import VokeOverlays from '../VokeOverlays';
import AndroidReportModal from '../AndroidReportModal';
import ConversationList from '../../components/ConversationList';
import PopupMenu from '../../components/PopupMenu';
import Header, { HeaderIcon } from '../Header';
import { Flex, Text, RefreshControl } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import VOKE from '../../../images/voke_null_state.png';
import { IS_SMALL_ANDROID } from '../../constants';
import theme from '../../theme';

const CONTACT_LENGTH_SHOW_VOKEBOT = IS_SMALL_ANDROID ? 2 : 3;

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      isLoading: false,
      showAndroidReportModal: false,
      androidReportPerson: null,
      androidReportData: null,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
  }

  componentDidMount() {
    const { isAnonUser, conversations, navigation, dispatch } = this.props;

    if (isAnonUser && conversations.length <= 1) {
      // Only navigate to videos if we're not coming from a 'navigateResetMessage'
      if (!(navigation && navigation.state && navigation.state.params && navigation.state.params.navThrough === true)) {
        navigation.navigate('voke.Videos');
      }
    }

    Analytics.screen('Home Chats');

    dispatch(getConversations());

    // This should fix the case for new users signing up not having the auth user
    if (conversations.length === 0) {
      dispatch(getMe());
    }

    setTimeout(() => {
      dispatch(startupAction());
    }, 50);
  }

  handleMenuPress() {
    this.props.navigatePush('voke.Menu');
  }

  handleLoadMore() {
    if (this.state.loadingMore || this.state.refreshing) return;
    if (this.props.pagination.hasMore) {
      // LOG('has more conversations to load');
      this.setState({ loadingMore: true, refreshing: true });
      this.props.dispatch(getConversationsPage(this.props.pagination.page + 1)).then(() => {
        this.setState({ loadingMore: false, refreshing: false });
      }).catch(() => {
        this.setState({ loadingMore: false, refreshing: false });
      });
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

  handleSubmitReport(text) {
    const otherPerson = this.state.androidReportPerson;
    const data = this.state.androidReportData;

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
            if (theme.isAndroid) {
              this.setState({
                showAndroidReportModal: true,
                androidReportPerson: otherPerson,
                androidReportData: data,
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
    const { conversations, activeConversationId, me, pagination, unreadCount } = this.props;
    const cLength = conversations.length;

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? undefined : (
              <HeaderIcon image={vokeIcons['menu']} onPress={this.handleMenuPress} />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu
                actions={navMenuOptions(this.props)}
              />
            ) : null
          }
          title="Chats"
        />
        {
          cLength ? (
            <ConversationList
              items={conversations}
              me={me}
              onRefresh={this.handleRefresh}
              onDelete={this.handleDelete}
              unreadCount={unreadCount}
              onBlock={this.handleBlock}
              hasMore={pagination.hasMore}
              onLoadMore={this.handleLoadMore}
              isLoading={this.state.loadingMore}
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
                <Image style={{ marginBottom: 20, height: 100 }} resizeMode="contain" source={ANIMATION} />
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
          cLength === 0 || this.state.isLoading ? <ApiLoading /> : null
        }
        {
          this.state.showAndroidReportModal ? (
            <AndroidReportModal
              onClose={() => this.setState({
                showAndroidReportModal: false,
                androidReportPerson: null,
                androidReportData: null,
              })}
              onSubmitReport={this.handleSubmitReport}
              onCancelReport={() => LOG('report canceled')}
            />
          ) : null
        }
        {
          // Only show this overlay when you are not on the messages screen also
          // It was getting a weird double overlay when transitioning to the messages screen
          !activeConversationId ? <VokeOverlays type="pushPermissions" /> : null
        }
      </View>
    );
  }
}

// Check out actions/nav.js to see the prop types and mapDispatchToProps
Home.propTypes = {
  ...NavPropTypes,
  conversations: PropTypes.array.isRequired, // Redux
  me: PropTypes.object.isRequired, // Redux
  pagination: PropTypes.object.isRequired, // Redux
  navThrough: PropTypes.bool,
};

const mapStateToProps = ({ messages, auth }) => ({
  conversations: messages.conversations,
  me: auth.user,
  pagination: messages.pagination.conversations,
  unreadCount: messages.unReadBadgeCount,
  isAnonUser: auth.isAnonUser,
  activeConversationId: messages.activeConversationId,
});

export default connect(mapStateToProps, nav)(Home);
