import React, { Component } from 'react';
import { View, ScrollView, Image, Alert, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import {
  startupAction,
  blockMessenger,
  reportUserAction,
  getMe,
  dontNavigateToVideos,
} from '../../actions/auth';
import Analytics from '../../utils/analytics';
import i18n from '../../i18n';

import {
  getConversations,
  deleteConversation,
  getConversationsPage,
} from '../../actions/messages';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

import ApiLoading from '../ApiLoading';
import AndroidReportModal from '../AndroidReportModal';
import ConversationList from '../../components/ConversationList';
import PopupMenu from '../../components/PopupMenu';
import Header, { HeaderIcon } from '../Header';
import { Flex, Text, RefreshControl, Touchable } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import { IS_SMALL_ANDROID } from '../../constants';
import theme from '../../theme';
import VOKE_LINK from '../../../images/vokebot_whole.png';

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
      callingGetConversations: true,
      showLanguageSelect: true,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
  }

  componentDidMount() {
    const {
      isAnonUser,
      conversations,
      navigation,
      dispatch,
      me,
      dontNavigateToVideos,
    } = this.props;

    if (isAnonUser && conversations.length <= 1) {
      // Only navigate to videos if we're not coming from a 'navigateResetMessage'
      if (
        !(
          navigation &&
          navigation.state &&
          navigation.state.params &&
          navigation.state.params.navThrough === true
        ) &&
        !dontNavigateToVideos
      ) {
        navigation.navigate('voke.Videos');
      }
    }
    if (me && me.language && me.language.language_code) {
      i18n.changeLanguage(me.language.language_code.toLowerCase());
    }

    Analytics.screen(Analytics.s.ChatTab);

    this.getConversations();

    // This should fix the case for new users signing up not having the auth user
    if (conversations.length === 0) {
      dispatch(getMe());
    }

    this.startupTimeout = setTimeout(() => {
      dispatch(startupAction());
    }, 50);

    // Check if getConversations has been called yet, call it again if there are 0 conversations
    this.checkTimeout = setTimeout(this.checkConversations, 6 * 1000);
    this.checkTimeout2 = setTimeout(this.checkConversations, 12 * 1000);
  }

  componentWillUnmount() {
    console.log('unmounting');
    this.props.dispatch(dontNavigateToVideos());
    clearTimeout(this.startupTimeout);
    clearTimeout(this.checkTimeout);
    clearTimeout(this.checkTimeout2);
  }

  checkConversations = () => {
    if (this.state.callingGetConversations) return;
    const { conversations } = this.props;
    // Only call it again if there are no conversations
    if (conversations.length === 0) {
      this.getConversations();
    }
    // If the first conversation does not have a preview, call getConversations again
    if (conversations[0] && !conversations[0].messagePreview) {
      this.getConversations();
    }
  };

  getConversations = () => {
    this.setState({ callingGetConversations: true });
    this.props
      .dispatch(getConversations())
      .then(() => this.setState({ callingGetConversations: false }))
      .catch(() => this.setState({ callingGetConversations: false }));
  };

  handleMenuPress() {
    this.props.navigatePush('voke.Menu');
  }

  handleLoadMore() {
    if (this.state.loadingMore || this.state.refreshing) return;
    if (this.props.pagination.hasMore) {
      // LOG('has more conversations to load');
      this.setState({ loadingMore: true });
      this.props
        .dispatch(getConversationsPage(this.props.pagination.page + 1))
        .then(() => {
          this.setState({ loadingMore: false });
        })
        .catch(() => {
          this.setState({ loadingMore: false });
        });
    }
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    this.props
      .dispatch(getConversations())
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  }

  handleDelete(data) {
    this.setState({ isLoading: true });
    this.props
      .dispatch(deleteConversation(data.id))
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  block(otherPerson, data) {
    this.setState({ isLoading: true });
    this.props
      .dispatch(blockMessenger(otherPerson.id))
      .then(() => {
        this.handleDelete(data);
        this.setState({ isLoading: false });
      })
      .catch(() => {
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
    const { t } = this.props;
    Alert.alert(
      t('areYouSureBlock', { name: otherPerson.first_name || t('thisPerson') }),
      t('questionBlock'),
      [
        {
          text: t('block'),
          onPress: () => this.block(otherPerson, data),
        },
        {
          text: t('blockReport'),
          onPress: () => {
            if (theme.isAndroid) {
              this.setState({
                showAndroidReportModal: true,
                androidReportPerson: otherPerson,
                androidReportData: data,
              });
            } else {
              AlertIOS.prompt(t('why'), null, text =>
                this.handleSubmitReport(text, otherPerson, data),
              );
            }
          },
        },
        {
          text: t('cancel'),
          onPress: () => LOG('Canceled Block'),
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    const { t, conversations, me, pagination, unreadCount } = this.props;
    const cLength = conversations.length;

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? (
              undefined
            ) : (
              <HeaderIcon
                image={vokeIcons['menu']}
                onPress={this.handleMenuPress}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu actions={navMenuOptions(this.props)} />
            ) : null
          }
          title={t('title.chats')}
        />
        {cLength ? (
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
            onSelect={c =>
              this.props.navigatePush('voke.Message', { conversation: c })
            }
            refreshing={this.state.refreshing}
          />
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
              />
            }
          >
            <Flex value={1} align="center" justify="center">
              <Image
                style={{ marginBottom: 20, height: 100 }}
                resizeMode="contain"
                source={ANIMATION}
              />
              <Text style={{ textAlign: 'center', paddingHorizontal: 30 }}>
                {t('findAndShare')}
              </Text>
            </Flex>
          </ScrollView>
        )}
        {cLength <= CONTACT_LENGTH_SHOW_VOKEBOT && cLength > 0 ? (
          <Flex style={styles.vokebotWrap}>
            <Flex style={styles.chatBubble}>
              <Text style={styles.chatText}>{t('nullText')}</Text>
            </Flex>
            <Flex style={styles.chatTriangle} />
            <Image
              resizeMode="contain"
              source={VOKE_LINK}
              style={styles.vokebot}
            />
          </Flex>
        ) : null}
        {cLength === 0 || this.state.isLoading ? <ApiLoading /> : null}
        {this.state.showAndroidReportModal ? (
          <AndroidReportModal
            onClose={() =>
              this.setState({
                showAndroidReportModal: false,
                androidReportPerson: null,
                androidReportData: null,
              })
            }
            onSubmitReport={this.handleSubmitReport}
            onCancelReport={() => LOG('report canceled')}
          />
        ) : null}
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
  dontNavigateToVideos: auth.dontNavigateToVideos,
});

export default translate('home')(
  connect(
    mapStateToProps,
    nav,
  )(Home),
);
