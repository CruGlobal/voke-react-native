import videoUtils from '../../utils/video';

export default {
  width: videoUtils.WIDTH,
  height: videoUtils.HEIGHT,
  STARTED: 'started',
  RESUMED: 'resumed',
  PAUSED: 'paused',
  FINISHED: 'finished',
  getYoutubeId: function(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      console.warn('error extracting the Youtube id from', url);
      return null;
    }
  },
  getVimeoId: function(url) {
    var regExp = /^.*(vimeo?\.com\/(\d+)).*/;
    var match = url.match(regExp);
    if (match) {
      return match[2];
    } else {
      console.warn('error extracting the Videmo id from', url);
      return null;
    }
  },
};