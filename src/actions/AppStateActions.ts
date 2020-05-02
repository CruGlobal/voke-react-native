import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { startupAction, sleepAction } from './auth'

/**
 * AppState can tell you if the app is in the foreground or background,
 * and notify you when the state changes.
 */
const appStateActions = () => {
  return async (dispatch, getState) => {
    let appState: string;
    appState = AppState.currentState;
    // Note: currentState will be null at launch while AppState retrieves it.



    // App has come to the foreground!
    const appActivated = () => {
      console.log( "🐸 appActivated!" );
      dispatch(startupAction());
    };

    // App has come to the background!
    const appDeactivated = () => {
      console.log( "🐸 appDeactivated!" );
      dispatch(sleepAction());
    };

    const handleAppStateChange = (nextAppState: string) => {
      // active | background | inactive [iOS]
      if ( nextAppState === "active"
        && (appState === "background" ||  appState === "inactive")) {
        // App has come to the foreground!
        appActivated();
      } else {
        // background | inactive
        // App has come to the background!
        appDeactivated();
      }
      appState = nextAppState;
    };

    // const register = () => {
      // This event is received when the app state has changed.
      AppState.addEventListener("change", handleAppStateChange);
    // };

    /* const destroy = () => {
      // Clean-up.
      AppState.removeEventListener("change", handleAppStateChange);
    }; */

    // register();
  }
};

export default appStateActions;
