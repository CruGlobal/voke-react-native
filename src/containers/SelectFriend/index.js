import React, { Component } from 'react';
import {
  Platform,
  View,
  Image,
  Keyboard,
  ScrollView,
  Share,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getContacts } from '../../actions/contacts';
import { openSettingsAction } from '../../actions/auth';
import {
  createConversation,
  getConversation,
  deleteConversation,
} from '../../actions/messages';
import Analytics from '../../utils/analytics';
import { SHOW_SHARE_MODAL } from '../../constants';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';
import theme from '../../theme';
import VOKE_BOT from '../../../images/voke_bot_face_large.png';
import ApiLoading from '../ApiLoading';
import ShareModal from '../ShareModal';
import Modal from '../Modal';
import Header from '../Header';
import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import Permissions from '../../utils/permissions';
import SelectNumber from '../../components/SelectNumber';

const NUM_RANDOM = 3;
function getRandomContacts(contacts) {
  const length = contacts.length;
  if (length < NUM_RANDOM) return contacts;
  let randomArray = [];
  for (let i = 0; i < NUM_RANDOM; i++) {
    let random;
    do {
      random = Math.floor(Math.random() * length);
    } while (randomArray.indexOf(random) != -1);
    randomArray.push(random);
  }
  return [
    contacts[randomArray[0]],
    contacts[randomArray[1]],
    contacts[randomArray[2]],
  ];
}

const screenHeight = theme.fullHeight;

class SelectFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      setLoaderBeforePush: false,
      random: [],
      permission: '',
      loadingBeforeShareSheet: false,
      showPermissionModal: false,
      selectNumberContact: null,
    };

    this.goToContacts = this.goToContacts.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.handleCheckPermission = this.handleCheckPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.handleAllowContacts = this.handleAllowContacts.bind(this);
  }

  componentDidMount() {
    // We need to give the transition enough time before the view locks from the modal
    setTimeout(() => {
      this.checkContactsStatus();
    }, 1000);
    Analytics.screen(Analytics.s.SelectFriend);
  }

  componentWillUnmount() {
    this.props.dispatch({ type: SHOW_SHARE_MODAL, bool: false });
  }

  goToContacts() {
    this.props.navigatePush(
      'voke.Contacts',
      {
        onSelect: this.selectContact,
        video: this.props.video,
      },
      { overrideBackPress: true },
    );
  }

  handleGetContacts() {
    return this.props
      .dispatch(getContacts())
      .then(() => {
        this.setState({
          isLoading: false,
          random: getRandomContacts(this.props.all),
          permission: Permissions.AUTHORIZED,
        });
      })
      .catch(() => {
        this.setState({ isLoading: false, permission: Permissions.DENIED });
        LOG('contacts caught in handle get contacts');
        //change screen
      });
  }

  handleDismissPermission() {
    this.setState({ isLoading: false });
    // permission not asked yet
  }

  handleCheckPermission(permission) {
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      this.setState({ showPermissionModal: true });
    } else {
      this.setState({ isLoading: false });
      // Change screen
    }
  }

  checkContactsStatus() {
    // On older android devices, don't even do the prompts
    if (theme.isAndroid && Platform.Version < 23) {
      this.handleGetContacts();
    } else {
      Permissions.checkContacts().then(this.handleCheckPermission);
    }
  }

  handleAllowContacts() {
    if (theme.isAndroid) {
      this.handleGetContacts();
    } else if (this.state.permission === Permissions.DENIED) {
      // On iOS, open settings
      this.props.dispatch(openSettingsAction());
    } else {
      this.checkContactsStatus();
    }
  }

  shareDialog = (url, conversation) => {
    const { t } = this.props;
    Share.share(
      {
        message: url,
        tintColor: '#fff',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.PostToTwitter',
        ],
      },
      {
        dialogTitle: t('share'),
      },
    )
      .then(({ action, activityType }) => {
        if (action === Share.sharedAction) {
          LOG('shared!', activityType);
          // Navigate to the new conversation after sharing
          this.props.navigateResetMessage({
            conversation,
          });
        } else {
          LOG('not shared!');
          // Delete the conversation
          this.props.dispatch(deleteConversation(conversation.id));
        }
      })
      .catch(err => {
        LOG('Share Error', err);
      });
  };

  selectContact(c, index = 0) {
    if (!c) return;
    this.setState({ selectNumberContact: null });
    Keyboard.dismiss();

    // LOG(JSON.stringify(c));

    let phoneNumber = c.phone ? c.phone[index] : null;
    let name = c.name ? c.name.split(' ') : null;
    let firstName = name[0] ? name[0] : 'Friend';
    let lastName = name[name.length - 1] ? name[name.length - 1] : 'Buddy';
    // let email = c.emailAddresses ? c.emailAddresses[0].email : null;

    let videoId = this.props.video;

    const createData = {
      conversation: {
        messengers_attributes: [
          {
            first_name: `${firstName}`,
            last_name: `${lastName}`,
            mobile: `${phoneNumber}`,
          },
        ],
        item_id: `${videoId}`,
      },
    };
    if (c.isVoke) {
      // LOG('voke contact selected', this.props.video);
      this.props.dispatch(createConversation(createData)).then(results => {
        // LOG('create voke conversation results', results);
        this.props.dispatch(getConversation(results.id)).then(c => {
          // LOG('get voke conversation results', c);
          this.props.navigateResetMessage({ conversation: c.conversation });
        });
      });
    } else {
      // LOG('normal contact selected', this.props.video);
      // Set this up so background stuff doesn't try to do too much while in the share modal
      // this.setState({ loadingBeforeShareSheet: true });
      // this.props.dispatch({ type: SET_IN_SHARE, bool: true });
      // Create the conversation
      this.props.dispatch(createConversation(createData)).then(results => {
        this.props.dispatch(getConversation(results.id)).then(c => {
          LOG('get voke conversation results', c);
          const friend = results.messengers[0];
          this.shareDialog(friend.url, c.conversation);

          // Show the share modal
          // this.props.dispatch({
          //   type: SHOW_SHARE_MODAL,
          //   bool: true,
          //   props: {
          //     onComplete: () => {
          //       // Set these to false so we're not in the share modal anymore
          //       this.props.dispatch({ type: SHOW_SHARE_MODAL, bool: false });
          //       this.props.dispatch({ type: SET_IN_SHARE, bool: false });
          //
          //       // On android, put a timeout because the share stuff gets messed up otherwise
          //       if (theme.isAndroid) {
          //         this.setState({ setLoaderBeforePush: true });
          //         setTimeout(() => {
          //           this.setState({ setLoaderBeforePush: false });
          //           this.props.navigateResetMessage({
          //             conversation: c.conversation,
          //           });
          //         }, 50);
          //       } else {
          //         this.props.navigateResetMessage({
          //           conversation: c.conversation,
          //         });
          //       }
          //     },
          //     // This could also be called on the contacts page to cancel the share modal
          //     onCancel: () => {
          //       LOG('canceling sharing');
          //
          //       // Set these to false and delete the conversation
          //       this.props.dispatch({ type: SHOW_SHARE_MODAL, bool: false });
          //       this.props.dispatch({ type: SET_IN_SHARE, bool: false });
          //       this.props.dispatch(deleteConversation(results.id));
          //     },
          //     friend,
          //     phoneNumber,
          //   },
          // });
          // this.setState({ loadingBeforeShareSheet: false });
        });
      });
    }
  }

  handleSelectContact = c => {
    if (!c.isVoke && c.phone.length > 1) {
      this.setState({ selectNumberContact: c });
    } else {
      this.selectContact(c);
    }
  };

  renderRandomContacts() {
    let randomHeight = {};
    if (screenHeight < 450) {
      randomHeight = { height: 30 };
    }
    return this.state.random.map((c, i) => (
      <Button
        key={`random_${i}`}
        onPress={() => this.handleSelectContact(c)}
        text={c ? c.name : ' '}
        style={[styles.randomButton, randomHeight]}
        buttonTextStyle={styles.randomText}
      />
    ));
  }

  renderContent() {
    const { t } = this.props;
    let randomHeight = {};
    const isAuthorized = this.state.permission === Permissions.AUTHORIZED;
    if (screenHeight < 450) {
      randomHeight = { height: 30 };
    }

    const isLoading =
      this.props.isLoading ||
      this.state.setLoaderBeforePush ||
      this.state.loadingBeforeShareSheet;

    let vokeText = t('loading.selectFriend');
    if (this.state.random.length === 0 && isAuthorized && !isLoading) {
      vokeText = t('empty.contacts');
    } else if (!isAuthorized && !isLoading) {
      vokeText = t('loading.allowContact');
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignSelf: 'stretch' }}
      >
        <StatusBar hidden={false} />
        <Flex align="center">
          <Flex justify="center" value={0.8}>
            <Text style={styles.header}>{t('title.selectAFriend')}</Text>
          </Flex>
          <Flex value={0.5}>
            {isAuthorized ? (
              <Button
                onPress={this.goToContacts}
                text={t('searchContacts')}
                style={[styles.randomButton, randomHeight]}
                buttonTextStyle={styles.randomText}
              />
            ) : null}
          </Flex>
        </Flex>
        <Flex
          value={1}
          align="center"
          justify="center"
          style={styles.vokeBubbleImageWrap}
        >
          <Flex
            self="center"
            align="center"
            justify="center"
            value={1}
            style={styles.vokeBubble}
          >
            <Text style={styles.info}>{vokeText}</Text>
          </Flex>
          <Flex style={styles.imageWrap} align="end" justify="end">
            <Image
              resizeMode="contain"
              source={VOKE_BOT}
              style={styles.vokeBot}
            />
          </Flex>
        </Flex>
        <Flex value={1} align="center">
          {!isAuthorized && !isLoading ? (
            <Button
              onPress={this.handleAllowContacts}
              text={t('allowContacts')}
              style={[styles.randomButton, randomHeight]}
              buttonTextStyle={styles.randomText}
            />
          ) : null}
          <Flex justify="start" align="center" value={2}>
            {this.renderRandomContacts()}
          </Flex>
        </Flex>
      </ScrollView>
    );
  }

  render() {
    const { t, isLoading } = this.props;
    const {
      setLoaderBeforePush,
      loadingBeforeShareSheet,
      showPermissionModal,
      selectNumberContact,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar />
        <Header leftBack={true} title={t('title.selectFriend')} />
        {this.renderContent()}
        {isLoading || setLoaderBeforePush || loadingBeforeShareSheet ? (
          <ApiLoading
            force={true}
            text={
              setLoaderBeforePush || loadingBeforeShareSheet
                ? ''
                : t('loading.contacts')
            }
          />
        ) : null}
        <ShareModal />
        {showPermissionModal ? (
          <Modal
            onClose={() => this.setState({ showPermissionModal: false })}
            getContacts={this.handleGetContacts}
            onDismiss={this.handleDismissPermission}
          />
        ) : null}
        {selectNumberContact ? (
          <SelectNumber
            contact={selectNumberContact}
            onSelect={this.selectContact}
            onCancel={() => this.setState({ selectNumberContact: null })}
          />
        ) : null}
      </View>
    );
  }
}

// Check out actions/nav.js to see the prop types and mapDispatchToProps
SelectFriend.propTypes = {
  ...NavPropTypes,
  video: PropTypes.string.isRequired,
  all: PropTypes.array.isRequired, // Redux
  isLoading: PropTypes.bool, // Redux
  isLandscape: PropTypes.bool,
};

const mapStateToProps = ({ contacts }, { navigation }) => ({
  ...(navigation.state.params || {}),
  all: contacts.all,
  isLoading: contacts.isLoading,
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(SelectFriend),
);
