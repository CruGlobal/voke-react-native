import React, { Component } from 'react';
import { View, ScrollView, Platform, Image, Alert, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TAB_SELECTED } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import { startupAction, cleanupAction, blockMessenger, reportUserAction } from '../../actions/auth';
import { checkAndRunSockets } from '../../actions/socket';
import  Analytics from '../../utils/analytics';

import { getConversations, deleteConversation, getConversationsPage } from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import AndroidReportModal from '../AndroidReportModal';
import ConversationList from '../../components/ConversationList';
import PopupMenu from '../../components/PopupMenu';
// import TabBarIndicator from '../../components/TabBarIndicator';
import Header, { HeaderIcon } from '../Header';
import { Flex, Text, RefreshControl } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import NULL_STATE from '../../../images/video-button.png';
import VOKE from '../../../images/voke_null_state.png';
import CONSTANTS, { IS_SMALL_ANDROID } from '../../constants';

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
    Analytics.screen('Home Chats');

    this.props.dispatch(getConversations()).catch((err)=> {
      if (err.error === 'Messenger not configured') {
        // Do this because the api can be slow when a user creates an account and our app is faster than the api
        setTimeout(() => {
          this.props.dispatch(getConversations()).catch((err)=> {
            if (err.error === 'Messenger not configured') {
              this.props.navigateResetToNumber();
            }
          });
        }, 3000);
      }
    });

    this.props.dispatch({ type: TAB_SELECTED, tab: 0 });
    setTimeout(() => {
      this.props.dispatch(startupAction());
      this.props.dispatch(checkAndRunSockets());
    }, 50);
  }

  componentWillUnmount() {
    // this.props.dispatch(cleanupAction());
  }

  onNavigatorEvent(event) {
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
            if (Platform.OS === 'android') {
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
    const cLength = this.props.conversations.length;


    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            CONSTANTS.IS_ANDROID ? undefined : (
              <HeaderIcon image={vokeIcons['menu']} onPress={this.handleMenuPress} />
            )
          }
          right={
            CONSTANTS.IS_ANDROID ? (
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
};

const mapStateToProps = ({ messages, auth }) => {
  return {
    conversations: messages.conversations,
    me: auth.user,
    pagination: messages.pagination.conversations,
    isTabSelected: auth.homeTabSelected === 0,
  };
};

export default connect(mapStateToProps, nav)(Home);
