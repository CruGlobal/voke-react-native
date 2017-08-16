import common from './common';

// Vimeo is the worst...you can't play videos inline
export default function(id, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0; background-color: black">
      <div id="player"></div>
      <script src="https://player.vimeo.com/api/player.js"></script>
      <script>
        (function() {
          var player = new Vimeo.Player('player', {
            height: '${common.height}',
            width: '${common.width}',
            id: '${id}',
            autoplay: 'true',
            portait: true,
            title: false,
            byline: false,
          });
          var paused = false; /* Keep track of whether the video has been paused/resumed */
          if (${options.start ? true : false}) {
            player.setCurrentTime(${options.start});
          }
          /* This doesn't work on iOS */
          /*
          player.ready().then(function() {
            player.play();
            window.postMessage('${common.STARTED}');
          });
          */
          player.on('play', function() {
            if (paused) {
              window.postMessage('${common.RESUMED}');
            } else {
              window.postMessage('${common.STARTED}');
              checkDuration();
            }
          });
          player.on('pause', function() {
            paused = true;
            window.postMessage('${common.PAUSED}');
          });
          player.on('end', function() { window.postMessage('${common.FINISHED}'); });
          player.on('error', function() { window.postMessage('${common.ERROR}'); });

          function checkDuration() {
            player.getDuration().then(function(duration) {
              window.postMessage(JSON.stringify({ duration: duration }));
            });
          }

          var interval = setInterval(function() {
            player.getCurrentTime().then(function(time) {
              if (time) {
                window.postMessage(JSON.stringify({ time: time }));
              }
            });
          }, 1000);

          document.addEventListener('message', receiveMessage);

          function receiveMessage(event) {
            var data = JSON.parse(event.data);
            if (data.seconds) {
              player.setCurrentTime(data.seconds).then(function() {
                player.play();
              });
            } else if (data.togglePlay) {
              player.getPaused().then(function(isPaused) {
                if (isPaused) {
                  player.play();
                } else {
                  player.pause();
                }
              });
            }
          }

        })();
      </script>
    </body>
    </html>
  `.replace(/\s\s+/ig, ''); // Stupid minify code...
  return HTML;
}