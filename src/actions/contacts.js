import Contacts from 'react-native-contacts';
import lodashMap from 'lodash/map';
import lodashFilter from 'lodash/filter';

import { SET_ALL_CONTACTS, SET_VOKE_CONTACTS } from '../constants';

export function setAllContacts(all) {
  return (dispatch) => {
    dispatch({ type: SET_ALL_CONTACTS, all });
  };
}

export function setVokeContacts(voke) {
  return (dispatch) => {
    dispatch({ type: SET_VOKE_CONTACTS, voke });
  };
}

export function getContacts() {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
          reject();
        } else {
          const all = lodashFilter(lodashMap(contacts, (c) => ({
            name: `${c.givenName} ${c.familyName}`.trim(),
            phone: lodashMap(c.phoneNumbers, 'number'),
            id: c.recordID,
          })), (c) => c.phone.length > 0);
          dispatch(setAllContacts(all));

          // API call to find out who matches voke
          dispatch(getVokeContacts(all))
            .then(() => resolve(true))
            .catch(() => reject());
        }
      });
    })
  );
}


export function getVokeContacts(all) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      // TODO: Make API call to find out voke contacts
      // dispatch(setVokeContacts(matches));
      resolve(true);
    })
  );
}
