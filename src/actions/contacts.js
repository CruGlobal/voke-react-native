import { Platform, Alert, Linking } from 'react-native';
import lodashMap from 'lodash/map';
import lodashFilter from 'lodash/filter';
import lodashChunk from 'lodash/chunk';

import { hashPhone } from '../utils/common';
import callApi, { REQUESTS } from './api';
import CONSTANTS, { SET_ALL_CONTACTS, SET_VOKE_CONTACTS, SET_CONTACTS_LOADING } from '../constants';
import Permissions from '../utils/permissions';

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

export function getContacts(force = false) {
  return (dispatch, getState) => (
    new Promise((resolve, reject) => {

      if (!force) {
        const lastUpdated = getState().contacts.lastUpdated;
        const now = new Date().valueOf();
        if (lastUpdated && (now - lastUpdated < 24 * 60 * 60 * 1000)) {
          resolve(true);
          return;
        }
      }

      // Keep track of when the contacts are loading and finished loading
      dispatch({ type: SET_CONTACTS_LOADING, isLoading: true });

      Permissions.checkContacts().then((permission) => {
        if (permission === Permissions.DENIED) {
          if (Platform.OS === 'ios') {
            Alert.alert(
              'Voke',
              'First grant Voke permission to access your contacts. Go to Settings / Voke and allow the permission for Contacts',
              [
                { text: 'Cancel', onPress: () => LOG('canceled') },
                { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
              ]
            );
          }
          dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
          reject();
          return;
        }

        if (permission === Permissions.NOT_ASKED || permission === Permissions.AUTHORIZED) {
          Permissions.requestContacts().then((contacts) => {
            const all = lodashFilter(lodashMap(contacts, (c) => {
              // Android doesn't have familyName, just givenName
              const name = `${c.givenName || ''} ${c.familyName || ''}`.trim();
              const firstNameLetter = getFirstLetter(c.givenName) || getFirstLetter(name);
              const lastNameLetter = getFirstLetter(c.familyName) || firstNameLetter;
              return {
                name,
                phone: lodashMap(c.phoneNumbers, 'number'),
                id: c.recordID,
                // Helper fields
                nameLower: name.toLowerCase(),
                lastNameLetter,
                firstNameLetter,
                initials: firstNameLetter + lastNameLetter,
              };
            }), (c) => c.phone.length > 0 && !!c.name);
            // LOG('all', all.length, all);
            dispatch(setAllContacts(all));

            // API call to find out who matches voke
            dispatch(getVokeContacts(all))
              .then(() => {
                dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
                resolve(true);
              })
              .catch(() => {
                dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
                reject();
              });
          }).catch((err) => {
            dispatch({ type: SET_CONTACTS_LOADING, isLoading: false });
            if (err === Permissions.DENIED) {
              Alert.alert('Could not get contacts', 'There was an error getting your contacts.');
            }
            reject(Permissions.DENIED);
          });
        }
      }).catch(reject);
    })
  );
}


export function getVokeContacts(all) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      dispatch(uploadContacts(all)).then((vokeFriends) => {
        // Get just the contacts with the app
        const vokeFriendsWithApp = vokeFriends.filter((c) => c.mobile_app);
        dispatch(setVokeContacts(vokeFriendsWithApp));
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
