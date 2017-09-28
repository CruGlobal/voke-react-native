import common from './common';

// Vimeo is the worst...you can't play videos inline
export default function(id, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0; height: ${common.height}; width: ${common.width} background-color: black">
      <iframe src="https://player.vimeo.com/video/${id}" width="${common.width}" height="${common.height}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      <script src="https://player.vimeo.com/api/player.js"></script>
      <script>
        (function() {
          var iframe = document.querySelector('iframe');
          var player = new Vimeo.Player(iframe, {
            autoplay: false,
            portait: true,
            title: false,
            byline: false,
          });
          var paused = false; /* Keep track of whether the video has been paused/resumed */
          if (${options.start ? true : false}) {
            player.setCurrentTime(${options.start});
          }
          player.on('play', function() {
            if (paused) {
              window.postMessage('${common.RESUMED}');
            } else {
              checkDuration();
              setTimeout(checkDuration, 500);
              setTimeout(checkDuration, 1500);
              setTimeout(checkDuration, 3500);

              window.postMessage('${common.STARTED}');
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
            } else if (data.forcePause) {
              player.pause();
            } else if (data.forcePlay) {
              player.play();
            } else if (data.replayVideo) {
              player.setCurrentTime(${options.start || 0}).then(function() {
                player.play();
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
