import { SOCKET_URL } from '../api/utils';

let ws = null;

export function setupSocketAction() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
      console.warn('could not start sockets because there is no access_token');
      return;
    }
    ws = new WebSocket(`${SOCKET_URL}cable?access_token=${token}`);

    ws.onopen = () => {
      // connection opened
      console.warn('socket opened');
      
      // const pushNotificationId = 'test';
      // const obj = {
      //   command: 'subscribe',
      //   identifier: `{"channel":"DeviceChannel","id":"${pushNotificationId}"}`,
      // };
      // ws.send(JSON.stringify(obj));
      // console.warn('socket message sent');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data) || {};
      const type = data && data.type;
      if (!type || type === 'ping') return;
      console.warn('socket message received: data', data);
      if (type === 'welcome') {
        console.warn('socket welcome');
      }
    };

    ws.onerror = (e) => {
      // an error occurred
      console.warn('socket message error', e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      console.warn('socket closed', e.code, e.reason);
    };
  };
}

// TODO: if the app goes into the background, close sockets
export function closeSocketAction() {
  return () => {
    if (ws) {
      ws.close(undefined, 'client closed');
      ws = null;
    }
  };
}
