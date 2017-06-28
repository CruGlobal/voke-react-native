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

function getFirstLetter(str) {
  return str && str[0] ? str[0].toUpperCase() : '';
}

export function getContacts() {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      Contacts.checkPermission( (err, permission) => {
        if (permission === 'undefined' || permission === 'authorized') {
          Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
              reject();
            } else {
              const all = lodashFilter(lodashMap(contacts, (c) => {
                // Android doesn't have familyName, just givenName
                const name = `${c.givenName || ''} ${c.familyName || ''}`.trim();
                let firstNameLetter = getFirstLetter(c.givenName) || getFirstLetter(name);
                let lastNameLetter = getFirstLetter(c.familyName) || firstNameLetter;
                return {
                  name,
                  phone: lodashMap(c.phoneNumbers, 'number'),
                  key: c.recordID,
                  id: c.recordID,
                  // Helper fields
                  nameLower: name.toLowerCase(),
                  lastNameLetter,
                  firstNameLetter, 
                };
              }), (c) => c.phone.length > 0 && !!c.name);
              console.warn('all', all.length, all);
              dispatch(setAllContacts(all));

              // API call to find out who matches voke
              dispatch(getVokeContacts(all))
                .then(() => resolve(true))
                .catch(() => reject());
            }
          });
        }
        if (permission === 'denied') {
          reject();
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

export function searchContacts(text, onlyVoke = false) {
  return (dispatch, getState) => (
    new Promise((resolve) => {
      const contacts = onlyVoke ? getState().contacts.voke : getState().contacts.all;
      const searchTextLower = text.toLowerCase();
      const searchTextUpper = text.toUpperCase();
      const isOneLetter = text.length === 1;
      const results = contacts.filter((c) => {
        if (isOneLetter) {
          return c.lastNameLetter === searchTextUpper || c.firstNameLetter === searchTextUpper;
        }
        return c.nameLower.indexOf(searchTextLower) >= 0;
      });
      resolve(results);
    })
  );
}

