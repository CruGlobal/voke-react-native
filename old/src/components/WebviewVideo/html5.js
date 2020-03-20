import common from './common';

// Vimeo is the worst...you can't play videos inline
export default function(url, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0; background-color: black;">
      <script>
        var link = document.createElement('link');
        var script = document.createElement('script');
        var video;
        link.href = 'https://vjs.zencdn.net/c/video-js.css';
        link.rel = 'stylesheet';
        document.body.appendChild(link);
        script.src = 'https://vjs.zencdn.net/c/video.js';
        script.onload = function() {
          video = document.createElement('video');
          video.id = 'video';
          /* Video properties */
          video.setAttribute('poster', '${options.thumbnail}');
          video.setAttribute('controls', false);
          video.setAttribute('class', 'video-js vjs-default-skin');
          video.setAttribute('width', '100%');
          video.setAttribute('height', '100%');
          video.setAttribute('preload', true);
          video.setAttribute('playsinline', true);
          video.setAttribute('autoplay', false);
          video.setAttribute('webkit-playsinline', true);
          video.style.position = 'absolute';
          video.style.top = '0';
          video.style.left = '0';
          video.style.right = '0';

          video.controls = false;
          video.autoplay = ${!options.forceNoAutoPlay};
          video.preload = true;
          video.playsinline = true;
          video.webkitPlaysinline = true;

          /* Setup the play/pause listeners */
          video.onplay = onPlay;
          video.onpause = onPaused;
          video.onerror = onError;
          video.onended = onEnded;

          /* HACK: need to get the duration with autoplay enabled */
          setTimeout(checkDuration, 500);
          setTimeout(checkDuration, 1500);
          setTimeout(checkDuration, 3500);

          /* Setup the source tag for the video */
          var source = document.createElement("source");
          source.setAttribute('type', 'video/mp4');
          source.setAttribute('src', '${url}');
          video.append(source);
          document.body.appendChild(video);
          videojs('video');

          /* Force play */
          setTimeout(function() { if (video && video.play) video.play(); }, 500);
        };
        document.body.appendChild(script);

        var paused = false; /* Keep track of whether the video has been paused/resumed */
        function onPlay() {
          if (paused) {
            window.postMessage('${common.RESUMED}');
          } else {
            window.postMessage('${common.STARTED}');
            checkDuration();
          }
        }
        function onPaused() {
          paused = true;
          window.postMessage('${common.PAUSED}');
          checkDuration();
        }
        function onError() {
          window.postMessage('${common.ERROR}');
        }
        function onEnded() {
          window.postMessage('${common.FINISHED}');
        }



        function checkDuration() {
          var duration = video.duration;
          if (duration) {
            window.postMessage(JSON.stringify({ duration: duration }));
          }
        }


        var interval = setInterval(function() {
          if (video && video.currentTime) {
            window.postMessage(JSON.stringify({ time: video.currentTime }));
          }
        }, 1000);

        document.addEventListener('message', receiveMessage);

        function receiveMessage(event) {
          if (!video) return;
          var data = JSON.parse(event.data);
          if (data.seconds) {
            video.currentTime = data.seconds;
            video.play();
          } else if (data.togglePlay) {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          } else if (data.forcePause) {
            video.pause();
          } else if (data.forcePlay) {
            video.play();
          } else if (data.replayVideo) {
            video.currentTime = ${options.start || 0};
            video.play();
          }
        }


      </script>
    </body>
    </html>
  `.replace(/\s\s+/gi, ''); // Stupid minify code...
  return HTML;
}
