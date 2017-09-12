import Contacts from 'react-native-contacts';
import { Alert, Linking } from 'react-native';
import lodashMap from 'lodash/map';
import lodashFilter from 'lodash/filter';
import lodashChunk from 'lodash/chunk';

import { API_URL } from '../api/utils';
import { hashPhone } from '../utils/common';
import callApi, { REQUESTS } from './api';
import CONSTANTS, { SET_ALL_CONTACTS, SET_VOKE_CONTACTS } from '../constants';

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
      Contacts.checkPermission((err, permission) => {
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
                  id: c.recordID,
                  // Helper fields
                  nameLower: name.toLowerCase(),
                  lastNameLetter,
                  firstNameLetter,
                };
              }), (c) => c.phone.length > 0 && !!c.name);
              // LOG('all', all.length, all);
              dispatch(setAllContacts(all));

              // API call to find out who matches voke
              dispatch(getVokeContacts(all))
                .then(() => resolve(true))
                .catch(() => reject());
            }
          });
        }
        if (permission === 'denied') {
          Alert.alert(
            'Voke',
            'First grant Voke permission to access your contacts. Go to Settings / Voke and allow the permission for Contacts',
            [
              {text: 'Cancel', onPress: () => LOG('canceled')},
              // TODO: Open android app settings or prompt user
              {text: 'Open Settings', onPress: () => Linking.openURL('app-settings:')},
            ]
          );
          reject();
        }
      });
    })
  );
}


export function getVokeContacts(all) {
  return (dispatch, getState) => (
    new Promise((resolve, reject) => {
      const lastUpdated = getState().contacts.lastUpdated;
      const now = new Date().valueOf();
      if (lastUpdated && (now - lastUpdated < 24 * 60 * 60 * 1000)) {
        resolve(true);
        return;
      }

      // TODO: Make API call to find out voke contacts
      dispatch(uploadContacts(all)).then((vokeFriends) => {
        dispatch(setVokeContacts(vokeFriends));
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
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

export function uploadContacts(contacts = []) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      // Format every contact into a chunk for the API call
      let formattedContacts = contacts.map((c) => ({
        mobile: hashPhone(c.phone[0]),
        local_id: c.id,
      }));
      // Break up the contacts into chucnks of [X] number of contacts for each API call
      const contactChunks = lodashChunk(formattedContacts, CONSTANTS.CONTACT_CHUNKS);

      // Setup promises for the API calls for each chunk
      const promises = contactChunks.map((c) => {
        const data = { friends: c };
        return dispatch(callApi(REQUESTS.ADD_FRIENDS, {}, data));
      });

      // TODO: Find out if we need to do this sequentially or not
      // Make all the API calls at once
      Promise.all(promises).then((responses) => {
        // LOG('upload contacts responses', responses);
        let vokeContacts = [];
        responses.forEach((r) => {
          if (r && r.friends) {
            vokeContacts = vokeContacts.concat(r.friends || []);
          }
        });
        resolve(vokeContacts);
      }).catch((err) => {
        LOG('upload contacts error', err);
        reject(err);
      });
    })
  );
}
