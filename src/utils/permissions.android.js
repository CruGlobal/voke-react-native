import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

const AUTHORIZED = 'AUTHORIZED';
const DENIED = 'DENIED';
const NEVER_ASK_AGAIN = 'NEVER_ASK_AGAIN';
const NOT_ASKED = 'NOT_ASKED';

function check(permission) {
  return new Promise((resolve) => {
    PermissionsAndroid.check(permission).then((isGranted) => {
      isGranted ? resolve(AUTHORIZED) : resolve(NOT_ASKED);
    });
  });
}

function checkContacts() {
  return check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
}

function request(permission) {
  return PermissionsAndroid.request(permission);
}

function requestContacts() {
  return new Promise((resolve, reject) => {
    request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((permission) => {
      // Android <6.0 returns true
      if (permission === true || permission === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            reject(DENIED);
          } else {
            resolve(contacts);
          }
        });
      } else {
        reject(DENIED);
      }
    }).catch((err) => {
      LOG('error requesting contacts', err);
      reject(DENIED);
    });
  });
}

export default {
  checkContacts,
  requestContacts,

  // Permission constants
  AUTHORIZED,
  DENIED,
  NEVER_ASK_AGAIN,
  NOT_ASKED,
};
