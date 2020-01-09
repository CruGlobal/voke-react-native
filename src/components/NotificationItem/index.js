import React, { PureComponent } from 'react';
import { Image, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import i18n from '../../i18n';
import styles from './styles';
import { Flex, Text, Icon, Avatar, DateComponent, Touchable } from '../common';
import { momentUtc } from '../../utils/common';
import TO_CHAT from '../../../images/newShare.png';
import VOKE_AVATAR from '../../../images/voke_avatar_small.png';
import Analytics from '../../utils/analytics';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: '',
    };
  }

  shareVideo = () => {
    if (this.props.item && this.props.item.item && this.props.onShareVideo) {
      this.props.onShareVideo(this.props.item.item);
    }
  };

  renderText() {
    const message = this.props.item;

    if (!message || !message.content) return null;
    return (
      <Flex
        style={[styles.row, styles.otherPerson]}
        direction="row"
        align="center"
        justify="start"
      >
        <Text selectable={true} style={[styles.message, styles.otherText]}>
          {message.content}
        </Text>
      </Flex>
    );
  }

  renderVideoImage(style) {
    const thumbnail =
      ((((this.props.item || {}).item || {}).media || {}).thumbnails || {})
        .large || undefined;
    return (
      <Touchable
        isAndroidOpacity={true}
        activeOpacity={0.7}
        onPress={this.props.onSelectVideo}
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: thumbnail }}
          style={style}
        >
          <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
        </ImageBackground>
      </Touchable>
    );
  }

  renderVideoAndText() {
    const message = this.props.item;
    if (!message || !message.content) return null;

    return (
      <Flex direction="column">
        <Flex value={1} direction="row" align="center" justify="start">
          {this.renderVideoImage([styles.video, styles.otherPersonVideo])}
          {this.renderShareVideo()}
        </Flex>
        <Flex
          style={[styles.row, styles.otherPerson]}
          direction="row"
          align="center"
          justify="start"
        >
          <Text selectable={true} style={[styles.message, styles.otherText]}>
            {message.content}
          </Text>
        </Flex>
      </Flex>
    );
  }

  renderShareVideo() {
    const SIZE = 55;
    return (
      <Touchable
        isAndroidOpacity={true}
        onPress={this.shareVideo}
        activeOpacity={0.6}
        style={[styles.shareCircleButton]}
      >
        <Image
          resizeMode="cover"
          source={TO_CHAT}
          style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
        />
      </Touchable>
    );
  }

  renderVideo() {
    const message = this.props.item;
    if (!message) return null;
    return (
      <Flex value={1} direction="row" align="center" justify={'start'}>
        {this.renderVideoImage([styles.video, styles.meVideo])}
        {this.renderShareVideo()}
      </Flex>
    );
  }

  renderAvatar() {
    return (
      <Avatar size={28} image={VOKE_AVATAR} isVoke={true} isLocal={true} />
    );
  }

  render() {
    const message = this.props.item;
    const isVideo = message.item && message.kind !== 'question';
    const isVideoAndText =
      message.item && message.content && message.kind !== 'question';
    const time = message.created_at;
    const momentTime = momentUtc(time)
      .local()
      .format('LL');
    const momentNow = moment()
      .local()
      .format('LL');
    const separatorTime =
      momentTime === momentNow ? i18n.t('today') : momentTime;
    if (message.kind === 'answer') return null;
    let content;
    if (isVideoAndText) {
      content = this.renderVideoAndText();
    } else if (isVideo) {
      content = this.renderVideo();
    } else {
      content = this.renderText();
    }

    return (
      <Flex
        direction="column"
        style={{ margin: 6 }}
        animation="fadeIn"
        align={'start'}
        ref={x => Analytics.markSensitive(x)}
      >
        {this.props.item.isLatestForDay ? (
          <Flex align="center" justify="center" style={styles.dateSeparator}>
            <Text style={styles.timeText}>{separatorTime}</Text>
          </Flex>
        ) : null}
        <Flex direction="row" style={{ marginHorizontal: 5 }}>
          <Flex self="end" style={styles.avatar}>
            {this.renderAvatar()}
          </Flex>
          <Flex self="end" style={[styles.triangle, styles.otherTriangle]} />
          {content}
          <Flex
            self="end"
            style={[styles.triangle, !isVideo ? styles.vokeTriangle : null]}
          />
        </Flex>
        <Flex
          align={'end'}
          justify="start"
          style={[styles.time, styles.meTime]}
        >
          <DateComponent
            style={styles.timeText}
            date={message.created_at}
            format="h:mm A"
          />
        </Flex>
      </Flex>
    );
  }
}

NotificationItem.propTypes = {
  item: PropTypes.object.isRequired,
  user: PropTypes.object,
  messengers: PropTypes.array,
  onSelectVideo: PropTypes.func,
  onShareVideo: PropTypes.func,
  onSendAnswer: PropTypes.func,
  relevanceHasBeenAswered: PropTypes.bool,
};

export default NotificationItem;
