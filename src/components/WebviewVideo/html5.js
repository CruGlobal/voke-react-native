import common from './common';

// Vimeo is the worst...you can't play videos inline
export default function(url, options = {}) {
  const HTML = `
    <html>
    <body style="padding: 0; margin: 0; background-color: black">
      <script>
        var link = document.createElement('link');
        var script = document.createElement('script');
        link.href = 'https://vjs.zencdn.net/c/video-js.css';
        link.rel = 'stylesheet';
        document.body.appendChild(link);
        script.src = 'https://vjs.zencdn.net/c/video.js';
        script.onload = function() {
          var video = document.createElement('video');
          video.id = 'video';
          /* Video properties */
          video.setAttribute('poster', '${options.thumbnail}');
          video.setAttribute('controls', 'true');
          video.setAttribute('class', 'video-js vjs-default-skin');
          video.setAttribute('width', '${common.width}');
          video.setAttribute('height', '${common.height}');
          video.setAttribute('preload', 'true');
          video.setAttribute('playsinline', 'true');
          video.setAttribute('autoplay', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          /* Setup the play/pause listeners */
          video.onplay = onPlay;
          video.onpause = onPaused;

          /* Setup the source tag for the video */
          var source = document.createElement("source"); 
          source.setAttribute('type', 'video/mp4');
          source.setAttribute('src', '${url}');
          video.append(source);
          document.body.appendChild(video);
          videojs('video'); 
        };
        document.body.appendChild(script);
        
        var paused = false; /* Keep track of whether the video has been paused/resumed */
        function onPlay() {
          if (paused) {
            window.postMessage('${common.RESUMED}');
          } else {
            window.postMessage('${common.STARTED}');
          }
        }
        function onPaused() {
          paused = true;
          window.postMessage('${common.PAUSED}');
        }
      </script>
    </body>
    </html>
  `;
  // `.replace(/\s\s+/ig, ''); // Stupid minify code...
  return HTML;
}