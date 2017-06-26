import { Dimensions } from 'react-native';
import common from './common';

const { width: deviceWidth } = Dimensions.get('window');

// Vimeo is the worst...you can't play videos inline
export default function(id, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0">
      <div id="player"></div>
      <script src="https://player.vimeo.com/api/player.js"></script>
      <script>
        (function() {
          var player = new Vimeo.Player('player', {
            height: '200',
            width: '${deviceWidth}',
            id: '${id}',
            autoplay: 'true',
          });
          var paused = false; /* Keep track of whether the video has been paused/resumed */
          if (${options.start ? true : false}) {
            player.setCurrentTime(${options.start});
          }
          /* This doesn't work on iOS */
          /*
          player.on('ready', function() {
            player.play();
            window.postMessage('${common.STARTED}');
          });
          */
          player.on('play', function() {
            if (paused) {
              window.postMessage('${common.RESUMED}');
            } else {
              window.postMessage('${common.STARTED}');
            }
          });
          player.on('pause', function() {
            paused = true;
            window.postMessage('${common.PAUSED}');
          });
          player.on('end', function() { window.postMessage('${common.FINISHED}'); });
        })();
      </script>
    </body>
    </html>
  `.replace(/\s\s+/ig, ''); // Stupid minify code...
  return HTML;
}