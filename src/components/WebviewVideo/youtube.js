import common from './common';

export default function(id, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0; background-color: black">
      <div id="player"></div>
      <script>
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        var paused = false; /* Keep track of whether the video has been paused/resumed */

        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            height: '${common.height}',
            width: '${common.width}',
            videoId: '${id}',
            playerVars: {
              start: ${options.start || undefined},
              end: ${options.end || undefined},
              modestbranding: 1,
              playsinline: 1,
              rel: 0, /* Don't show related videos */
              showinfo: 0,
              controls: 0,
              iv_load_policy: 3,
              loop: 0,
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
              'onError': onError
            }
          });
        }

        /* Autoplay videos */
        function onPlayerReady(event) {
          event.target.playVideo();
          /* event.target.mute(); */
          checkDuration();
        }
        /* Error playing video */
        function onError(event) {
          window.postMessage('${common.ERROR}');
        }

        function checkDuration() {
          var duration = player.getDuration();
          if (duration) {
            window.postMessage(JSON.stringify({ duration: duration }));
          }
        }

        function onPlayerStateChange(event) {
          var data = event.data;
          switch (data) {
            case -1:
              /* Video hasn't started */
              break;
            case 0: /* end */
              window.postMessage('${common.FINISHED}');
              break;
            case 1: /* started */
              if (paused) {
                window.postMessage('${common.RESUMED}');
              } else {
                window.postMessage('${common.STARTED}');
                checkDuration();
              }
              break;
            case 2: /* paused */
              paused = true;
              window.postMessage('${common.PAUSED}');
              break;
            default:
              break;
          }
        }

        var interval = setInterval(function() {
          var time = player.getCurrentTime();
          if (time) {
            window.postMessage(JSON.stringify({ time: time }));
          }
        }, 1000);

        document.addEventListener('message', receiveMessage);

        function receiveMessage(event) {
          var data = JSON.parse(event.data);
          if (data.seconds) {
            player.seekTo(data.seconds);
            checkDuration();
            
          } else if (data.togglePlay) {
            var isPaused = player.getPlayerState() === 2;
            if (isPaused) {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          }
        }
      </script>
    </body>
    </html>
  `.replace(/\s\s+/ig, ''); // Stupid minify code...
  return HTML;
}
