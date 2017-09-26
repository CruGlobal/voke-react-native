import videoUtils from '../../utils/video';
import {DEFAULT} from '../../theme';

export default {
  width: videoUtils.WIDTH,
  landscapeWidth: DEFAULT.FULL_HEIGHT,
  landscapeHeight: DEFAULT.FULL_WIDTH,
  height: videoUtils.HEIGHT,
  STARTED: 'started',
  RESUMED: 'resumed',
  PAUSED: 'paused',
  FINISHED: 'finished',
  ERROR: 'error',
  getYoutubeId: function(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      LOG('error extracting the Youtube id from', url);
      return null;
    }
  },
  getVimeoId: function(url) {
    var regExp = /^.*(vimeo?\.com\/(\d+)).*/;
    var match = url.match(regExp);
    if (match) {
      return match[2];
    } else {
      LOG('error extracting the Videmo id from', url);
      return null;
    }
  },
};
