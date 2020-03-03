import SendSMS from 'react-native-sms';

export function send(phone, message) {
  return new Promise((resolve, reject) => {
    SendSMS.send(
      {
        body: message,
        recipients: [phone],
        successTypes: ['sent', 'queued', 'inbox', 'outbox', 'draft'],
      },
      (completed, cancelled, error) => {
        if (completed) {
          resolve();
        } else {
          reject();
        }
        // if (error) {
        //   LOG('errror sending message', error);
        // }
      },
    );
  });
}
