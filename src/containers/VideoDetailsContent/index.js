import React, { Component, Fragment } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { navigatePush } from '../../actions/nav';
import { favoriteVideo, unfavoriteVideo } from '../../actions/videos';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import { shareVideo } from '../../actions/auth';

class VideoDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavorite: props.video ? props.video['favorite?'] : false,
    };
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.VideoDetails);
  }

  handleFavorite = () => {
    const { video, dispatch, onUpdateVideos } = this.props;
    if (this.state.isFavorite) {
      // Optimistic updates
      this.setState({ isFavorite: false });
      dispatch(unfavoriteVideo(video.id)).then(() => {
        onUpdateVideos && onUpdateVideos(video.id, false);
      });
    } else {
      this.setState({ isFavorite: true });
      dispatch(favoriteVideo(video.id)).then(() => {
        onUpdateVideos && onUpdateVideos(video.id, true);
      });
    }
  };

  handleShare = () => {
    const { conversation, onSelectVideo, me, dispatch } = this.props;
    const video = this.props.video || {};

    // This logic exists in the VideoDetails and the VideoList
    if (onSelectVideo) {
      dispatch(shareVideo(video, onSelectVideo, conversation));
    } else {
      this.props.onPause();
      // dispatch(navigatePush('voke.SelectFriend', {
      //   video: video.id,
      //   isLandscape: this.state.isLandscape,
      // }));
      if (!me.first_name) {
        dispatch(
          navigatePush('voke.TryItNowName', {
            onComplete: () =>
              dispatch(
                navigatePush('voke.ShareFlow', {
                  video,
                }),
              ),
          }),
        );
      } else {
        dispatch(
          navigatePush('voke.ShareFlow', {
            video,
          }),
        );
      }
    }
  };

  render() {
    const { t } = this.props;
    // const video = this.state.video || this.props.video || {};
    const video = this.props.video || {};
    const isFavorite = this.state.isFavorite;
    if (!video || !video.shares || !video.tags || !video.questions) return null;

    return (
      <Fragment>
        <ScrollView style={styles.content}>
          <Flex direction="column" style={{ paddingBottom: 110 }}>
            <Button
              icon="favorite-border"
              iconStyle={{ backgroundColor: 'transparent', paddingRight: 0 }}
              style={[
                styles.favoriteButton,
                isFavorite ? styles.favoriteFilled : null,
              ]}
              onPress={this.handleFavorite}
            />
            <Text style={styles.videoTitle}>{video.name}</Text>
            <Text style={styles.detail}>
              {t('shares', { total: video.shares })}
            </Text>
            <Text style={styles.detail}>{video.description}</Text>
            <Text style={styles.label}>{t('themes')}</Text>
            <Flex direction="row">
              {(video.tags || []).map((t, index) => (
                <Text key={`${t.id}_${index}`} style={styles.detail}>
                  {t.name}
                  {index != video.tags.length - 1 ? ', ' : null}
                </Text>
              ))}
            </Flex>
            <Text style={styles.label}>{t('kickstarters')}</Text>
            {video.questions.map(q => (
              <Flex key={q.id} direction="column">
                <Text style={styles.detail}>{q.content}</Text>
                <Flex style={styles.kickstarterSeparator} />
              </Flex>
            ))}
          </Flex>
        </ScrollView>
      </Fragment>
    );
  }
}

VideoDetails.propTypes = {
  video: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
  onSelectVideo: PropTypes.func,
  onUpdateVideos: PropTypes.func,
  conversation: PropTypes.object,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('videos')(connect(mapStateToProps)(VideoDetails));
