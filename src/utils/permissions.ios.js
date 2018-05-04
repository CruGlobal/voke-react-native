import Contacts from 'react-native-contacts';
import Permissions from 'react-native-permissions'

const AUTHORIZED = 'AUTHORIZED';
const DENIED = 'DENIED';
const NEVER_ASK_AGAIN = 'NEVER_ASK_AGAIN';
const NOT_ASKED = 'NOT_ASKED';

function checkContacts() {
  return new Promise((resolve, reject) => {
    Contacts.checkPermission((err, permission) => {
      if (err) {
        reject(err);
      } else {
        if (permission === 'undefined') {
          resolve(NOT_ASKED);
        } else if (permission === 'authorized') {
          resolve(AUTHORIZED);
        } else {
          resolve(DENIED);
        }
      }
    });
  });
}

function requestContacts() {
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        reject(DENIED);
      } else {
        resolve(contacts);
      }
    });

  });
}

function checkPush() {
  return new Promise((resolve, reject) => {
    Permissions.check('notification').then((response) => {
      resolve(response);
    }).catch(reject);
  });
}



export default {
  checkContacts,
  requestContacts,
  checkPush,

  // Permission constants
  AUTHORIZED,
  DENIED,
  NEVER_ASK_AGAIN,
  NOT_ASKED,
};