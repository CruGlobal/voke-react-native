import React, { Component } from 'react';
import { View, Image, Share } from 'react-native';
import { connect } from 'react-redux';
import { getContacts } from '../../actions/contacts';
import { createConversation, getConversation } from '../../actions/messages';
import PropTypes from 'prop-types';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import VOKE_BOT from '../../../images/voke_bot_face_large.png';

import { Flex, Text, Loading, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

const NUM_RANDOM = 3;
function getRandom(contacts) {
  const length = contacts.length;
  if (length < NUM_RANDOM) return contacts;
  let randomArray = [];
  for (let i = 0; i < NUM_RANDOM; i++) {
    let random;
    do {
      random = Math.floor( Math.random() * length);
    } while (randomArray.indexOf(random) != -1);
    randomArray.push(random);
  }
  return [
    contacts[randomArray[0]],
    contacts[randomArray[1]],
    contacts[randomArray[2]],
  ];
}

class SelectFriend extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      random: [],
    };

    this.selectContact = this.selectContact.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 500);
    if (this.props.all && this.props.all.length > 0) {
      this.setState({ random: getRandom(this.props.all) });
    } else {
      LOG('dispatched');
      this.props.dispatch(getContacts()).then(() => {
        this.setState({ random: getRandom(this.props.all) });
      }).catch(()=> {LOG('caught');});
    }
  }

  selectContact(c) {
    if (!c) return;
    LOG(JSON.stringify(c));
    let phoneNumber = c.phone ? c.phone[0] : null;
    let name = c.name ? c.name.split(' ') : null;
    let firstName = name[0] ? name[0] : 'Friend';
    let lastName = name[name.length -1] ? name[name.length -1] : 'Buddy';
    let email = c.emailAddresses ? c.emailAddresses[0].email : null;

    let videoId = this.props.video;

    if (c.isVoke) {
      LOG('voke contact selected', this.props.video);
    } else {
      LOG('normal contact selected', this.props.video);
      let data = {
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
      this.props.dispatch(createConversation(data)).then((results)=>{
        Share.share({
          message: `Hi ${c.name}, check out this video ${results.messengers[0].url} `,
          title: 'Check this out',
        }).then((results1)=> {
          if (results1.action === 'sharedAction') {
            LOG('successfuly shared video');
            this.props.dispatch(getConversation(results.id)).then((c)=> {
              this.props.navigatePush('voke.Message', {conversation: c});
            });
          } else {
            LOG('Did Not Share Video');
            //TODO Make api call to delete conversation that was not shared
          }
        });
      });
    }
  }

  renderRandomContacts() {
    let arr = [];
    const isRandomSet = this.state.random.length > 0;
    for (let i=0; i<NUM_RANDOM; i++) {
      const contact = isRandomSet ? this.state.random[i] || null : null;
      arr.push((
        <Button
          key={`random_${i}`}
          onPress={() => this.selectContact(contact)}
          text={contact ? contact.name : ' '}
          style={styles.randomButton}
          buttonTextStyle={styles.randomText}
        />
      ));
    }
    return arr;
  }

  renderContent() {
    if (this.state.isLoading)  {
      return (
        <Flex justify="center" value={1}>
          <Loading />
        </Flex>
      );
    }
    return (
      <Flex style={styles.container} direction="column" align="center" justify="center">
        <StatusBar hidden={false} />
        <Flex justify="center" value={1}>
          <Text style={styles.header}>
            Select a Friend
          </Text>
        </Flex>
        <Flex value={.5}>
          <Button
            onPress={() => this.props.navigatePush('voke.Contacts', {
              onSelect: this.selectContact,
              video: this.props.video,
            })}
            text="Search Contacts"
            style={styles.randomButton}
            buttonTextStyle={styles.randomText}
          />
        </Flex>
        <Flex align="center" justify="center" value={.7} style={styles.vokeBubble}>
          <Text style={styles.info}>
            Search your contacts or take a step of faith with...
          </Text>
        </Flex>
        <Flex style={styles.imageWrap} value={.5} align="end" justify="end" >
          <Image resizeMode="contain" source={VOKE_BOT} style={styles.vokeBot} />
        </Flex>
        <Flex justify="start" align="center" value={2}>
          { this.renderRandomContacts() }
        </Flex>
      </Flex>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        {this.renderContent()}
      </View>
    );
  }
}

//OR SEPARATOR
// <Flex direction="row" align="center" justify="center" style={styles.orSeparatorWrapper}>
//   <Flex value={2} style={styles.orSeparator} />
//   <Flex value={.5} align="center">
//     <Text style={styles.orText}>OR</Text>
//   </Flex>
//   <Flex value={2} style={styles.orSeparator} />
// </Flex>

// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
SelectFriend.propTypes = {
  ...NavPropTypes,
  video: PropTypes.string.isRequired,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(SelectFriend);
